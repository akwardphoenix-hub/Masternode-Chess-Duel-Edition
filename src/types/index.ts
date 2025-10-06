export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
export type DuelType = 'swipe' | 'rhythm' | 'mirror';
export type ThemeType = 'roman' | 'french' | 'middleEastern' | 'pirate' | 'oldEnglish' | 'cyberpunk';
export type EquipmentSlot = 'weapon' | 'armor' | 'accessory';

export interface Position {
  row: number;
  col: number;
}

export interface Equipment {
  id: string;
  name: string;
  attack?: number;
  defense?: number;
  bonus?: string;
  value?: number;
}

export interface PieceEquipment {
  weapon: Equipment | null;
  armor: Equipment | null;
  accessory: Equipment | null;
}

export interface Piece {
  id: string;
  type: PieceType;
  position: Position;
  hp: number;
  maxHP: number;
  xp: number;
  level: number;
  bounty: number;
  equipment: PieceEquipment;
}

export interface PieceStats {
  baseHP: number;
  baseAttack: number;
  baseBounty: number;
}

export interface ThemeBuff {
  type: string;
  value: number;
}

export interface Theme {
  name: string;
  buff: ThemeBuff;
  description: string;
}

export interface DuelResult {
  attacker: string;
  defender: string;
  duelType: DuelType;
  attackerScore: number;
  defenderScore: number;
  damageDealt: number;
  result: 'attacker_wins' | 'defender_wins' | 'draw';
  xpGained: {
    attacker: number;
    defender: number;
  };
}

export interface Player {
  pieces: Piece[];
}

export interface GameState {
  matchId: string;
  theme: ThemeType;
  turn: number;
  whitePlayer: Player;
  blackPlayer: Player;
  lastDuel?: DuelResult;
}

export interface DuelInput {
  type: DuelType;
  timestamp: number;
  value?: string | number;
}

export interface SwipeDirection {
  direction: 'up' | 'down' | 'left' | 'right';
  expected: 'up' | 'down' | 'left' | 'right';
}

export interface RhythmNote {
  timestamp: number;
  hit: boolean;
  accuracy: 'perfect' | 'good' | 'miss';
}

export interface MirrorPattern {
  pattern: number[];
  playerInput: number[];
}

export interface DuelConfig {
  type: DuelType;
  maxScore: number;
  description: string;
  scoringMethod: string;
}
