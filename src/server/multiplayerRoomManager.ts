import { WebSocket } from 'ws';
import { 
  ClientMessage, 
  MultiplayerPlayer, 
  RoomConfig, 
  RoomState 
} from '../types/multiplayer';
import { Question, RoundResult, CoupleVerdict } from '../types/quiz';

interface InternalPlayer extends MultiplayerPlayer {
  ws?: WebSocket;
}

interface InternalRoom {
  code: string;
  stage: RoomState['stage'];
  config: RoomConfig;
  player1: InternalPlayer;
  player2?: InternalPlayer;
  currentManche: number;
  currentQuestionIndex: number;
  questions: Question[];
  p1Answers: string[]; // Target's secret answers
  p2Answers: string[]; // Guesser's guesses
  matchDecisions: Record<number, boolean>;
  cumulativeHistory: RoundResult[];
  lastMancheScore: number;
  verdict?: CoupleVerdict;
  createdAt: number;
}

const ROOM_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No ambiguous characters (I, O, 0, 1)

function generateRoomCode(): string {
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += ROOM_ALPHABET.charAt(Math.floor(Math.random() * ROOM_ALPHABET.length));
  }
  return code;
}

export class MultiplayerRoomManager {
  private rooms = new Map<string, InternalRoom>();
  private wsToPlayer = new WeakMap<WebSocket, { roomCode: string; playerId: string }>();

  constructor() {
    // Periodic cleanup of stale rooms (e.g., > 6 hours old)
    setInterval(() => {
      const now = Date.now();
      for (const [code, room] of this.rooms.entries()) {
        if (now - room.createdAt > 6 * 3600 * 1000) {
          this.rooms.delete(code);
        }
      }
    }, 60 * 60 * 1000);
  }

  public handleConnection(ws: WebSocket) {
    ws.on('message', (data: string | Buffer) => {
      try {
        const msg: ClientMessage = JSON.parse(data.toString());
        this.handleMessage(ws, msg);
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    });

    ws.on('close', () => {
      this.handleDisconnect(ws);
    });

    ws.on('error', (err) => {
      console.warn('WebSocket error:', err);
    });
  }

  private send(ws: WebSocket | undefined, payload: any) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  }

  private broadcastToRoom(room: InternalRoom, message: any) {
    this.send(room.player1.ws, message);
    if (room.player2?.ws) {
      this.send(room.player2.ws, message);
    }
  }

  private getClientRoomState(room: InternalRoom, forPlayerId?: string): RoomState {
    const isTarget =
      room.currentManche % 2 === 1
        ? forPlayerId === room.player1.id
        : forPlayerId === room.player2?.id;

    const p1AnsweredCount = room.p1Answers.filter((a) => a && a.trim() !== '').length;
    const p2AnsweredCount = room.p2Answers.filter((a) => a && a.trim() !== '').length;

    const activeQuestion = room.questions[room.currentQuestionIndex];
    let currentTargetAnswer: string | undefined = undefined;
    let currentGuesserAnswer: string | undefined = undefined;
    let isCurrentAutoMatch: boolean | undefined = undefined;

    if (room.stage === 'reveal_turn' || room.stage === 'round_switch' || room.stage === 'summary') {
      currentTargetAnswer = room.p1Answers[room.currentQuestionIndex];
      currentGuesserAnswer = room.p2Answers[room.currentQuestionIndex];
      if (currentTargetAnswer && currentGuesserAnswer) {
        isCurrentAutoMatch =
          currentTargetAnswer.trim().toLowerCase() === currentGuesserAnswer.trim().toLowerCase();
      }
    } else if (isTarget) {
      // Target can see their own entered answer during p1_series
      currentTargetAnswer = room.p1Answers[room.currentQuestionIndex];
    }

    return {
      code: room.code,
      stage: room.stage,
      config: room.config,
      player1: {
        id: room.player1.id,
        name: room.player1.name,
        avatar: room.player1.avatar,
        score: room.player1.score,
        connected: room.player1.connected,
        isHost: true,
        lastActive: room.player1.lastActive,
      },
      player2: room.player2
        ? {
            id: room.player2.id,
            name: room.player2.name,
            avatar: room.player2.avatar,
            score: room.player2.score,
            connected: room.player2.connected,
            isHost: false,
            lastActive: room.player2.lastActive,
          }
        : undefined,
      currentManche: room.currentManche,
      currentQuestionIndex: room.currentQuestionIndex,
      totalQuestions: room.questions.length,
      activeQuestion,
      questions: room.questions,
      p1AnsweredCount,
      p2AnsweredCount,
      currentTargetAnswer,
      currentGuesserAnswer,
      targetAnswers: isTarget ? [...room.p1Answers] : undefined,
      isCurrentAutoMatch,
      matchDecisions: room.matchDecisions,
      lastMancheScore: room.lastMancheScore,
      cumulativeHistory: room.cumulativeHistory,
      verdict: room.verdict,
    };
  }

  private syncRoom(room: InternalRoom) {
    if (room.player1.ws) {
      this.send(room.player1.ws, {
        type: 'sync_state',
        roomState: this.getClientRoomState(room, room.player1.id),
      });
    }
    if (room.player2?.ws) {
      this.send(room.player2.ws, {
        type: 'sync_state',
        roomState: this.getClientRoomState(room, room.player2.id),
      });
    }
  }

  private handleMessage(ws: WebSocket, msg: ClientMessage) {
    switch (msg.type) {
      case 'create_room': {
        let code = generateRoomCode();
        while (this.rooms.has(code)) {
          code = generateRoomCode();
        }

        const hostId = `p1_${Date.now()}`;
        const newRoom: InternalRoom = {
          code,
          stage: 'lobby',
          config: msg.config,
          player1: {
            id: hostId,
            name: msg.hostName || 'Moi',
            avatar: msg.hostAvatar || '🦊',
            score: 0,
            connected: true,
            isHost: true,
            lastActive: Date.now(),
            ws,
          },
          currentManche: 1,
          currentQuestionIndex: 0,
          questions: [],
          p1Answers: [],
          p2Answers: [],
          matchDecisions: {},
          cumulativeHistory: [],
          lastMancheScore: 0,
          createdAt: Date.now(),
        };

        this.rooms.set(code, newRoom);
        this.wsToPlayer.set(ws, { roomCode: code, playerId: hostId });

        this.send(ws, {
          type: 'room_created',
          code,
          playerId: hostId,
          roomState: this.getClientRoomState(newRoom, hostId),
        });
        break;
      }

      case 'reconnect': {
        const cleanCode = msg.code.trim().toUpperCase();
        const room = this.rooms.get(cleanCode);
        if (!room) {
          this.send(ws, { type: 'error', message: 'Salon introuvable ou expiré.' });
          return;
        }

        if (room.player1.id === msg.playerId) {
          room.player1.ws = ws;
          room.player1.connected = true;
          room.player1.lastActive = Date.now();
          this.wsToPlayer.set(ws, { roomCode: cleanCode, playerId: msg.playerId });
          this.send(ws, {
            type: 'room_joined',
            code: cleanCode,
            playerId: msg.playerId,
            roomState: this.getClientRoomState(room, msg.playerId),
          });
          this.syncRoom(room);
          return;
        }

        if (room.player2?.id === msg.playerId) {
          room.player2.ws = ws;
          room.player2.connected = true;
          room.player2.lastActive = Date.now();
          this.wsToPlayer.set(ws, { roomCode: cleanCode, playerId: msg.playerId });
          this.send(ws, {
            type: 'room_joined',
            code: cleanCode,
            playerId: msg.playerId,
            roomState: this.getClientRoomState(room, msg.playerId),
          });
          this.syncRoom(room);
          return;
        }

        this.send(ws, { type: 'error', message: 'Session introuvable dans ce salon.' });
        break;
      }

      case 'join_room': {
        const cleanCode = msg.code.trim().toUpperCase();
        const room = this.rooms.get(cleanCode);

        if (!room) {
          this.send(ws, { type: 'error', message: 'Salon introuvable. Vérifie le code !' });
          return;
        }

        // 1. Exact Reconnection check by playerId
        if (msg.playerId && room.player1.id === msg.playerId) {
          room.player1.ws = ws;
          room.player1.connected = true;
          room.player1.lastActive = Date.now();
          this.wsToPlayer.set(ws, { roomCode: cleanCode, playerId: msg.playerId });
          this.send(ws, {
            type: 'room_joined',
            code: cleanCode,
            playerId: msg.playerId,
            roomState: this.getClientRoomState(room, msg.playerId),
          });
          this.syncRoom(room);
          return;
        }

        if (msg.playerId && room.player2?.id === msg.playerId) {
          room.player2.ws = ws;
          room.player2.connected = true;
          room.player2.lastActive = Date.now();
          this.wsToPlayer.set(ws, { roomCode: cleanCode, playerId: msg.playerId });
          this.send(ws, {
            type: 'room_joined',
            code: cleanCode,
            playerId: msg.playerId,
            roomState: this.getClientRoomState(room, msg.playerId),
          });
          this.syncRoom(room);
          return;
        }

        // 2. Fallback reconnection for active in-progress game if a player got disconnected
        if (room.stage !== 'lobby') {
          // If player 2 was disconnected, re-attach guest
          if (room.player2 && !room.player2.connected) {
            room.player2.ws = ws;
            room.player2.connected = true;
            room.player2.lastActive = Date.now();
            if (msg.playerName) room.player2.name = msg.playerName;
            if (msg.playerAvatar) room.player2.avatar = msg.playerAvatar;
            this.wsToPlayer.set(ws, { roomCode: cleanCode, playerId: room.player2.id });
            this.send(ws, {
              type: 'room_joined',
              code: cleanCode,
              playerId: room.player2.id,
              roomState: this.getClientRoomState(room, room.player2.id),
            });
            this.syncRoom(room);
            return;
          }

          // If player 1 was disconnected, re-attach host
          if (!room.player1.connected) {
            room.player1.ws = ws;
            room.player1.connected = true;
            room.player1.lastActive = Date.now();
            if (msg.playerName) room.player1.name = msg.playerName;
            if (msg.playerAvatar) room.player1.avatar = msg.playerAvatar;
            this.wsToPlayer.set(ws, { roomCode: cleanCode, playerId: room.player1.id });
            this.send(ws, {
              type: 'room_joined',
              code: cleanCode,
              playerId: room.player1.id,
              roomState: this.getClientRoomState(room, room.player1.id),
            });
            this.syncRoom(room);
            return;
          }

          this.send(ws, { type: 'error', message: 'Cette partie est déjà en cours avec 2 joueurs.' });
          return;
        }

        // 3. New guest joining in lobby
        if (room.player2 && room.player2.connected) {
          this.send(ws, { type: 'error', message: 'Ce salon est déjà complet (2/2 joueurs).' });
          return;
        }

        const guestId = `p2_${Date.now()}`;
        room.player2 = {
          id: guestId,
          name: msg.playerName || 'Mon Amour',
          avatar: msg.playerAvatar || '🐱',
          score: 0,
          connected: true,
          isHost: false,
          lastActive: Date.now(),
          ws,
        };

        this.wsToPlayer.set(ws, { roomCode: cleanCode, playerId: guestId });

        this.send(ws, {
          type: 'room_joined',
          code: cleanCode,
          playerId: guestId,
          roomState: this.getClientRoomState(room, guestId),
        });

        this.syncRoom(room);
        break;
      }

      case 'start_game': {
        const room = this.rooms.get(msg.code);
        if (!room) return;

        room.questions = msg.questions;
        room.stage = 'p1_series';
        room.currentQuestionIndex = 0;
        room.p1Answers = new Array(msg.questions.length).fill('');
        room.p2Answers = new Array(msg.questions.length).fill('');
        room.matchDecisions = {};
        room.lastMancheScore = 0;

        this.syncRoom(room);
        break;
      }

      case 'submit_target_answer': {
        const room = this.rooms.get(msg.code);
        if (!room) return;

        room.p1Answers[msg.questionIndex] = msg.answer;
        if (msg.updatedOptions && room.questions[msg.questionIndex]) {
          room.questions[msg.questionIndex].options = [...msg.updatedOptions];
        }
        this.syncRoom(room);
        break;
      }

      case 'update_question_options': {
        const room = this.rooms.get(msg.code);
        if (!room) return;

        if (room.questions[msg.questionIndex]) {
          room.questions[msg.questionIndex].options = [...msg.options];
          this.syncRoom(room);
        }
        break;
      }

      case 'replace_question': {
        const room = this.rooms.get(msg.code);
        if (!room) return;

        if (room.questions[msg.questionIndex]) {
          room.questions[msg.questionIndex] = msg.question;
          this.syncRoom(room);
        }
        break;
      }

      case 'finish_target_series': {
        const room = this.rooms.get(msg.code);
        if (!room) return;

        room.stage = 'p2_turn';
        room.currentQuestionIndex = 0;
        this.syncRoom(room);
        break;
      }

      case 'submit_guesser_answer': {
        const room = this.rooms.get(msg.code);
        if (!room) return;

        room.p2Answers[msg.questionIndex] = msg.answer;
        room.currentQuestionIndex = msg.questionIndex;
        room.stage = 'reveal_turn';

        this.syncRoom(room);
        break;
      }

      case 'resolve_match': {
        const room = this.rooms.get(msg.code);
        if (!room) return;

        room.matchDecisions[msg.questionIndex] = msg.isMatch;
        this.syncRoom(room);
        break;
      }

      case 'next_reveal_or_question': {
        const room = this.rooms.get(msg.code);
        if (!room) return;

        const isLastQuestion = room.currentQuestionIndex >= room.questions.length - 1;

        if (!isLastQuestion) {
          // Go to guess next question
          room.currentQuestionIndex += 1;
          room.stage = 'p2_turn';
          this.syncRoom(room);
        } else {
          // Manche completed! Calculate results & scores
          let manchePoints = 0;
          const targetPlayer = room.currentManche % 2 === 1 ? room.player1 : room.player2!;
          const guesserPlayer = room.currentManche % 2 === 1 ? room.player2! : room.player1;

          room.questions.forEach((q, idx) => {
            const targetA = room.p1Answers[idx] || '';
            const guesserA = room.p2Answers[idx] || '';
            const autoMatch =
              targetA.trim().toLowerCase() === guesserA.trim().toLowerCase() && targetA !== '';
            const isMatch = room.matchDecisions[idx] !== undefined ? room.matchDecisions[idx] : autoMatch;

            if (isMatch) {
              const pts = q.difficulty === 'spicy' ? 20 : 10;
              manchePoints += pts;
            }

            room.cumulativeHistory.push({
              roundNumber: room.cumulativeHistory.length + 1,
              question: q,
              targetPlayer: {
                id: targetPlayer.id,
                name: targetPlayer.name,
                avatar: targetPlayer.avatar,
                score: targetPlayer.score,
              },
              guesserPlayer: {
                id: guesserPlayer.id,
                name: guesserPlayer.name,
                avatar: guesserPlayer.avatar,
                score: guesserPlayer.score,
              },
              targetAnswer: targetA,
              guesserAnswer: guesserA,
              isMatch,
            });
          });

          // Award score to guesser
          if (room.currentManche % 2 === 1 && room.player2) {
            room.player2.score += manchePoints;
          } else {
            room.player1.score += manchePoints;
          }

          room.lastMancheScore = manchePoints;
          room.stage = 'round_switch';
          this.syncRoom(room);
        }
        break;
      }

      case 'start_next_manche': {
        const room = this.rooms.get(msg.code);
        if (!room) return;

        room.currentManche += 1;
        room.questions = msg.questions;
        room.currentQuestionIndex = 0;
        room.p1Answers = new Array(msg.questions.length).fill('');
        room.p2Answers = new Array(msg.questions.length).fill('');
        room.matchDecisions = {};
        room.stage = 'p1_series';

        this.syncRoom(room);
        break;
      }

      case 'go_to_summary': {
        const room = this.rooms.get(msg.code);
        if (!room) return;

        room.stage = 'summary';
        if (msg.verdict) {
          room.verdict = msg.verdict;
        }
        this.syncRoom(room);
        break;
      }

      case 'leave_room': {
        this.handleDisconnect(ws);
        break;
      }
    }
  }

  private handleDisconnect(ws: WebSocket) {
    const meta = this.wsToPlayer.get(ws);
    if (!meta) return;

    const room = this.rooms.get(meta.roomCode);
    if (!room) return;

    if (room.player1.id === meta.playerId) {
      room.player1.connected = false;
      room.player1.ws = undefined;
    } else if (room.player2?.id === meta.playerId) {
      room.player2.connected = false;
      room.player2.ws = undefined;
    }

    this.wsToPlayer.delete(ws);

    // If both players left and room is in lobby, delete room
    if (!room.player1.connected && (!room.player2 || !room.player2.connected)) {
      if (room.stage === 'lobby') {
        this.rooms.delete(meta.roomCode);
        return;
      }
    }

    this.syncRoom(room);
  }
}
