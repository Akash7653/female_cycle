import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    time: { type: String, required: true },
    repeat: { type: String, enum: ['daily', 'weekdays', 'custom'], default: 'daily' },
    completed: { type: Boolean, default: false },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

export const Medicine = mongoose.model('Medicine', medicineSchema);
