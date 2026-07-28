import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { getNotifications, markRead } from '../controllers/notificationController.js';

const router = Router();
router.use(protect);
router.get('/', getNotifications);
router.patch('/:id/read', markRead);

export default router;
