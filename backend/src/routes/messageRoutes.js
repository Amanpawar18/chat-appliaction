import express from 'express';
import { protectedRoute } from '../middleware/authMiddleware.js';
import { getUserMessages, getUsersForSideBar, sendUserMessage } from '../controllers/messageController.js';

const router = express.Router();

router.get('/users', protectedRoute, getUsersForSideBar)
router.get('/:id', protectedRoute, getUserMessages)
router.post('/send/:id', protectedRoute, sendUserMessage)

export default router;
