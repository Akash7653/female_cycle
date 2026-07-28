import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validate.js';
import { saveQuestionnaire, getQuestionnaire } from '../controllers/questionnaireController.js';

const router = Router();
router.use(protect);
router.post('/', validate(schemas.questionnaire), saveQuestionnaire);
router.get('/', getQuestionnaire);

export default router;
