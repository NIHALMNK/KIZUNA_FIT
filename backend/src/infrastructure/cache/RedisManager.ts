import { createClient, RedisClientType } from 'redis';
import { env } from '../../config/env.config';
import { ILogger } from '../../shared/contracts/ILogger';

export class RedisManager {
  private client: RedisClientType;

  constructor(private logger: ILogger) {
    this.client = createClient({
      url: env.REDIS_URL
    });

    this.client.on('error', (err: Error) => this.logger.error('Redis Client Error', err as unknown as Record<string, unknown>));
    this.client.on('connect', () => this.logger.info('✅ Successfully connected to Redis'));
  }

  public async connect(): Promise<void> {
    if (!this.client.isOpen) {
      try {
        await this.client.connect();
      } catch (error) {
        this.logger.error('❌ Error connecting to Redis', { error });
        throw error;
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.quit();
      this.logger.info('🛑 Disconnected from Redis');
    }
  }

  public getClient(): RedisClientType {
    return this.client;
  }

  public getStatus(): string {
    return this.client.isOpen ? 'connected' : 'disconnected';
  }
}
