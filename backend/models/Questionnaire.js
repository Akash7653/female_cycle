import mongoose from 'mongoose';

const questionnaireSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    answers: { type: Object, default: {} },
  },
  { timestamps: true },
);

export const Questionnaire = mongoose.model('Questionnaire', questionnaireSchema);
