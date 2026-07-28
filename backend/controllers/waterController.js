import { WaterLog } from '../models/WaterLog.js';

export async function getWater(req, res) {
  const items = await WaterLog.find({ user: req.user._id }).sort({ date: -1 });
  res.json({ water: items });
}

export async function setWater(req, res) {
  const { date, glasses } = req.body;
  const item = await WaterLog.findOneAndUpdate(
    { user: req.user._id, date },
    { glasses, user: req.user._id, date },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  res.json({ water: item });
}
