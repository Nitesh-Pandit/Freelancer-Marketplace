import express from 'express';
import { signup, login, getAllUsers, completeProfile } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/users', verifyToken, getAllUsers);
router.put('/complete-profile', verifyToken, completeProfile);

export default router;
