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
  const [savedRoomCode, setSavedRoomCode] = useState<string | null>(() => {
    try {
      return localStorage.getItem('duoquiz_multi_room_code') || null;
    } catch {
      return null;
    }
  });

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isReconnecting, setIsReconnecting] = useState<boolean>(false);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<any>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const heartbeatIntervalRef = useRef<any>(null);
  const isIntentionalLeaveRef = useRef<boolean>(false);
  const roomCodeRef = useRef<string | null>(savedRoomCode);
  const playerIdRef = useRef<string | null>(playerId);

  // Keep refs synced
  useEffect(() => {
    roomCodeRef.current = roomState?.code || savedRoomCode;
  }, [roomState?.code, savedRoomCode]);

  useEffect(() => {
    playerIdRef.current = playerId;
  }, [playerId]);

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

      // If existing socket is already connecting, close it before opening fresh
      if (socketRef.current && socketRef.current.readyState === WebSocket.CONNECTING) {
        try {
          socketRef.current.close();
        } catch {}
      }

      setIsConnecting(true);
      let didSettle = false;
      const ws = new WebSocket(getWsUrl());

      const timeoutId = setTimeout(() => {
        if (!didSettle && ws.readyState !== WebSocket.OPEN) {
          didSettle = true;
          try { ws.close(); } catch {}
          setIsConnecting(false);
          setIsReconnecting(false);
          reject(new Error('Délai de connexion dépassé'));
        }
      }, 6000);

      ws.onopen = () => {
        if (didSettle) return;
        didSettle = true;
        clearTimeout(timeoutId);
        setIsConnected(true);
        setIsConnecting(false);
        setIsReconnecting(false);
        setErrorMessage(null);
        reconnectAttemptsRef.current = 0;
        socketRef.current = ws;

        // Start heartbeat to prevent proxy timeout
        if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 12000);

        resolve(ws);
      };

      ws.onmessage = (event) => {
        try {
          const msg: ServerMessage = JSON.parse(event.data);
          if (msg.type === 'pong') {
            return;
          }
          if (msg.type === 'room_created' || msg.type === 'room_joined') {
            setRoomState(msg.roomState);
            setPlayerId(msg.playerId);
            setSavedRoomCode(msg.code);
            setIsReconnecting(false);
            setErrorMessage(null);
            reconnectAttemptsRef.current = 0;
            try {
              localStorage.setItem('duoquiz_multi_player_id', msg.playerId);
              localStorage.setItem('duoquiz_multi_room_code', msg.code);
              if (msg.roomState.stage !== 'lobby') {
                sessionStorage.setItem('duoquiz_multi_in_game', 'true');
              }
            } catch {}
          } else if (msg.type === 'sync_state') {
            setRoomState(msg.roomState);
            setIsReconnecting(false);
            reconnectAttemptsRef.current = 0;
            if (msg.roomState.stage !== 'lobby') {
              try {
                sessionStorage.setItem('duoquiz_multi_in_game', 'true');
              } catch {}
            }
          } else if (msg.type === 'error') {
            setErrorMessage(msg.message);
            setIsReconnecting(false);
            if (msg.message.toLowerCase().includes('salon introuvable') || msg.message.toLowerCase().includes('expiré')) {
              try {
                localStorage.removeItem('duoquiz_multi_room_code');
                sessionStorage.removeItem('duoquiz_multi_in_game');
              } catch {}
              setSavedRoomCode(null);
            }
          }
        } catch (err) {
          console.error('Error handling WebSocket message:', err);
        }
      };

      ws.onerror = (e) => {
        if (!didSettle) {
          didSettle = true;
          clearTimeout(timeoutId);
          setIsConnecting(false);
          setIsReconnecting(false);
          setErrorMessage('Impossible de contacter le serveur multijoueur.');
          reject(e);
        }
      };

      ws.onclose = () => {
        if (!didSettle) {
          didSettle = true;
          clearTimeout(timeoutId);
          reject(new Error('WebSocket fermé avant ouverture'));
        }
        setIsConnected(false);
        setIsConnecting(false);
        socketRef.current = null;
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = null;
        }

        // Auto-reconnect loop with exponential backoff if dropped accidentally
        const activeCode = roomCodeRef.current;
        const activeId = playerIdRef.current;
        if (activeCode && !isIntentionalLeaveRef.current) {
          setIsReconnecting(true);
          const attempt = reconnectAttemptsRef.current;
          if (attempt < 15) {
            reconnectAttemptsRef.current = attempt + 1;
            const delay = Math.min(8000, 1200 + attempt * 800);
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectSavedSession(activeCode, activeId || undefined);
            }, delay);
          }
        }
      };
    });
  }, []);

  const sendMessage = useCallback((msg: ClientMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
    } else {
      const activeCode = roomCodeRef.current;
      const activeId = playerIdRef.current;
      if (activeCode && !isIntentionalLeaveRef.current) {
        reconnectSavedSession(activeCode, activeId || undefined).then((ok) => {
          if (ok && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(msg));
          }
        });
      }
    }
  }, []);

  const reconnectSavedSession = useCallback(
    async (overrideCode?: string, overridePlayerId?: string): Promise<boolean> => {
      const codeToUse = (overrideCode || savedRoomCode || '').trim().toUpperCase();
      const idToUse = overridePlayerId || playerId;
      if (!codeToUse) return false;

      isIntentionalLeaveRef.current = false;
      setIsReconnecting(true);
      setErrorMessage(null);

      try {
        const ws = await connect();
        ws.send(
          JSON.stringify({
            type: idToUse ? 'reconnect' : 'join_room',
            code: codeToUse,
            playerId: idToUse || undefined,
            playerName: 'Moi',
            playerAvatar: '🦊',
          } as ClientMessage)
        );
        return true;
      } catch (err) {
        setIsReconnecting(false);
        setErrorMessage('Erreur lors de la reconnexion au salon.');
        return false;
      }
    },
    [connect, savedRoomCode, playerId]
  );

  // Listen to visibility change (unlocking phone / returning to browser tab) and online event
  useEffect(() => {
    const handleReactivate = () => {
      const activeCode = roomCodeRef.current;
      const activeId = playerIdRef.current;
      if (!document.hidden && activeCode && !isIntentionalLeaveRef.current) {
        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
          reconnectSavedSession(activeCode, activeId || undefined);
        }
      }
    };

    document.addEventListener('visibilitychange', handleReactivate);
    window.addEventListener('online', handleReactivate);

    return () => {
      document.removeEventListener('visibilitychange', handleReactivate);
      window.removeEventListener('online', handleReactivate);
    };
  }, [reconnectSavedSession]);

  const clearSavedSession = useCallback(() => {
    isIntentionalLeaveRef.current = true;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    try {
      localStorage.removeItem('duoquiz_multi_room_code');
      sessionStorage.removeItem('duoquiz_multi_in_game');
    } catch {}
    setSavedRoomCode(null);
    setRoomState(null);
    setErrorMessage(null);
    if (socketRef.current) {
      socketRef.current.close();
    }
  }, []);

  const createRoom = useCallback(
    async (hostName: string, hostAvatar: string, config: RoomConfig) => {
      isIntentionalLeaveRef.current = false;
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
      isIntentionalLeaveRef.current = false;
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
    (questionIndex: number, answer: string, updatedOptions?: string[]) => {
      if (!roomState) return;
      sendMessage({
        type: 'submit_target_answer',
        code: roomState.code,
        questionIndex,
        answer,
        updatedOptions,
      });
    },
    [roomState, sendMessage]
  );

  const updateQuestionOptions = useCallback(
    (questionIndex: number, options: string[]) => {
      if (!roomState) return;
      sendMessage({
        type: 'update_question_options',
        code: roomState.code,
        questionIndex,
        options,
      });
    },
    [roomState, sendMessage]
  );

  const replaceQuestion = useCallback(
    (questionIndex: number, question: Question) => {
      if (!roomState) return;
      sendMessage({
        type: 'replace_question',
        code: roomState.code,
        questionIndex,
        question,
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
    isIntentionalLeaveRef.current = true;
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (roomState) {
      sendMessage({
        type: 'leave_room',
        code: roomState.code,
      });
    }
    setRoomState(null);
    try {
      localStorage.removeItem('duoquiz_multi_room_code');
      sessionStorage.removeItem('duoquiz_multi_in_game');
    } catch {}
    setSavedRoomCode(null);
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
    savedRoomCode,
    isConnected,
    isConnecting,
    isReconnecting,
    errorMessage,
    setErrorMessage,
    isHost,
    isTarget,
    isGuesser,
    myPlayer,
    partnerPlayer,
    createRoom,
    joinRoom,
    reconnectSavedSession,
    clearSavedSession,
    startGame,
    submitTargetAnswer,
    updateQuestionOptions,
    replaceQuestion,
    finishTargetSeries,
    submitGuesserAnswer,
    resolveMatch,
    nextRevealOrQuestion,
    startNextManche,
    goToSummary,
    leaveRoom,
  };
}
