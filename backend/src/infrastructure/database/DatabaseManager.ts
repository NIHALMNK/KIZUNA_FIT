import mongoose from 'mongoose';
import { env } from '../../config/env.config';
import { ILogger } from '../../shared/contracts/ILogger';

export class DatabaseManager {
  constructor(private logger: ILogger) {}

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(env.MONGODB_URI);
      this.logger.info('✅ Successfully connected to MongoDB');
    } catch (error) {
      this.logger.error('❌ Error connecting to MongoDB', { error });
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.logger.info('🛑 Disconnected from MongoDB');
  }

  public getStatus(): string {
    return mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  }
}
