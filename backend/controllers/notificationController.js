import { Notification } from '../models/Notification.js';

export async function getNotifications(req, res) {
  const items = await Notification.find({ user: req.user._id }).sort({ date: -1, createdAt: -1 }).limit(50);
  res.json({ notifications: items });
}

export async function markRead(req, res) {
  const item = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true },
  );
  if (!item) return res.status(404).json({ message: 'Notification not found.' });
  res.json({ notification: item });
}
