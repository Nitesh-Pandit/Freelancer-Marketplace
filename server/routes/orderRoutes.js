import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  createOrder,
  getPendingOrders,
  getFreelancerAllOrders,
  getClientOrders,
  acceptOrder,
  completeOrder,
  cancelOrder,
  getOrderById,
} from '../controllers/orderController.js';

const router = express.Router();

// Create new order
router.post('/', verifyToken, createOrder);

// Get all orders for freelancer (pending + accepted + all)
router.get('/freelancer/all', verifyToken, getFreelancerAllOrders);

// Get pending orders for freelancer
router.get('/freelancer/pending', verifyToken, getPendingOrders);

// Get all orders for client
router.get('/client/my-orders', verifyToken, getClientOrders);

// Get order by ID
router.get('/:orderId', verifyToken, getOrderById);

// Accept order (freelancer)
router.put('/:orderId/accept', verifyToken, acceptOrder);

// Complete order
router.put('/:orderId/complete', verifyToken, completeOrder);

// Cancel order
router.put('/:orderId/cancel', verifyToken, cancelOrder);

export default router;
