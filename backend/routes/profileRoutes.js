import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { createProfile, updateProfile, getProfile, getProfiles } from '../controllers/profileController.js';

const router = Router();
router.use(protect);
router.get('/', getProfiles);
router.get('/:id', getProfile);
router.post('/', createProfile);
router.put('/:id', updateProfile);

export default router;
