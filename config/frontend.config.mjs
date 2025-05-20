/**
 * Frontend Configuration Module
 * 
 * Centralizes access to environment variables needed by the frontend.
 * This module loads variables from the root .env file with VITE_ prefix.
 */

// Vite automatically exposes env variables prefixed with VITE_
// They are available through import.meta.env
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Header for multi-tenant context
export const TENANT_ID_HEADER = 'x-tenant-id';

// Other frontend configuration values can be added here

// For development clarity, return the config as a log-friendly object
const frontendConfig = {
  API_BASE_URL,
  TENANT_ID_HEADER,
};

// Log the configuration in development mode only
if (import.meta.env.DEV) {
  console.log('Frontend Config:', frontendConfig);
}

export default frontendConfig;