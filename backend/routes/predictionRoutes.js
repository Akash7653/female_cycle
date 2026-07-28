import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { Cycle } from '../models/Cycle.js';
import { predict } from '../services/predictionService.js';

const router = Router();
router.use(protect);

router.get('/', async (req, res) => {
  const cycles = await Cycle.find({ user: req.user._id }).sort({ startDate: 1 });
  const predictionData = predict(cycles, req.user.cycleLength, req.user.periodLength);
  res.json({ prediction: predictionData });
});

export default router;
