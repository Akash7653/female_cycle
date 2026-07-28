import type { Cycle, Phase, Prediction } from './types';
import { addDays, daysBetween, isoDate, todayISO } from './utils';

/**
 * Compute the average cycle length from the last N cycles.
 * Falls back to the user's profile cycle length when not enough history.
 */
export function averageCycleLength(cycles: Cycle[], fallback = 28): number {
  const sorted = [...cycles].sort((a, b) => a.startDate.localeCompare(b.startDate));
  if (sorted.length < 2) return fallback;
  const gaps: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const gap = daysBetween(sorted[i - 1].startDate, sorted[i].startDate);
    if (gap > 14 && gap < 60) gaps.push(gap);
  }
  if (gaps.length === 0) return fallback;
  return Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
}

export function averagePeriodLength(cycles: Cycle[], fallback = 5): number {
  const withEnd = cycles.filter((c) => c.endDate);
  if (withEnd.length === 0) return fallback;
  const lengths = withEnd.map((c) => daysBetween(c.startDate, c.endDate!) + 1);
  return Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
}

export function predict(cycles: Cycle[], profileCycle = 28, profilePeriod = 5): Prediction {
  const sorted = [...cycles].sort((a, b) => a.startDate.localeCompare(b.startDate));
  const cycleLen = averageCycleLength(cycles, profileCycle);
  const periodLen = averagePeriodLength(cycles, profilePeriod);

  const today = todayISO();
  let lastStart = sorted.length ? sorted[sorted.length - 1].startDate : addDays(today, -cycleLen + 3);
  let nextPeriod = addDays(lastStart, cycleLen);

  // If we are currently inside a period, next is a cycle ahead
  if (today >= lastStart && today <= addDays(lastStart, periodLen - 1)) {
    nextPeriod = addDays(lastStart, cycleLen);
  } else if (today > addDays(lastStart, periodLen - 1) && today < nextPeriod) {
    // between periods, next is still ahead
    nextPeriod = nextPeriod;
  }

  const daysUntil = daysBetween(today, nextPeriod);
  const isLate = daysUntil < 0;
  const ovulation = addDays(nextPeriod, -14);
  const fertileStart = addDays(ovulation, -5);
  const fertileEnd = addDays(ovulation, 1);

  // Detect irregularity: high variance in cycle gaps
  const gaps: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const g = daysBetween(sorted[i - 1].startDate, sorted[i].startDate);
    if (g > 14 && g < 60) gaps.push(g);
  }
  let irregular = false;
  if (gaps.length >= 2) {
    const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const variance = gaps.reduce((a, b) => a + (b - mean) ** 2, 0) / gaps.length;
    irregular = Math.sqrt(variance) > 7;
  }

  const phase = currentPhase(today, lastStart, nextPeriod, cycleLen, periodLen);

  return {
    nextPeriod,
    ovulation,
    fertileStart,
    fertileEnd,
    cycleLength: cycleLen,
    daysUntil: Math.max(0, daysUntil),
    isLate,
    irregular,
    phase,
  };
}

export function currentPhase(
  today: string,
  lastStart: string,
  nextPeriod: string,
  _cycleLen: number,
  periodLen: number,
): Phase {
  if (today >= lastStart && today <= addDays(lastStart, periodLen - 1)) return 'menstrual';
  const ovulation = addDays(nextPeriod, -14);
  if (today >= addDays(ovulation, -5) && today <= addDays(ovulation, 1)) return 'ovulation';
  if (today > addDays(ovulation, 1)) return 'luteal';
  return 'follicular';
}

export function phaseForDate(
  date: string,
  cycles: Cycle[],
  profileCycle = 28,
  profilePeriod = 5,
): { phase: Phase; isPeriod: boolean; isFertile: boolean; isOvulation: boolean } {
  const sorted = [...cycles].sort((a, b) => a.startDate.localeCompare(b.startDate));
  // Is this date within a logged period?
  for (const c of sorted) {
    const end = c.endDate ?? addDays(c.startDate, profilePeriod - 1);
    if (date >= c.startDate && date <= end) {
      return { phase: 'menstrual', isPeriod: true, isFertile: false, isOvulation: false };
    }
  }
  // Predicted period / ovulation / fertile for current cycle window
  if (sorted.length) {
    const last = sorted[sorted.length - 1].startDate;
    const cycleLen = averageCycleLength(cycles, profileCycle);
    const next = addDays(last, cycleLen);
    const ovulation = addDays(next, -14);
    const fertileStart = addDays(ovulation, -5);
    const fertileEnd = addDays(ovulation, 1);
    if (date >= next && date <= addDays(next, profilePeriod - 1))
      return { phase: 'menstrual', isPeriod: true, isFertile: false, isOvulation: false };
    if (date === ovulation)
      return { phase: 'ovulation', isPeriod: false, isFertile: true, isOvulation: true };
    if (date >= fertileStart && date <= fertileEnd)
      return { phase: 'ovulation', isPeriod: false, isFertile: true, isOvulation: false };
  }
  return { phase: 'follicular', isPeriod: false, isFertile: false, isOvulation: false };
}
