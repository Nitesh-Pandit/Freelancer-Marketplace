import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import gigRoutes from './routes/gigRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/freelancer-marketplace')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Freelancer Marketplace API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      gigs: '/api/gigs',
      api: '/api'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Gig routes
app.use('/api/gigs', gigRoutes);

// Order routes
app.use('/api/orders', orderRoutes);

// Message routes
app.use('/api/messages', messageRoutes);

// Rating routes
app.use('/api/ratings', ratingRoutes);

// Favicon handler
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
