import { Profile } from '../models/Profile.js';

export async function createProfile(req, res) {
  const existing = await Profile.findOne({ user: req.user._id, 'fullName': req.body.fullName });
  if (existing) {
    return res.status(409).json({ message: 'A profile with that name already exists.' });
  }
  const profile = await Profile.create({ ...req.body, user: req.user._id });
  res.status(201).json({ profile });
}

export async function updateProfile(req, res) {
  const profile = await Profile.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true },
  );
  if (!profile) return res.status(404).json({ message: 'Profile not found.' });
  res.json({ profile });
}

export async function getProfile(req, res) {
  const profile = await Profile.findOne({ _id: req.params.id, user: req.user._id });
  if (!profile) return res.status(404).json({ message: 'Profile not found.' });
  res.json({ profile });
}

export async function getProfiles(req, res) {
  const profiles = await Profile.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ profiles });
}
