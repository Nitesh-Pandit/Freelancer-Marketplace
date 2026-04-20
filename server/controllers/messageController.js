import Message from '../models/Message.js';
import Order from '../models/Order.js';

// Send message in a chat conversation
export const sendMessage = async (req, res) => {
  try {
    const { orderId, receiverId, message } = req.body;
    const senderId = req.user.id;
    const senderName = req.user.name;

    // Validate required fields
    if (!orderId || !receiverId || !message) {
      return res.status(400).json({ message: 'Missing required fields: orderId, receiverId, message' });
    }

    // Verify order exists and populate user info
    const order = await Order.findById(orderId)
      .populate('clientId', '_id name email')
      .populate('freelancerId', '_id name email')
      .populate('gigId', 'title');
    
    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return res.status(404).json({ message: 'Order not found' });
    }

    // Extract IDs properly (handle both populated objects and string IDs)
    const clientId = typeof order.clientId === 'object' ? order.clientId._id.toString() : String(order.clientId);
    const freelancerId = typeof order.freelancerId === 'object' ? order.freelancerId._id.toString() : String(order.freelancerId);
    const senderIdStr = String(senderId);

    console.log('Message sending debug:', {
      senderId: senderIdStr,
      clientId: clientId,
      freelancerId: freelancerId,
      receiverId: String(receiverId),
      orderId: orderId,
    });

    // Verify sender is part of this order
    if (clientId !== senderIdStr && freelancerId !== senderIdStr) {
      console.error('Sender not authorized:', { senderId: senderIdStr, clientId, freelancerId });
      return res.status(403).json({ message: 'Not authorized to send message in this chat' });
    }

    // Determine receiver name based on order data
    let receiverName;
    if (clientId === senderIdStr) {
      // Sender is client, receiver is freelancer
      receiverName = typeof order.freelancerId === 'object' ? order.freelancerId.name : 'Freelancer';
    } else {
      // Sender is freelancer, receiver is client
      receiverName = typeof order.clientId === 'object' ? order.clientId.name : 'Client';
    }

    // Create and save message
    const newMessage = new Message({
      orderId,
      senderId,
      receiverId,
      message,
      senderName,
      receiverName,
    });

    const savedMessage = await newMessage.save();

    console.log('Message saved successfully:', savedMessage._id);

    res.status(201).json({
      message: 'Message sent successfully',
      data: savedMessage,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ 
      message: 'Error sending message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all messages for an order (chat history)
export const getMessages = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    // Verify user is part of this order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Extract IDs properly (handle both populated objects and string IDs)
    const clientId = typeof order.clientId === 'object' ? order.clientId._id : order.clientId;
    const freelancerId = typeof order.freelancerId === 'object' ? order.freelancerId._id : order.freelancerId;

    if (clientId.toString() !== userId && freelancerId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this chat' });
    }

    const messages = await Message.find({ orderId })
      .sort({ createdAt: 1 });

    res.status(200).json({
      message: 'Messages fetched',
      messages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

// Get all conversations for a user
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all orders where user is involved
    const orders = await Order.find({
      $or: [
        { clientId: userId },
        { freelancerId: userId },
      ],
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      message: 'Conversations fetched',
      conversations: orders,
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
};

// Mark messages as read
export const markMessagesAsRead = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    await Message.updateMany(
      { orderId, receiverId: userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Error marking messages as read' });
  }
};

// Get unread message count grouped by order
export const getUnreadMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all unread messages where user is receiver
    const unreadMessages = await Message.find({
      receiverId: userId,
      isRead: false,
    });

    // Group by orderId and count
    const unreadByOrder = {};
    unreadMessages.forEach((msg) => {
      const orderId = msg.orderId.toString();
      unreadByOrder[orderId] = (unreadByOrder[orderId] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      unreadByOrder,
    });
  } catch (error) {
    console.error('Error fetching unread messages:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching unread messages',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
