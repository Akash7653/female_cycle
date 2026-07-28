import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true },
    mood: {
      type: String,
      enum: ['happy', 'loved', 'neutral', 'sad', 'emotional', 'angry', 'tired', 'sick'],
      required: true,
    },
    note: { type: String, default: '' },
  },
  { timestamps: true },
);

moodSchema.index({ user: 1, date: 1 }, { unique: true });

export const Mood = mongoose.model('Mood', moodSchema);
