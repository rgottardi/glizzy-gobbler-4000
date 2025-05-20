/**
 * Main Server Entry Point
 */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT, NODE_ENV } from '../../../config/backend.config.mjs';

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

// API Routes (placeholders - will be implemented in subsequent issues)
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Glizzy Gobbler 4000 API' });
});

// Simple health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', environment: NODE_ENV });
});

// Basic error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(`[ERROR] ${statusCode} - ${err.message}`, err.stack);
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});

export default app;