import { Journal } from '../models/Journal.js';

export async function getJournals(req, res) {
  const items = await Journal.find({ user: req.user._id }).sort({ date: -1 });
  res.json({ journals: items });
}

export async function addJournal(req, res) {
  const item = await Journal.create({ ...req.body, user: req.user._id });
  res.status(201).json({ journal: item });
}

export async function deleteJournal(req, res) {
  await Journal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: 'Journal deleted.' });
}
