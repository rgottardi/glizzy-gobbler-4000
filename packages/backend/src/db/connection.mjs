/**
 * MongoDB Connection Module
 * 
 * Handles connecting to MongoDB with proper error handling and logging.
 */
import mongoose from 'mongoose';
import { MONGODB_URI } from '../../../../config/backend.config.mjs';
import logger from '../utils/logger.mjs';

// Set mongoose options
mongoose.set('strictQuery', true);

// Connect to MongoDB
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      // The options below are no longer needed in Mongoose 6+
      // but included as comments for reference
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    logger.error(`MongoDB Connection Error: ${error.message}`, { error });
    process.exit(1);
  }
};

// Handle MongoDB disconnection events
mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected!');
});

// Handle MongoDB reconnection events
mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected!');
});

// Handle MongoDB error events
mongoose.connection.on('error', (err) => {
  logger.error(`MongoDB error: ${err.message}`, { error: err });
});

// Handle process termination and close the MongoDB connection
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed due to app termination');
    process.exit(0);
  } catch (error) {
    logger.error('Error closing MongoDB connection:', { error });
    process.exit(1);
  }
});

export default { connectDB };
