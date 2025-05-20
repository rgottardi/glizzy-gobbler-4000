// Frontend configuration for Vite

// These variables are injected by Vite from .env file
// All env variables used in the frontend must be prefixed with VITE_
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const TENANT_ID_HEADER = 'x-tenant-id';

// Export configuration as a single object for easier imports
export default {
  API_BASE_URL,
  TENANT_ID_HEADER
};
