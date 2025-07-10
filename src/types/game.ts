export interface GameState {
  currentBeat: number;
  currentCycle: number;
  score: number;
  combo: number;
  isPlaying: boolean;
  character: CharacterState;
  currentQuestion: Question | null;
  selectedAnswer: number | null;
  lastActionTime: number;
  gameGrid: GridCell[][];
  actionSuccess?: boolean;
}

export interface CharacterState {
  x: number;
  y: number;
  action: 'idle' | 'jump' | 'forward' | 'crouch';
  isMoving: boolean;
}

export interface Question {
  question: string;
  options: number[];
  correctAnswer: number;
  timestamp: number;
}

export interface GridCell {
  x: number;
  y: number;
  occupied: boolean;
  type: 'normal' | 'obstacle' | 'target';
}

export interface GameConfig {
  beatsPerCycle: number;
  bpm: number;
  gridWidth: number;
  gridHeight: number;
  timingTolerance: number;
}

export interface ToastMessage {
  message: string;
  type: 'miss' | 'celebration';
  timestamp: number;
}