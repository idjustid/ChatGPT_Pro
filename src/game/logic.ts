import { EGG_COLORS, SCORE } from './constants';
import { BOARD_SIZE, Block, EggColor, Position } from './types';

export type ResolveResult = {
  board: Block[][];
  gainedScore: number;
  combo: number;
};

const randEggColor = (): EggColor => EGG_COLORS[Math.floor(Math.random() * EGG_COLORS.length)];

const randomEgg = (): Block => ({ type: 'egg', color: randEggColor() });

export const createInitialBoard = (): Block[][] =>
  Array.from({ length: BOARD_SIZE }, () => Array.from({ length: BOARD_SIZE }, () => randomEgg()));

const cloneBoard = (board: Block[][]): Block[][] => board.map((row) => row.map((cell) => ({ ...cell })));

const isAdjacent = (a: Position, b: Position): boolean => Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;

const lines3 = (board: Block[][]): Position[][] => {
  const matches: Position[][] = [];

  for (let r = 0; r < BOARD_SIZE; r += 1) {
    for (let c = 0; c <= BOARD_SIZE - 3; c += 1) {
      matches.push([
        { row: r, col: c },
        { row: r, col: c + 1 },
        { row: r, col: c + 2 },
      ]);
    }
  }

  for (let c = 0; c < BOARD_SIZE; c += 1) {
    for (let r = 0; r <= BOARD_SIZE - 3; r += 1) {
      matches.push([
        { row: r, col: c },
        { row: r + 1, col: c },
        { row: r + 2, col: c },
      ]);
    }
  }

  return matches;
};

const comboMultiplier = (combo: number): number => 1 + combo * 0.2;

const resolveOnce = (board: Block[][]): { board: Block[][]; score: number; didMatch: boolean } => {
  const next = cloneBoard(board);
  let gained = 0;
  let matched = false;

  for (const line of lines3(next)) {
    const [a, b, c] = line;
    const blocks = [next[a.row][a.col], next[b.row][b.col], next[c.row][c.col]];

    // Egg 3-match (same color) -> Chick
    if (blocks.every((blk) => blk.type === 'egg')) {
      const [e1, e2, e3] = blocks as Array<{ type: 'egg'; color: EggColor }>;
      if (e1.color === e2.color && e2.color === e3.color) {
        matched = true;
        gained += SCORE.eggToChick;
        next[a.row][a.col] = { type: 'empty' };
        next[c.row][c.col] = { type: 'empty' };
        next[b.row][b.col] = { type: 'chick' };
      }
      continue;
    }

    // Chick 3-match -> adult
    if (blocks.every((blk) => blk.type === 'chick')) {
      matched = true;
      gained += SCORE.chickToAdult;
      next[a.row][a.col] = { type: 'empty' };
      next[c.row][c.col] = { type: 'empty' };
      next[b.row][b.col] = Math.random() > 0.5 ? { type: 'rooster' } : { type: 'hen' };
      continue;
    }

    // Adult + 2 Chick -> fried chicken removal (interpretation A)
    const adultCount = blocks.filter((blk) => blk.type === 'rooster' || blk.type === 'hen').length;
    const chickCount = blocks.filter((blk) => blk.type === 'chick').length;
    if (adultCount === 1 && chickCount === 2) {
      matched = true;
      gained += SCORE.friedChicken;
      for (const p of line) {
        next[p.row][p.col] = { type: 'empty' };
      }
    }
  }

  if (matched) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const stack: Block[] = [];
      for (let row = BOARD_SIZE - 1; row >= 0; row -= 1) {
        const cell = next[row][col];
        if (cell.type !== 'empty') stack.push(cell);
      }
      for (let row = BOARD_SIZE - 1; row >= 0; row -= 1) {
        next[row][col] = stack[BOARD_SIZE - 1 - row] ?? randomEgg();
      }
    }
  }

  return { board: next, score: gained, didMatch: matched };
};

export const moveAndResolve = (board: Block[][], from: Position, to: Position): ResolveResult => {
  if (!isAdjacent(from, to)) {
    return { board, gainedScore: 0, combo: 0 };
  }

  const next = cloneBoard(board);
  const temp = next[from.row][from.col];
  next[from.row][from.col] = next[to.row][to.col];
  next[to.row][to.col] = temp;

  let gainedScore = 0;
  let combo = 0;
  let working = next;

  while (true) {
    const result = resolveOnce(working);
    if (!result.didMatch) break;
    gainedScore += Math.round(result.score * comboMultiplier(combo));
    combo += 1;
    working = result.board;
  }

  return { board: working, gainedScore, combo };
};
