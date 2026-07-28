import mongoose from 'mongoose';

const symptomSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: String, required: true },
    symptoms: [{ type: String }],
  },
  { timestamps: true },
);

symptomSchema.index({ user: 1, date: 1 }, { unique: true });

export const Symptom = mongoose.model('Symptom', symptomSchema);
