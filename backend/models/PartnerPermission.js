import mongoose from 'mongoose';

const partnerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    enabled: { type: Boolean, default: false },
    partnerName: { type: String, default: '' },
    shareDaysUntil: { type: Boolean, default: true },
    shareReminders: { type: Boolean, default: true },
    shareSupport: { type: Boolean, default: true },
    shareJournal: { type: Boolean, default: false },
    shareSymptoms: { type: Boolean, default: false },
    shareMedical: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const PartnerPermission = mongoose.model('PartnerPermission', partnerSchema);
