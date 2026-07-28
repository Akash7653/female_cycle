import { Mood } from '../models/Mood.js';

export async function getMoods(req, res) {
  const items = await Mood.find({ user: req.user._id }).sort({ date: -1 });
  res.json({ moods: items });
}

export async function setMood(req, res) {
  const { date, mood, note } = req.body;
  const item = await Mood.findOneAndUpdate(
    { user: req.user._id, date },
    { mood, note, user: req.user._id, date },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  res.json({ mood: item });
}
