export const BOARD_SIZE = 16;

export type EggColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple';

export type Block =
  | { type: 'egg'; color: EggColor }
  | { type: 'chick' }
  | { type: 'rooster' }
  | { type: 'hen' }
  | { type: 'empty' };

export type Position = { row: number; col: number };

export type Stage = {
  level: number;
  targetScore: number;
  timeLimitSec: number;
};
