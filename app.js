import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

import { ENV } from './config/env.js';
import routes from './routes/index.js';
import { apiLimiter } from './middleware/rateLimitMiddleware.js';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware.js';

const app = express();

// 1. Security Headers
app.use(helmet());

// 2. CORS configuration
const corsOptions = {
  origin: [
    ENV.CLIENT_URL,
    ENV.ADMIN_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5174',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
app.use(cors(corsOptions));

// 3. HTTP Request Logger
if (ENV.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 4. Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// 5. Global Rate Limiter
app.use('/api', apiLimiter);

// 6. Base API endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to TRUSTY Real Estate API',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// 7. Mount Main API Routes
app.use('/api', routes);

// 8. 404 Catch-all
app.use(notFoundHandler);

// 9. Centralized Error Handler
app.use(errorHandler);

export default app;
