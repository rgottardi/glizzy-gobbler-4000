/**
 * Authentication Routes
 * 
 * Defines routes for user registration, login, and token management.
 */
import express from 'express';
import { register, login, logout, getCurrentUser } from '../controllers/auth.controller.mjs';
import { authenticate } from '../middleware/auth.middleware.mjs';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticate, getCurrentUser);

export default router;
