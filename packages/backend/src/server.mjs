import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { PORT, MONGODB_URI } from '../../config/backend.config.mjs';

// Import utilities (to be created later)
// import logger from './utils/logger.mjs';

// Initialize Express
const app = express();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Connected');
    // logger.info('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes (to be added later)
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/tenants', tenantRoutes);

// Example route for testing
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'API is running', 
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  // logger.error(err.stack);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    // logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
});

export default app;
