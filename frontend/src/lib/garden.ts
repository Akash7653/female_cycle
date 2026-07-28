import { SEASONAL_FLOWERS } from './constants';
import type { Cycle, Flower } from './types';
import { storage } from './storage';
import { uid } from './utils';

function seasonForMonth(month: number): string {
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 10) return 'Autumn';
  return 'Winter';
}

export function bloomFlowerForCycle(cycle: Cycle): Flower {
  const month = new Date(cycle.startDate).getMonth();
  const season = seasonForMonth(month);
  const pool = SEASONAL_FLOWERS.filter((f) => f.season === season);
  const pick = pool[Math.floor(Math.random() * pool.length)] ?? SEASONAL_FLOWERS[0];
  return {
    id: uid('flower'),
    cycleId: cycle.id,
    name: pick.name,
    emoji: pick.emoji,
    season,
    unlockedAt: new Date().toISOString(),
  };
}

export function ensureFlowerForCompletedCycle(cycle: Cycle): Flower[] {
  const flowers = storage.getFlowers();
  if (flowers.some((f) => f.cycleId === cycle.id)) return flowers;
  const flower = bloomFlowerForCycle(cycle);
  const next = [...flowers, flower];
  storage.setFlowers(next);
  return next;
}
