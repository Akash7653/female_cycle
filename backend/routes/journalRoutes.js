import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validate.js';
import { getJournals, addJournal, deleteJournal } from '../controllers/journalController.js';

const router = Router();
router.use(protect);
router.get('/', getJournals);
router.post('/', validate(schemas.journal), addJournal);
router.delete('/:id', deleteJournal);

export default router;
