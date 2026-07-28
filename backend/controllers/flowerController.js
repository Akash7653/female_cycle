import { Flower } from '../models/Flower.js';
import { Cycle } from '../models/Cycle.js';
import { SEASONAL_FLOWERS } from '../utils/flowers.js';

export async function getFlowers(req, res) {
  const flowers = await Flower.find({ user: req.user._id }).sort({ createdAt: 1 });
  res.json({ flowers });
}

// Called internally when a cycle is completed (has endDate). Idempotent.
export async function bloomFlowerForCycle(userId, cycle) {
  if (!cycle.endDate) return null;
  const existing = await Flower.findOne({ user: userId, cycleId: cycle._id });
  if (existing) return existing;

  const month = new Date(cycle.startDate).getMonth();
  const season = seasonForMonth(month);
  const pool = SEASONAL_FLOWERS.filter((f) => f.season === season);
  const pick = pool[Math.floor(Math.random() * pool.length)] ?? SEASONAL_FLOWERS[0];

  return Flower.create({
    user: userId,
    cycleId: cycle._id,
    name: pick.name,
    emoji: pick.emoji,
    season,
  });
}

function seasonForMonth(month) {
  if (month >= 2 && month <= 4) return 'Spring';
  if (month >= 5 && month <= 7) return 'Summer';
  if (month >= 8 && month <= 10) return 'Autumn';
  return 'Winter';
}
