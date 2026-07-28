import mongoose from 'mongoose';

const flowerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    cycleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cycle', required: true },
    name: { type: String, required: true },
    emoji: { type: String, required: true },
    season: { type: String, required: true },
  },
  { timestamps: true },
);

flowerSchema.index({ user: 1, cycleId: 1 }, { unique: true });

export const Flower = mongoose.model('Flower', flowerSchema);
