import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true },
    title: { type: String, default: '' },
    content: { type: String, required: true },
    image: { type: String, default: '' },
  },
  { timestamps: true },
);

export const Journal = mongoose.model('Journal', journalSchema);
