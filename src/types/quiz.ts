export type CategoryId = 'souvenirs' | 'quotidien' | 'personnalite' | 'projets' | 'coquin' | 'custom_ai';

export type DifficultyLevel = 'easy' | 'medium' | 'spicy';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  tagline: string;
  icon: string;
  color: string;
  isNsfw?: boolean;
}

export interface Question {
  id: string;
  category: CategoryId;
  difficulty: DifficultyLevel;
  question: string;
  targetQuestion?: string;
  guesserQuestion?: string;
  options: string[];
  hint?: string;
  isAiGenerated?: boolean;
}

export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
}

export interface RoundResult {
  roundNumber: number;
  question: Question;
  targetPlayer: Player;
  guesserPlayer: Player;
  targetAnswer: string;
  guesserAnswer: string;
  isMatch: boolean;
  agreedAnyway?: boolean;
}

export type GameStage = 
  | 'menu'
  | 'multiplayer_setup'
  | 'p1_series'
  | 'handover'
  | 'p2_turn'
  | 'reveal_turn'
  | 'round_switch'
  | 'summary';

export interface CoupleVerdict {
  coupleTitle: string;
  verdict: string;
  loveChallenge: string;
}
