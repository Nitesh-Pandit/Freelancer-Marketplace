import express from 'express';
import {
  createGig,
  getAllGigs,
  getFreelancerGigs,
  getGigById,
  updateGig,
  deleteGig,
} from '../controllers/gigController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllGigs);
router.get('/:gigId', getGigById);

// Protected routes
router.post('/', verifyToken, createGig);
router.get('/freelancer/my-gigs', verifyToken, getFreelancerGigs);
router.put('/:gigId', verifyToken, updateGig);
router.delete('/:gigId', verifyToken, deleteGig);

export default router;
