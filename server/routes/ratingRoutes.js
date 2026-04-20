import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  completeOrder,
  submitRating,
  getFreelancerRatings,
  canRateOrder,
} from '../controllers/ratingController.js';

const router = express.Router();

// Complete an order (mark as completed)
router.post('/complete', verifyToken, completeOrder);

// Submit a rating for freelancer
router.post('/submit', verifyToken, submitRating);

// Get ratings for a freelancer
router.get('/freelancer/:freelancerId', getFreelancerRatings);

// Check if user can rate an order
router.get('/can-rate/:orderId', verifyToken, canRateOrder);

export default router;
