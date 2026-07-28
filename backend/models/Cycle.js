import mongoose from 'mongoose';

const cycleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    startDate: { type: String, required: true },
    endDate: { type: String, default: null },
    flow: { type: String, enum: ['none', 'light', 'medium', 'heavy', 'very_heavy'], default: 'medium' },
    painLevel: { type: Number, default: 0, min: 0, max: 10 },
    energyLevel: { type: Number, default: 5, min: 0, max: 10 },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

export const Cycle = mongoose.model('Cycle', cycleSchema);
