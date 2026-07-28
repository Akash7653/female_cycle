import { Questionnaire } from '../models/Questionnaire.js';

export async function saveQuestionnaire(req, res) {
  const answers = { ...req.body.answers, submittedAt: new Date().toISOString() };
  const questionnaire = await Questionnaire.findOneAndUpdate(
    { user: req.user._id },
    { user: req.user._id, answers },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  res.status(201).json({ questionnaire });
}

export async function getQuestionnaire(req, res) {
  const questionnaire = await Questionnaire.findOne({ user: req.user._id });
  res.json({ questionnaire });
}
