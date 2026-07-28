import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    accountType: { type: String, enum: ['myself', 'loved-one'], default: 'myself' },
    name: { type: String, required: true, trim: true },
    relationship: { type: String, default: '' },
    lovedOneName: { type: String, default: '' },
    lovedOneAge: { type: Number, default: null },
    dateOfBirth: { type: String, default: '' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
    age: { type: Number, default: null },
    height: { type: Number, default: null },
    weight: { type: Number, default: null },
    cycleLength: { type: Number, default: 28 },
    periodLength: { type: Number, default: 5 },
    language: { type: String, default: 'English' },
    avatar: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    resetToken: { type: String, default: '' },
    resetTokenExpiry: { type: Date, default: null },
  },
  { timestamps: true },
);

export const User = mongoose.model('User', userSchema);
