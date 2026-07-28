import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validate.js';
import { getAIHistory, createAIResponse } from '../controllers/aiController.js';

const router = Router();
router.use(protect);
router.get('/', getAIHistory);
router.post('/', validate(schemas.aiMessage), createAIResponse);

export default router;
