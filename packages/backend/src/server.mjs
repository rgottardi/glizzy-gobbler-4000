/**
 * Main Server Entry Point
 */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { PORT, NODE_ENV } from '../../../config/backend.config.mjs';
import logger from './utils/logger.mjs';
import { connectDB } from './db/connection.mjs';

// Import routes
import authRoutes from './routes/auth.routes.mjs';

// Create Express app
const app = express();

// Core Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true // Important for HttpOnly cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set up HTTP request logging with Morgan
const morganFormat = NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat, { stream: logger.stream }));

// Mount API Routes
app.use('/api/auth', authRoutes);

// Root API endpoint
app.get('/api', (req, res) => {
  logger.info('API root endpoint accessed');
  res.json({ 
    message: 'Welcome to the Glizzy Gobbler 4000 API',
    version: '0.1.0',
    endpoints: {
      auth: '/api/auth',
      health: '/health'
    }
  });
});

// Simple health check route
app.get('/health', (req, res) => {
  logger.debug('Health check endpoint accessed');
  res.json({ 
    status: 'ok', 
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  logger.warn(`404 - Route not found: ${req.originalUrl}`);
  next(error);
});

// Global error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  
  // Log error details
  if (statusCode >= 500) {
    logger.error(`[ERROR] ${statusCode} - ${err.message}`, { 
      stack: err.stack,
      path: req.path,
      method: req.method
    });
  } else {
    logger.warn(`[WARN] ${statusCode} - ${err.message}`, { 
      path: req.path,
      method: req.method
    });
  }
  
  // Send error response
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start the server and connect to MongoDB
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start Express server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT} in ${NODE_ENV} mode`);
      logger.info(`API Documentation: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Initialize server
startServer();

export default app;