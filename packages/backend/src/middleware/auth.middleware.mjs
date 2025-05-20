/**
 * Authentication Middleware
 * 
 * Handles JWT token verification and attaches user information to the request.
 */
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../../config/backend.config.mjs';
import { User } from '../models/index.mjs';
import logger from '../utils/logger.mjs';

/**
 * Middleware to protect routes by verifying JWT token
 * Token can be sent in Authorization header or HttpOnly cookie
 */
export const authenticate = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in cookies (preferred for browser clients)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } 
    // Check for token in Authorization header (for API clients)
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token found, return unauthorized
    if (!token) {
      logger.warn('Authentication failed: No token provided');
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      logger.warn(`Authentication failed: User not found for token ID ${decoded.id}`);
      return res.status(401).json({ message: 'Invalid token - user not found' });
    }

    // Attach user to request for use in subsequent middleware/routes
    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', { error: error.message });
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    res.status(500).json({ message: 'Server error during authentication' });
  }
};

/**
 * Generate JWT token for a user
 */
export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id,
      isSystemAdmin: user.isSystemAdmin 
    }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
  );
};

export default { authenticate, generateToken };
