export type PieceType = 'pawn' | 'knight' | 'bishop' | 'rook' | 'queen' | 'king';
export type Color = 'white' | 'black';
export type Position = [number, number];

export interface Piece {
  type: PieceType;
  position: Position;
  hp: number;
  maxHp: number;
  xp: number;
  level: number;
  equipment: Equipment[];
}

export interface Equipment {
  id: string;
  name: string;
  cost: number;
  effects: {
    damage?: number;
    hp?: number;
    initiative?: number;
    xpMultiplier?: number;
  };
  description: string;
}

export interface Theme {
  id: string;
  name: string;
  unitNames: {
    pawn: string;
    knight: string;
    bishop: string;
    rook: string;
    queen: string;
    king: string;
  };
  palette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  buffs: {
    [key: string]: number | string;
  };
}

export interface DuelMode {
  id: string;
  name: string;
  description: string;
  difficulty: {
    easy: any;
    medium: any;
    hard: any;
  };
  scoring: {
    perfect: any;
    good: any;
    hit: any;
  };
}

export interface GameRules {
  damageModel: {
    baseDamage: Record<PieceType, number>;
    multipliers: {
      perfect: number;
      good: number;
      hit: number;
      miss: number;
    };
  };
  hp: Record<PieceType, number>;
  initiative: Record<PieceType, number>;
  progression: {
    xpPerHit: number;
    xpPerPerfect: number;
    xpPerKill: number;
    levelThresholds: number[];
    kingTricklePercent: number;
  };
  bounty: Record<PieceType, number>;
  winConditions: {
    checkmate: boolean;
    councilVariant: {
      enabled: boolean;
      protectionThreshold: number;
    };
  };
}

export interface GovernanceModifier {
  id: string;
  name: string;
  description: string;
  effect: any;
  enabled: boolean;
}

export interface GameState {
  matchId: string;
  themeWhite: string;
  themeBlack: string;
  currentTurn: Color;
  turnNumber: number;
  board: (string | null)[][];
  pieces: {
    white: Piece[];
    black: Piece[];
  };
  gold: {
    white: number;
    black: number;
  };
  log: LogEntry[];
}

export interface LogEntry {
  turn: number;
  action: string;
  player: Color;
  details: any;
  timestamp: number;
}

export type DuelResult = 'perfect' | 'good' | 'hit' | 'miss';

export interface DuelOutcome {
  attacker: {
    damage: number;
    xp: number;
    result: DuelResult;
  };
  defender: {
    damage: number;
    xp: number;
    result: DuelResult;
  };
}
