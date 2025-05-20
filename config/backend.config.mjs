/**
 * Backend Configuration Module
 * 
 * Centralizes access to environment variables needed by the backend.
 * This module loads variables from the root .env file.
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the path to the root .env file (two levels up from config folder)
const rootEnvPath = path.resolve(__dirname, '../.env');

// Load environment variables from .env file
dotenv.config({ path: rootEnvPath });

// Export configuration values with defaults
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = parseInt(process.env.PORT || '5000', 10);
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/glizzy-gobbler-4000';
export const JWT_SECRET = process.env.JWT_SECRET || 'fallback-jwt-secret-not-for-production';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// For development clarity, return the config as a log-friendly object
const backendConfig = {
  NODE_ENV,
  PORT,
  MONGODB_URI,
  JWT_SECRET: NODE_ENV === 'production' ? '[REDACTED]' : JWT_SECRET, // Hide secrets in logs
  JWT_EXPIRES_IN,
  LOG_LEVEL,
};

// Log the configuration in development mode only (but hide secrets)
if (NODE_ENV === 'development') {
  console.log('Backend Config:', backendConfig);
}

export default backendConfig;