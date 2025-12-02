import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const dbUri = process.env.DB_URI || 'mongodb://localhost:27017/mindwhiz';
    await mongoose.connect(dbUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

