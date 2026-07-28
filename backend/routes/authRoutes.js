import { Router } from 'express';
import { register, login, getMe, updateProfile, forgotPassword, deleteAccount } from '../controllers/authController.js';
import { validate, schemas } from '../middleware/validate.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', validate(schemas.register), register);
router.post('/login', validate(schemas.login), login);
router.post('/forgot', forgotPassword);
router.get('/me', protect, getMe);
router.put('/me', protect, validate(schemas.profile), updateProfile);
router.delete('/me', protect, deleteAccount);

export default router;
