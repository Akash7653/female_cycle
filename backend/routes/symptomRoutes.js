import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validate.js';
import { getSymptoms, setSymptoms } from '../controllers/symptomController.js';

const router = Router();
router.use(protect);
router.get('/', getSymptoms);
router.post('/', validate(schemas.symptom), setSymptoms);

export default router;
