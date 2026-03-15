import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectDB, disconnectDB } from '../config/database';
import { Booking } from '../models/Booking';
import { Hotel } from '../models/Hotel';
import { User } from '../models/User';

export const setupTestDB = () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
    await connectDB();
  });

  afterEach(async () => {
    await Booking.deleteMany({});
    await Hotel.deleteMany({});
    await User.deleteMany({});
  });

  afterAll(async () => {
    await disconnectDB();
    await mongoServer.stop();
  });
};
