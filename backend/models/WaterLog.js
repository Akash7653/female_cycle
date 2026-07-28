import mongoose from 'mongoose';

const waterSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true },
    glasses: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

waterSchema.index({ user: 1, date: 1 }, { unique: true });

export const WaterLog = mongoose.model('WaterLog', waterSchema);
