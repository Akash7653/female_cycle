import { PartnerPermission } from '../models/PartnerPermission.js';

export async function getPartner(req, res) {
  let item = await PartnerPermission.findOne({ user: req.user._id });
  if (!item) {
    item = await PartnerPermission.create({ user: req.user._id });
  }
  res.json({ partner: item });
}

export async function updatePartner(req, res) {
  const allowed = ['enabled', 'partnerName', 'shareDaysUntil', 'shareReminders', 'shareSupport', 'shareJournal', 'shareSymptoms', 'shareMedical'];
  const update = {};
  allowed.forEach((k) => { if (req.body[k] !== undefined) update[k] = req.body[k]; });

  const item = await PartnerPermission.findOneAndUpdate(
    { user: req.user._id },
    { $set: update },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  res.json({ partner: item });
}
