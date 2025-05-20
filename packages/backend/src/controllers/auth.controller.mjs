/**
 * Authentication Controller
 * 
 * Handles user registration, login, and token management.
 */
import { User } from '../models/index.mjs';
import { generateToken } from '../middleware/auth.middleware.mjs';
import logger from '../utils/logger.mjs';
import { JWT_EXPIRES_IN } from '../../../config/backend.config.mjs';

/**
 * Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      const field = userExists.email === email ? 'email' : 'username';
      return res.status(400).json({ message: `User with this ${field} already exists` });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      // By default, not a system admin
      isSystemAdmin: false
    });

    if (user) {
      // Generate token for the new user
      const token = generateToken(user);

      // Set token as HttpOnly cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 3600000, // 1 hour
        sameSite: 'strict'
      });

      // Return user data (excluding password)
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isSystemAdmin: user.isSystemAdmin,
      });
      
      logger.info(`New user registered: ${username} (${email})`);
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    logger.error('Registration error:', { error: error.message });
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

/**
 * Login a user
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists and password matches
    if (!user || !(await user.comparePassword(password))) {
      logger.warn(`Failed login attempt for email: ${email}`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user);

    // Set token as HttpOnly cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 3600000, // 1 hour
      sameSite: 'strict'
    });

    // Update last login time
    user.lastLogin = Date.now();
    await user.save();

    // Return user data (excluding password)
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isSystemAdmin: user.isSystemAdmin,
    });
    
    logger.info(`User logged in: ${user.username} (${user.email})`);
  } catch (error) {
    logger.error('Login error:', { error: error.message });
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

/**
 * Logout a user
 * @route POST /api/auth/logout
 * @access Public
 */
export const logout = (req, res) => {
  try {
    // Clear the token cookie
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ message: 'Logged out successfully' });
    logger.info('User logged out');
  } catch (error) {
    logger.error('Logout error:', { error: error.message });
    res.status(500).json({ message: 'Server error during logout' });
  }
};

/**
 * Get current user info
 * @route GET /api/auth/me
 * @access Private
 */
export const getCurrentUser = (req, res) => {
  try {
    // User is attached to request by authenticate middleware
    res.json({
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      isSystemAdmin: req.user.isSystemAdmin,
    });
  } catch (error) {
    logger.error('Error getting current user:', { error: error.message });
    res.status(500).json({ message: 'Server error getting user info' });
  }
};

export default {
  register,
  login,
  logout,
  getCurrentUser
};
