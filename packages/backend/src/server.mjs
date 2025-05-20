/**
 * Main Server Entry Point
 */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { PORT, NODE_ENV } from '../../../config/backend.config.mjs';
import logger from './utils/logger.mjs';

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

// Mount API Routes (placeholders - will be implemented in subsequent issues)
// Later we'll organize these routes better and use routers
app.get('/api', (req, res) => {
  logger.info('API root endpoint accessed');
  res.json({ message: 'Welcome to the Glizzy Gobbler 4000 API' });
});

// Simple health check route
app.get('/health', (req, res) => {
  logger.debug('Health check endpoint accessed');
  res.json({ 
    status: 'ok', 
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
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

// Start the server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});

export default app;