import { Cycle } from '../models/Cycle.js';

export async function getCycles(req, res) {
  const cycles = await Cycle.find({ user: req.user._id }).sort({ startDate: 1 });
  res.json({ cycles });
}

export async function addCycle(req, res) {
  const cycle = await Cycle.create({ ...req.body, user: req.user._id });
  res.status(201).json({ cycle });
}

export async function updateCycle(req, res) {
  const cycle = await Cycle.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true },
  );
  if (!cycle) return res.status(404).json({ message: 'Cycle not found.' });
  res.json({ cycle });
}

export async function deleteCycle(req, res) {
  await Cycle.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: 'Cycle deleted.' });
}
