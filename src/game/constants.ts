import { EggColor, Stage } from './types';

export const EGG_COLORS: EggColor[] = ['red', 'blue', 'green', 'yellow', 'purple'];

export const STAGES: Stage[] = [
  { level: 1, targetScore: 5000, timeLimitSec: 150 },
  { level: 2, targetScore: 10000, timeLimitSec: 140 },
  { level: 3, targetScore: 18000, timeLimitSec: 130 },
  { level: 4, targetScore: 27000, timeLimitSec: 120 },
];

export const SCORE = {
  eggToChick: 100,
  chickToAdult: 300,
  friedChicken: 1000,
};
