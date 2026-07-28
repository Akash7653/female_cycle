import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function normalizeUrl(value) {
  if (!value) return '';
  return value.trim().replace(/\/+$/, '');
}

export const env = {
  PORT: process.env.PORT || '8787',
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'cookie-secret',
  CLIENT_URL: normalizeUrl(process.env.CLIENT_URL || 'http://localhost:5173'),
  SMTP_HOST: process.env.SMTP_HOST || process.env.EMAIL_HOST || '',
  SMTP_PORT: process.env.SMTP_PORT || process.env.EMAIL_PORT || '587',
  SMTP_USER: process.env.SMTP_USER || process.env.EMAIL_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || process.env.EMAIL_PASS || '',
  FROM_EMAIL: process.env.FROM_EMAIL || process.env.SMTP_FROM || 'SkyLove <no-reply@skylove.app>',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || '',
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY || '',
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || '',
  REDIS_URL: process.env.REDIS_URL || '',
  GROK_API_KEY: process.env.GROK_API_KEY || '',
};

export function assertRequiredEnvs() {
  requireEnv('JWT_SECRET');
  requireEnv('MONGODB_URI');
  requireEnv('CLIENT_URL');
}
