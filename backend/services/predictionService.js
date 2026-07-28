import { Cycle } from '../models/Cycle.js';
import { Notification } from '../models/Notification.js';

/**
 * Compute average cycle length from history.
 */
export function averageCycleLength(cycles, fallback = 28) {
  const sorted = [...cycles].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  if (sorted.length < 2) return fallback;
  const gaps = [];
  for (let i = 1; i < sorted.length; i++) {
    const gap = Math.round((new Date(sorted[i].startDate) - new Date(sorted[i - 1].startDate)) / 86_400_000);
    if (gap > 14 && gap < 60) gaps.push(gap);
  }
  if (!gaps.length) return fallback;
  return Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
}

export function averagePeriodLength(cycles, fallback = 5) {
  const withEnd = cycles.filter((c) => c.endDate);
  if (!withEnd.length) return fallback;
  const lengths = withEnd.map((c) =>
    Math.round((new Date(c.endDate) - new Date(c.startDate)) / 86_400_000) + 1,
  );
  return Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length);
}

const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };
const todayISO = () => new Date().toISOString().slice(0, 10);
const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86_400_000);

export function predict(cycles, profileCycle = 28, profilePeriod = 5) {
  const sorted = [...cycles].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  const cycleLen = averageCycleLength(cycles, profileCycle);
  const periodLen = averagePeriodLength(cycles, profilePeriod);

  const today = todayISO();
  const lastStart = sorted.length ? sorted[sorted.length - 1].startDate : addDays(today, -cycleLen + 3);
  let nextPeriod = addDays(lastStart, cycleLen);

  if (today >= lastStart && today <= addDays(lastStart, periodLen - 1)) {
    nextPeriod = addDays(lastStart, cycleLen);
  }

  const daysUntil = daysBetween(today, nextPeriod);
  const isLate = daysUntil < 0;
  const ovulation = addDays(nextPeriod, -14);
  const fertileStart = addDays(ovulation, -5);
  const fertileEnd = addDays(ovulation, 1);

  let phase = 'follicular';
  if (today >= lastStart && today <= addDays(lastStart, periodLen - 1)) phase = 'menstrual';
  else if (today >= addDays(ovulation, -5) && today <= addDays(ovulation, 1)) phase = 'ovulation';
  else if (today > addDays(ovulation, 1)) phase = 'luteal';

  return {
    nextPeriod,
    ovulation,
    fertileStart,
    fertileEnd,
    cycleLength: cycleLen,
    daysUntil: Math.max(0, daysUntil),
    isLate,
    phase,
  };
}

/**
 * Scheduled job: create gentle notifications for users whose period is near.
 */
export async function generatePeriodNotifications() {
  try {
    const cycles = await Cycle.find().sort({ startDate: 1 });
    const byUser = new Map();
    cycles.forEach((c) => {
      if (!byUser.has(c.user.toString())) byUser.set(c.user.toString(), []);
      byUser.get(c.user.toString()).push(c);
    });

    const today = todayISO();
    for (const [userId, userCycles] of byUser) {
      const p = predict(userCycles);
      if (p.daysUntil <= 2 && p.daysUntil >= 0) {
        const msg = `Your period may begin in ${p.daysUntil} day${p.daysUntil === 1 ? '' : 's'}.`;
        const exists = await Notification.findOne({ user: userId, date: today, message: msg });
        if (!exists) await Notification.create({ user: userId, type: 'period', message: msg, date: today });
      }
    }
    console.log('🌸 Period notifications checked.');
  } catch (err) {
    console.error('Notification job error:', err.message);
  }
}
