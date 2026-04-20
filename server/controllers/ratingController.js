import Rating from '../models/Rating.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Mark order as completed and allow rating
export const completeOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const clientId = req.user.id;

    // Verify order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify user is the client
    if (order.clientId.toString() !== clientId) {
      return res.status(403).json({ message: 'Not authorized to complete this order' });
    }

    // Update order status to completed
    order.status = 'completed';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order marked as completed',
      order,
    });
  } catch (error) {
    console.error('Error completing order:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing order',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Submit rating for freelancer
export const submitRating = async (req, res) => {
  try {
    const { orderId, rating, review } = req.body;
    const clientId = req.user.id;

    // Validate rating input
    if (!orderId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: 'Invalid input. Rating must be between 1 and 5',
      });
    }

    // Verify order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify user is the client
    if (order.clientId.toString() !== clientId) {
      return res.status(403).json({ message: 'Not authorized to rate this order' });
    }

    // Verify order is completed
    if (order.status !== 'completed') {
      return res.status(400).json({
        message: 'Can only rate completed orders',
      });
    }

    // Check if rating already exists
    const existingRating = await Rating.findOne({ orderId });
    if (existingRating) {
      return res.status(400).json({
        message: 'You have already rated this order',
      });
    }

    // Create new rating
    const newRating = new Rating({
      orderId,
      clientId,
      freelancerId: order.freelancerId,
      gigId: order.gigId,
      rating: Math.round(rating),
      review: review?.trim() || '',
      clientName: order.clientName,
      gigTitle: order.gigTitle,
    });

    const savedRating = await newRating.save();

    // Update freelancer's average rating
    const allRatings = await Rating.find({ freelancerId: order.freelancerId });
   const averageRating = allRatings.length > 0
  ? Number(
      (allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length).toFixed(1)
    )
  : 0;

    await User.findByIdAndUpdate(
      order.freelancerId,
      { averageRating, totalRatings: allRatings.length },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      rating: savedRating,
    });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting rating',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get ratings for a freelancer
export const getFreelancerRatings = async (req, res) => {
  try {
    const { freelancerId } = req.params;

    console.log("Incoming freelancerId:", freelancerId); // 👈 DEBUG

    // 🛑 STOP BAD REQUEST HERE
    if (!freelancerId || freelancerId === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Invalid freelancer ID"
      });
    }

    const ratings = await Rating.find({ freelancerId })
      .sort({ createdAt: -1 });

    const averageRating = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
      : 0;

    res.json({
      success: true,
      ratings,
      averageRating,
      totalRatings: ratings.length,
    });

  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ success: false });
  }
};

// Check if user can rate an order
export const canRateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const clientId = req.user.id;

    // Verify order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify user is the client
    if (order.clientId.toString() !== clientId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if order is completed
    const isCompleted = order.status === 'completed';

    // Check if already rated
    const existingRating = await Rating.findOne({ orderId });
    const alreadyRated = !!existingRating;

    res.status(200).json({
      success: true,
      canRate: isCompleted && !alreadyRated,
      isCompleted,
      alreadyRated,
      existingRating: alreadyRated ? existingRating : null,
    });
  } catch (error) {
    console.error('Error checking rating status:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking rating status',
    });
  }
};
