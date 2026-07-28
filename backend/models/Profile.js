import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    age: { type: Number, default: null },
    height: { type: Number, default: null },
    weight: { type: Number, default: null },
    country: { type: String, default: '' },
    occupation: { type: String, default: '' },
    lifestyle: { type: String, default: '' },
    activityLevel: { type: String, default: '' },
    sleepHours: { type: Number, default: null },
    stressLevel: { type: String, default: '' },
    bloodGroup: { type: String, default: '' },
    smoker: { type: Boolean, default: false },
    vape: { type: Boolean, default: false },
    alcohol: { type: String, default: '' },
    periodHistory: {
      ageAtFirstPeriod: { type: Number, default: null },
      averageCycleLength: { type: Number, default: null },
      averagePeriodLength: { type: Number, default: null },
      regularity: { type: String, default: '' },
      lastPeriodDate: { type: String, default: '' },
      typicalFlow: { type: String, default: '' },
      typicalPainLevel: { type: String, default: '' },
      spotting: { type: Boolean, default: false },
    },
    symptoms: [{ type: String }],
    energyLevel: { type: String, default: '' },
    waterIntake: { type: String, default: '' },
    diet: {
      type: { type: String, default: '' },
      foodAllergies: { type: String, default: '' },
      ironRich: { type: Boolean, default: false },
      calciumIntake: { type: Boolean, default: false },
    },
    exercise: {
      doesExercise: { type: Boolean, default: false },
      daysPerWeek: { type: Number, default: null },
      type: { type: String, default: '' },
    },
    mentalHealth: {
      stressFrequency: { type: String, default: '' },
      anxiety: { type: String, default: '' },
      depression: { type: String, default: '' },
      prePeriodMood: { type: String, default: '' },
    },
    medication: {
      currentMedications: { type: String, default: '' },
      birthControl: { type: Boolean, default: false },
      painkillers: { type: Boolean, default: false },
      supplements: { type: String, default: '' },
    },
    healthHistory: {
      pcos: { type: Boolean, default: false },
      pcod: { type: Boolean, default: false },
      endometriosis: { type: Boolean, default: false },
      fibroids: { type: Boolean, default: false },
      anemia: { type: Boolean, default: false },
      diabetes: { type: Boolean, default: false },
      thyroid: { type: Boolean, default: false },
      bloodPressure: { type: Boolean, default: false },
      migraine: { type: Boolean, default: false },
      pregnancyHistory: { type: String, default: '' },
      surgeries: { type: String, default: '' },
    },
    allergies: { type: String, default: '' },
    emergencyContact: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true },
);

profileSchema.index({ user: 1 });

export const Profile = mongoose.model('Profile', profileSchema);
