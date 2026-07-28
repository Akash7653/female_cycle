import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getFlowers } from '../controllers/flowerController.js';

const router = Router();
router.use(protect);
router.get('/', getFlowers);

export default router;
