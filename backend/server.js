import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cron from 'node-cron';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { apiLimiter, authLimiter } from './middleware/rateLimit.js';
import { errorHandler, notFound } from './middleware/error.js';
import { generatePeriodNotifications } from './services/predictionService.js';

import authRoutes from './routes/authRoutes.js';
import cycleRoutes from './routes/cycleRoutes.js';
import symptomRoutes from './routes/symptomRoutes.js';
import moodRoutes from './routes/moodRoutes.js';
import journalRoutes from './routes/journalRoutes.js';
import waterRoutes from './routes/waterRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';
import partnerRoutes from './routes/partnerRoutes.js';
import flowerRoutes from './routes/flowerRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import predictionRoutes from './routes/predictionRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import questionnaireRoutes from './routes/questionnaireRoutes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors({
  origin: env.CLIENT_URL || true,
  credentials: true,
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate limiting
app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

// Health
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'SkyLove Cycle API' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cycles', cycleRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/partner', partnerRoutes);
app.use('/api/flowers', flowerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/predictions', predictionRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/questionnaires', questionnaireRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = env.PORT || 8787;

await connectDB();

// Scheduled notifications: every day at 8am
cron.schedule('0 8 * * *', generatePeriodNotifications);

app.listen(PORT, () => {
  console.log(`🌸 SkyLove Cycle API running on port ${PORT}`);
});
