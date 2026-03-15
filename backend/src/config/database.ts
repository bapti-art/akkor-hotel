import mongoose from 'mongoose';
import { config } from './index';

export const connectDB = async (): Promise<void> => {
  const mongodbUri = process.env.MONGODB_URI || config.mongodbUri;
  await mongoose.connect(mongodbUri);
  console.log('MongoDB connected');
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
};
