import { Symptom } from '../models/Symptom.js';

export async function getSymptoms(req, res) {
  const items = await Symptom.find({ user: req.user._id }).sort({ date: -1 });
  res.json({ symptoms: items });
}

export async function setSymptoms(req, res) {
  const { date, symptoms } = req.body;
  const item = await Symptom.findOneAndUpdate(
    { user: req.user._id, date },
    { symptoms, user: req.user._id, date },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  res.json({ symptom: item });
}
