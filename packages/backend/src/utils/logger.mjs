/**
 * Winston Logger Configuration
 * 
 * Centralizes logging for the backend application with different
 * transports and log levels based on the environment.
 */
import winston from 'winston';
import { LOG_LEVEL, NODE_ENV } from '../../../../config/backend.config.mjs';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define console format for readable logs
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    const metaString = Object.keys(meta).length ? 
      `\n${JSON.stringify(meta, null, 2)}` : '';
    return `${timestamp} ${level}: ${message}${metaString}`;
  })
);

// Create the logger instance
const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: logFormat,
  defaultMeta: { service: 'backend-api' },
  transports: [
    // Always log to console
    new winston.transports.Console({
      format: consoleFormat
    }),
  ],
  // Don't exit on uncaught exceptions
  exitOnError: false,
});

// Add a file transport in production
if (NODE_ENV === 'production') {
  logger.add(
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    })
  );
  logger.add(
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 10485760, // 10MB
      maxFiles: 5,
    })
  );
}

// Add a stream object for Morgan integration
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

// Log a message on startup
logger.info(`Logger initialized in ${NODE_ENV} mode with level: ${LOG_LEVEL}`);

export default logger;
