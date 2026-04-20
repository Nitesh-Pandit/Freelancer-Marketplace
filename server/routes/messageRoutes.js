import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  sendMessage,
  getMessages,
  getConversations,
  markMessagesAsRead,
  getUnreadMessages,
} from '../controllers/messageController.js';

const router = express.Router();

// Send message
router.post('/', verifyToken, sendMessage);

// Get unread message counts grouped by order (MUST BE BEFORE :orderId route)
router.get('/unread', verifyToken, getUnreadMessages);

// Get all conversations for user
router.get('/conversations/all', verifyToken, getConversations);

// Get messages for specific order (chat history)
router.get('/:orderId', verifyToken, getMessages);

// Mark messages as read
router.put('/:orderId/read', verifyToken, markMessagesAsRead);

export default router;
