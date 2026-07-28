import { Medicine } from '../models/Medicine.js';

export async function getMedicines(req, res) {
  const items = await Medicine.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ medicines: items });
}

export async function addMedicine(req, res) {
  const item = await Medicine.create({ ...req.body, user: req.user._id });
  res.status(201).json({ medicine: item });
}

export async function toggleMedicine(req, res) {
  const item = await Medicine.findOne({ _id: req.params.id, user: req.user._id });
  if (!item) return res.status(404).json({ message: 'Medicine not found.' });
  item.completed = !item.completed;
  await item.save();
  res.json({ medicine: item });
}

export async function deleteMedicine(req, res) {
  await Medicine.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.json({ message: 'Medicine deleted.' });
}
