import { CategoryId, DifficultyLevel, Player, Question, RoundResult, CoupleVerdict } from './quiz';

export type MultiplayerRole = 'target' | 'guesser' | 'spectator';

export interface RoomConfig {
  selectedCategories: CategoryId[];
  globalDifficulty: DifficultyLevel;
  questionCount: number;
}

export interface MultiplayerPlayer extends Player {
  connected: boolean;
  isHost: boolean;
  lastActive: number;
}

export type MultiplayerStage = 
  | 'lobby'
  | 'p1_series'
  | 'handover'
  | 'p2_turn'
  | 'reveal_turn'
  | 'round_switch'
  | 'summary';

export interface RoomState {
  code: string;
  stage: MultiplayerStage;
  config: RoomConfig;
  player1: MultiplayerPlayer;
  player2?: MultiplayerPlayer;
  currentManche: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  activeQuestion?: Question;
  questions: Question[];
  // Secret answers are only sent when revealed or to the answering player
  p1AnsweredCount: number;
  p2AnsweredCount: number;
  currentTargetAnswer?: string;
  currentGuesserAnswer?: string;
  targetAnswers?: string[]; // Sent only to target player for reconnection/answer restoration
  isCurrentAutoMatch?: boolean;
  matchDecisions: Record<number, boolean>;
  lastMancheScore: number;
  cumulativeHistory: RoundResult[];
  verdict?: CoupleVerdict;
}

// Client to Server WebSocket Messages
export type ClientMessage =
  | { type: 'create_room'; hostName: string; hostAvatar: string; config: RoomConfig }
  | { type: 'join_room'; code: string; playerName: string; playerAvatar: string; playerId?: string }
  | { type: 'reconnect'; code: string; playerId: string }
  | { type: 'update_config'; code: string; config: Partial<RoomConfig> }
  | { type: 'start_game'; code: string; questions: Question[] }
  | { type: 'submit_target_answer'; code: string; questionIndex: number; answer: string }
  | { type: 'finish_target_series'; code: string }
  | { type: 'submit_guesser_answer'; code: string; questionIndex: number; answer: string }
  | { type: 'resolve_match'; code: string; questionIndex: number; isMatch: boolean }
  | { type: 'next_reveal_or_question'; code: string }
  | { type: 'start_next_manche'; code: string; questions: Question[] }
  | { type: 'go_to_summary'; code: string; verdict?: CoupleVerdict }
  | { type: 'leave_room'; code: string };

// Server to Client WebSocket Messages
export type ServerMessage =
  | { type: 'room_created'; code: string; playerId: string; roomState: RoomState }
  | { type: 'room_joined'; code: string; playerId: string; roomState: RoomState }
  | { type: 'sync_state'; roomState: RoomState }
  | { type: 'player_status'; player1Connected: boolean; player2Connected: boolean; message?: string }
  | { type: 'error'; message: string };
