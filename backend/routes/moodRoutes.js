import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validate.js';
import { getMoods, setMood } from '../controllers/moodController.js';

const router = Router();
router.use(protect);
router.get('/', getMoods);
router.post('/', validate(schemas.mood), setMood);

export default router;
