import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { validate, schemas } from '../middleware/validate.js';
import { getPartner, updatePartner } from '../controllers/partnerController.js';

const router = Router();
router.use(protect);
router.get('/', getPartner);
router.put('/', validate(schemas.partner), updatePartner);

export default router;
