import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/math-annotation-tool';
const USE_MONGODB = process.env.USE_MONGODB !== 'false';

// Connect to MongoDB
const connectDB = async () => {
  if (!USE_MONGODB) {
    console.log('MongoDB connection skipped (USE_MONGODB=false)');
    return;
  }
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Warning: Continuing without MongoDB. Some features may be limited.');
    return false;
  }
};

export default connectDB;
