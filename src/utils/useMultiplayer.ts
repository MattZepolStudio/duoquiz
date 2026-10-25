import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ClientMessage, 
  MultiplayerPlayer, 
  RoomConfig, 
  RoomState, 
  ServerMessage 
} from '../types/multiplayer';
import { Question, CoupleVerdict } from '../types/quiz';

export function useMultiplayer() {
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('duoquiz_multi_player_id') || null;
    } catch {
      return null;
    }
  });
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);

  const getWsUrl = () => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}/ws`;
  };

  const connect = useCallback((): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        resolve(socketRef.current);
        return;
      }

      setIsConnecting(true);
      const ws = new WebSocket(getWsUrl());

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setErrorMessage(null);
        socketRef.current = ws;
        resolve(ws);
      };

      ws.onmessage = (event) => {
        try {
          const msg: ServerMessage = JSON.parse(event.data);
          if (msg.type === 'room_created' || msg.type === 'room_joined') {
            setRoomState(msg.roomState);
            setPlayerId(msg.playerId);
            try {
              localStorage.setItem('duoquiz_multi_player_id', msg.playerId);
              localStorage.setItem('duoquiz_multi_room_code', msg.code);
            } catch {}
          } else if (msg.type === 'sync_state') {
            setRoomState(msg.roomState);
          } else if (msg.type === 'error') {
            setErrorMessage(msg.message);
          }
        } catch (err) {
          console.error('Error handling WebSocket message:', err);
        }
      };

      ws.onerror = () => {
        setIsConnecting(false);
        setErrorMessage('Impossible de contacter le serveur multijoueur.');
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
        socketRef.current = null;
      };
    });
  }, []);

  const sendMessage = useCallback((msg: ClientMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
    }
  }, []);

  const createRoom = useCallback(
    async (hostName: string, hostAvatar: string, config: RoomConfig) => {
      setErrorMessage(null);
      const ws = await connect();
      ws.send(
        JSON.stringify({
          type: 'create_room',
          hostName,
          hostAvatar,
          config,
        } as ClientMessage)
      );
    },
    [connect]
  );

  const joinRoom = useCallback(
    async (code: string, playerName: string, playerAvatar: string) => {
      setErrorMessage(null);
      const ws = await connect();
      ws.send(
        JSON.stringify({
          type: 'join_room',
          code: code.trim().toUpperCase(),
          playerName,
          playerAvatar,
          playerId: playerId || undefined,
        } as ClientMessage)
      );
    },
    [connect, playerId]
  );

  const startGame = useCallback(
    (questions: Question[]) => {
      if (!roomState) return;
      sendMessage({
        type: 'start_game',
        code: roomState.code,
        questions,
      });
    },
    [roomState, sendMessage]
  );

  const submitTargetAnswer = useCallback(
    (questionIndex: number, answer: string) => {
      if (!roomState) return;
      sendMessage({
        type: 'submit_target_answer',
        code: roomState.code,
        questionIndex,
        answer,
      });
    },
    [roomState, sendMessage]
  );

  const finishTargetSeries = useCallback(() => {
    if (!roomState) return;
    sendMessage({
      type: 'finish_target_series',
      code: roomState.code,
    });
  }, [roomState, sendMessage]);

  const submitGuesserAnswer = useCallback(
    (questionIndex: number, answer: string) => {
      if (!roomState) return;
      sendMessage({
        type: 'submit_guesser_answer',
        code: roomState.code,
        questionIndex,
        answer,
      });
    },
    [roomState, sendMessage]
  );

  const resolveMatch = useCallback(
    (questionIndex: number, isMatch: boolean) => {
      if (!roomState) return;
      sendMessage({
        type: 'resolve_match',
        code: roomState.code,
        questionIndex,
        isMatch,
      });
    },
    [roomState, sendMessage]
  );

  const nextRevealOrQuestion = useCallback(() => {
    if (!roomState) return;
    sendMessage({
      type: 'next_reveal_or_question',
      code: roomState.code,
    });
  }, [roomState, sendMessage]);

  const startNextManche = useCallback(
    (questions: Question[]) => {
      if (!roomState) return;
      sendMessage({
        type: 'start_next_manche',
        code: roomState.code,
        questions,
      });
    },
    [roomState, sendMessage]
  );

  const goToSummary = useCallback(
    (verdict?: CoupleVerdict) => {
      if (!roomState) return;
      sendMessage({
        type: 'go_to_summary',
        code: roomState.code,
        verdict,
      });
    },
    [roomState, sendMessage]
  );

  const leaveRoom = useCallback(() => {
    if (roomState) {
      sendMessage({
        type: 'leave_room',
        code: roomState.code,
      });
    }
    setRoomState(null);
    try {
      localStorage.removeItem('duoquiz_multi_room_code');
    } catch {}
    if (socketRef.current) {
      socketRef.current.close();
    }
  }, [roomState, sendMessage]);

  // Clean up socket on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const isHost = roomState?.player1.id === playerId;
  const isTarget =
    roomState?.currentManche && roomState.currentManche % 2 === 1
      ? isHost
      : !isHost;
  const isGuesser = !isTarget;

  const myPlayer: MultiplayerPlayer | undefined = isHost
    ? roomState?.player1
    : roomState?.player2;

  const partnerPlayer: MultiplayerPlayer | undefined = isHost
    ? roomState?.player2
    : roomState?.player1;

  return {
    roomState,
    playerId,
    isConnected,
    isConnecting,
    errorMessage,
    setErrorMessage,
    isHost,
    isTarget,
    isGuesser,
    myPlayer,
    partnerPlayer,
    createRoom,
    joinRoom,
    startGame,
    submitTargetAnswer,
    finishTargetSeries,
    submitGuesserAnswer,
    resolveMatch,
    nextRevealOrQuestion,
    startNextManche,
    goToSummary,
    leaveRoom,
  };
}
