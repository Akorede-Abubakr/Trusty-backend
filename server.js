import app from './app.js';
import connectDB from './config/db.js';
import { ENV } from './config/env.js';

// Catch uncaught exceptions before anything else
process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION] Shutting down server immediately...');
  console.error(err.name, err.message);
  if (err.stack) console.error(err.stack);
  process.exit(1);
});

// Start server immediately
const server = app.listen(ENV.PORT, () => {
  console.log(`
  TRUSTY Real Estate Backend Server Running
  Mode:     ${ENV.NODE_ENV}
  Port:     ${ENV.PORT}
  API Root: http://localhost:${ENV.PORT}/api
  Health:   http://localhost:${ENV.PORT}/api/health
`);
});

// Connect to MongoDB Database asynchronously (with automatic fallback)
connectDB();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('[UNHANDLED REJECTION] Closing server & terminating...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle graceful termination
const shutdown = (signal) => {
  console.log(`[${signal} RECEIVED] Gracefully shutting down TRUSTY API...`);
  server.close(() => {
    console.log('[TRUSTY API] Closed all remaining connections.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
