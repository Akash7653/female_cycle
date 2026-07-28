import { z } from 'zod';

const toNumber = (value) => {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const number = Number(trimmed);
    return Number.isNaN(number) ? value : number;
  }
  return value;
};

export const schemas = {
  register: z.object({
    accountType: z.enum(['myself', 'loved-one']).default('myself'),
    name: z.string().min(2),
    relationship: z.string().optional(),
    lovedOneName: z.string().optional(),
    lovedOneAge: z.preprocess(toNumber, z.number().min(1).optional()),
    dateOfBirth: z.string().optional(),
    height: z.preprocess(toNumber, z.number().positive().optional()),
    weight: z.preprocess(toNumber, z.number().positive().optional()),
    cycleLength: z.preprocess(toNumber, z.number().positive().optional()),
    periodLength: z.preprocess(toNumber, z.number().positive().optional()),
    email: z.string().email(),
    password: z.string().min(6),
  }),
  login: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
  cycle: z.object({
    startDate: z.string(),
    endDate: z.string().optional().nullable(),
    flow: z.enum(['none', 'light', 'medium', 'heavy', 'very_heavy']).optional(),
    painLevel: z.number().min(0).max(10).optional(),
    energyLevel: z.number().min(0).max(10).optional(),
    notes: z.string().optional(),
  }),
  symptom: z.object({
    date: z.string(),
    symptoms: z.array(z.string()),
  }),
  mood: z.object({
    date: z.string(),
    mood: z.enum(['happy', 'loved', 'neutral', 'sad', 'emotional', 'angry', 'tired', 'sick']),
    note: z.string().optional(),
  }),
  journal: z.object({
    date: z.string(),
    title: z.string().optional(),
    content: z.string().min(1),
    image: z.string().optional(),
  }),
  water: z.object({
    date: z.string(),
    glasses: z.number().min(0),
  }),
  medicine: z.object({
    name: z.string().min(1),
    time: z.string(),
    repeat: z.enum(['daily', 'weekdays', 'custom']).optional(),
    notes: z.string().optional(),
  }),
  partner: z.object({
    enabled: z.boolean().optional(),
    partnerName: z.string().optional(),
    shareDaysUntil: z.boolean().optional(),
    shareReminders: z.boolean().optional(),
    shareSupport: z.boolean().optional(),
    shareJournal: z.boolean().optional(),
    shareSymptoms: z.boolean().optional(),
    shareMedical: z.boolean().optional(),
  }),
  profile: z.object({
    name: z.string().optional(),
    age: z.number().optional(),
    height: z.number().optional(),
    weight: z.number().optional(),
    cycleLength: z.number().optional(),
    periodLength: z.number().optional(),
    language: z.string().optional(),
    avatar: z.string().optional(),
  }),
  aiMessage: z.object({
    message: z.string().min(1),
  }),
  questionnaire: z.object({
    answers: z.record(z.any()),
  }),
};

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: 'Validation error',
        errors: result.error.flatten().fieldErrors,
      });
    }
    req.body = result.data;
    next();
  };
}
