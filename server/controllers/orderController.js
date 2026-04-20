import Order from '../models/Order.js';
import User from '../models/User.js';
import Gig from '../models/Gig.js';

// Create new order when client hires freelancer
export const createOrder = async (req, res) => {
  try {
    const { gigId } = req.body;
    const clientId = req.user.id;

    // Get gig details
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: 'Gig not found' });
    }

    // Get client details
    const client = await User.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Get freelancer details
    const freelancer = await User.findById(gig.userId);
    if (!freelancer) {
      return res.status(404).json({ message: 'Freelancer not found' });
    }

    // Create new order
    const newOrder = new Order({
      clientId,
      freelancerId: gig.userId,
      gigId,
      price: gig.price,
      status: 'pending',
      clientName: client.name,
      freelancerName: freelancer.name,
      gigTitle: gig.title,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: 'Order created successfully',
      order: savedOrder,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
};

// Get all pending orders for freelancer
export const getPendingOrders = async (req, res) => {
  try {
    const freelancerId = req.user.id;

    const orders = await Order.find({
      freelancerId,
      status: 'pending',
    })
      .populate('clientId', 'name email')
      .populate('gigId', 'title description price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Pending orders fetched',
      orders,
    });
  } catch (error) {
    console.error('Error fetching pending orders:', error);
    res.status(500).json({ message: 'Error fetching pending orders' });
  }
};

// Get all orders for freelancer (pending + accepted + others)
export const getFreelancerAllOrders = async (req, res) => {
  try {
    const freelancerId = req.user.id;

    const orders = await Order.find({ freelancerId })
      .populate('clientId', 'name email _id')
      .populate('gigId', 'title description price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'All freelancer orders fetched',
      orders,
    });
  } catch (error) {
    console.error('Error fetching freelancer orders:', error);
    res.status(500).json({ message: 'Error fetching freelancer orders' });
  }
};

// Get all orders for client
export const getClientOrders = async (req, res) => {
  try {
    const clientId = req.user.id;

    const orders = await Order.find({ clientId })
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title description price')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Client orders fetched',
      orders,
    });
  } catch (error) {
    console.error('Error fetching client orders:', error);
    res.status(500).json({ message: 'Error fetching client orders' });
  }
};

// Accept order (freelancer accepts)
export const acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const freelancerId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify freelancer is the one accepting
    if (order.freelancerId.toString() !== freelancerId) {
      return res.status(403).json({ message: 'Not authorized to accept this order' });
    }

    order.status = 'accepted';
    const updatedOrder = await order.save();

    // Populate the references before sending response
    const populatedOrder = await Order.findById(updatedOrder._id)
      .populate('clientId', 'name email _id')
      .populate('freelancerId', 'name email _id')
      .populate('gigId', 'title description price');

    res.status(200).json({
      message: 'Order accepted, chat started!',
      order: populatedOrder,
    });
  } catch (error) {
    console.error('Error accepting order:', error);
    res.status(500).json({ message: 'Error accepting order' });
  }
};

// Complete order
export const completeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify user is freelancer or client
    if (
      order.freelancerId.toString() !== userId &&
      order.clientId.toString() !== userId
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = 'completed';
    const updatedOrder = await order.save();

    res.status(200).json({
      message: 'Order completed',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error completing order:', error);
    res.status(500).json({ message: 'Error completing order' });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify user is freelancer or client
    if (
      order.freelancerId.toString() !== userId &&
      order.clientId.toString() !== userId
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    order.status = 'cancelled';
    const updatedOrder = await order.save();

    res.status(200).json({
      message: 'Order cancelled',
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ message: 'Error cancelling order' });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate('clientId', 'name email')
      .populate('freelancerId', 'name email')
      .populate('gigId', 'title description price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order fetched',
      order,
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
};
