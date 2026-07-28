import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validate.js';
import { getMedicines, addMedicine, toggleMedicine, deleteMedicine } from '../controllers/medicineController.js';

const router = Router();
router.use(protect);
router.get('/', getMedicines);
router.post('/', validate(schemas.medicine), addMedicine);
router.patch('/:id/toggle', toggleMedicine);
router.delete('/:id', deleteMedicine);

export default router;
