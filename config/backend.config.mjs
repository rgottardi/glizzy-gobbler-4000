import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find root .env file (navigate up from config directory)
const rootEnvPath = path.resolve(__dirname, '../../.env');

// Load environment variables
dotenv.config({ path: rootEnvPath });

// Backend configuration
export const PORT = process.env.PORT || 5000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/glizzy_gobbler';
export const JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret-for-development-only';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
export const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Tenant Context
export const TENANT_HEADER_KEY = 'x-tenant-id';

// Export configuration as a single object for easier imports
export default {
  PORT,
  NODE_ENV,
  MONGODB_URI,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  LOG_LEVEL,
  TENANT_HEADER_KEY
};
