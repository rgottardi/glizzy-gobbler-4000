/**
 * MongoDB Connection Module
 */
import mongoose from 'mongoose';
import { MONGODB_URI, NODE_ENV } from '../../../../config/backend.config.mjs';

/**
 * Connect to MongoDB
 * @returns {Promise<mongoose.Connection>}
 */
export const connectDB = async () => {
  try {
    // Set mongoose options
    mongoose.set('strictQuery', true);
    
    // Connect to MongoDB
    const conn = await mongoose.connect(MONGODB_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    return conn.connection;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Close the MongoDB connection (useful for tests)
 * @returns {Promise<void>}
 */
export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error(`Error closing MongoDB connection: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;