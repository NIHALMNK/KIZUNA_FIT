import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { beforeAll, afterAll, afterEach } from 'vitest';
import { UserModel } from '../../src/modules/identity/infrastructure/persistence/mongoose/models/UserModel';
import { RefreshTokenSessionModel } from '../../src/modules/identity/infrastructure/persistence/mongoose/models/RefreshTokenSessionModel';

let mongoServer: MongoMemoryReplSet;

beforeAll(async () => {
  mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  const mongoUri = mongoServer.getUri();
  
  process.env.MONGODB_URI = mongoUri;
  process.env.JWT_SECRET = 'this_is_a_very_secure_test_secret_32_chars';
  
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(mongoUri);
  }
  
  await UserModel.createCollection();
  await RefreshTokenSessionModel.createCollection();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});
