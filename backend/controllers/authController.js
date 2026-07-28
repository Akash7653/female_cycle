import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { sendEmail } from '../services/emailService.js';
import { env } from '../config/env.js';

const signToken = (id) => jwt.sign({ id }, env.JWT_SECRET, {
  expiresIn: env.JWT_EXPIRES_IN,
});

const sanitize = (u) => ({
  id: u._id,
  accountType: u.accountType,
  name: u.name,
  relationship: u.relationship,
  lovedOneName: u.lovedOneName,
  lovedOneAge: u.lovedOneAge,
  dateOfBirth: u.dateOfBirth,
  email: u.email,
  age: u.age,
  height: u.height,
  weight: u.weight,
  cycleLength: u.cycleLength,
  periodLength: u.periodLength,
  language: u.language,
  avatar: u.avatar,
  isVerified: u.isVerified,
  createdAt: u.createdAt,
});

export async function register(req, res) {
  const {
    accountType = 'myself',
    name,
    email,
    password,
    relationship,
    lovedOneName,
    lovedOneAge,
    dateOfBirth,
    height,
    weight,
    cycleLength,
    periodLength,
  } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered.' });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({
    accountType,
    name,
    relationship: relationship || '',
    lovedOneName: lovedOneName || '',
    lovedOneAge: lovedOneAge || null,
    dateOfBirth: dateOfBirth || '',
    email,
    password: hash,
    height: height ?? null,
    weight: weight ?? null,
    cycleLength: cycleLength ?? 28,
    periodLength: periodLength ?? 5,
  });

  if (accountType === 'loved-one') {
    await Profile.create({
      user: user._id,
      fullName: lovedOneName || `${name}'s loved one`,
      age: lovedOneAge ?? null,
      notes: `Created by ${name} with their permission.`,
    });
  }

  const token = signToken(user._id);

  try {
    await sendEmail(email, 'Welcome to SkyLove Cycle 🌸', `Hi ${name},\n\nWelcome to SkyLove Cycle. Your private wellness journey begins now.\n\nWith love,\nThe SkyLove Team`);
  } catch { /* email optional */ }

  res.status(201).json({ token, user: sanitize(user) });
}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials.' });

  const token = signToken(user._id);
  res.json({ token, user: sanitize(user) });
}

export async function getMe(req, res) {
  res.json({ user: sanitize(req.user) });
}

export async function updateProfile(req, res) {
  const allowed = ['name', 'age', 'height', 'weight', 'cycleLength', 'periodLength', 'language', 'avatar'];
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) req.user[k] = req.body[k];
  });
  await req.user.save();
  res.json({ user: sanitize(req.user) });
}

export async function forgotPassword(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '15m' });
  user.resetToken = token;
  user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  const link = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset?token=${token}`;
  try {
    await sendEmail(email, 'SkyLove — Reset your password', `Reset link: ${link}`);
  } catch { /* email optional */ }

  res.json({ message: 'If that email exists, a reset link has been sent.' });
}

export async function deleteAccount(req, res) {
  await User.findByIdAndDelete(req.user._id);
  res.json({ message: 'Account deleted.' });
}
