import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  ADMIN_URL: process.env.ADMIN_URL || 'http://localhost:5174',
  MONGODB_URI:
    process.env.MONGODB_URI ||
    'mongodb+srv://gbolahanbakry111_db_user:GfYZWXXp0SDEC6zJ@cluster0.spqpfaw.mongodb.net/trusty_real_estate?retryWrites=true&w=majority',
  JWT_SECRET: process.env.JWT_SECRET || 'trusty_real_estate_super_secret_jwt_key_2026_secure_random_seed_prod_ready',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  JWT_COOKIE_EXPIRE: Number(process.env.JWT_COOKIE_EXPIRE) || 7,
  RATE_LIMIT_WINDOW_MS: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  RATE_LIMIT_MAX: Number(process.env.RATE_LIMIT_MAX) || 100,
  AUTH_RATE_LIMIT_MAX: Number(process.env.AUTH_RATE_LIMIT_MAX) || 20,
};
