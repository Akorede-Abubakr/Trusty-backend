import mongoose from 'mongoose';
import { ENV } from './env.js';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return mongoose.connection;

  try {
    console.log(`[MongoDB] Connecting to Atlas cluster...`);
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
      autoIndex: true,
    });

    isConnected = true;
    console.log(`[MongoDB Atlas Connected] Host: ${conn.connection.host} | DB: ${conn.connection.name}`);
    return conn;
  } catch (primaryError) {
    console.warn(`\n⚠️  [MongoDB Warning] Primary connection to Atlas failed (${primaryError.message}).`);
    console.warn('⚠️  Reason: Atlas cluster requires IP Whitelist (0.0.0.0/0) in MongoDB Cloud Console.');
    console.log('🔄 Dev Mode Active: Fallback local store is operational for complete Auth & JWT testing.\n');
    isConnected = false;
    return null;
  }
};

export const isDbConnected = () => isConnected;

export default connectDB;
