import { createClient, RedisClientType } from 'redis';
import { env } from '../../config/env.config';
import { ILogger } from '../../shared/contracts/ILogger';

export class RedisManager {
  private client: RedisClientType;
  private hasConnectedOnce = false;

  constructor(private logger: ILogger) {
    this.client = createClient({
      url: env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries: number, cause: Error) => {
          // Fail fast on fatal authentication/configuration errors
          const message = cause?.message?.toLowerCase() || '';
          if (
            message.includes('auth') ||
            message.includes('wrongpass') ||
            message.includes('noauth')
          ) {
            return new Error(`Redis authentication failure: ${cause.message}`);
          }

          // Bounded reconnect behavior: prevent infinite loops on permanent network partition
          const MAX_RETRIES = 20;
          if (retries > MAX_RETRIES) {
            return new Error(
              `Redis connection terminated after ${MAX_RETRIES} retry attempts: ${cause.message}`,
            );
          }

          // Exponential backoff capped at 3000ms (100ms, 200ms, 400ms, ..., 3000ms)
          return Math.min(Math.pow(2, retries) * 50, 3000);
        },
      },
    });

    this.client.on('connect', () => {
      this.logger.info('✅ Connected to Redis server');
    });

    this.client.on('ready', () => {
      if (this.hasConnectedOnce) {
        this.logger.info('✅ Successfully reconnected to Redis and ready to accept commands');
      } else {
        this.hasConnectedOnce = true;
        this.logger.info('✅ Redis ready to accept commands');
      }
    });

    this.client.on('reconnecting', () => {
      this.logger.warn('⚠️ Redis connection lost, reconnecting...');
    });

    this.client.on('error', (err: Error) => {
      const code = (err as { code?: string }).code;
      if (code === 'ECONNREFUSED') {
        this.logger.error('❌ Redis connection refused (server unreachable)', {
          code,
          message: err.message,
        });
      } else {
        this.logger.error('❌ Redis client error', {
          code,
          message: err.message,
        });
      }
    });

    this.client.on('end', () => {
      this.logger.info('🛑 Redis connection closed');
    });
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
