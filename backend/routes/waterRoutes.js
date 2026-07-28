import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validate.js';
import { getWater, setWater } from '../controllers/waterController.js';

const router = Router();
router.use(protect);
router.get('/', getWater);
router.post('/', validate(schemas.water), setWater);

export default router;
