import { Queue, Worker, Job } from 'bullmq';
import { env } from '../../config/env.config';
import { ILogger } from '../../shared/contracts/ILogger';

export class BackgroundJobManager {
  private queues: Map<string, Queue> = new Map();
  private workers: Worker[] = [];

  constructor(private logger: ILogger) {}

  public getQueue(queueName: string): Queue {
    if (!this.queues.has(queueName)) {
      const queue = new Queue(queueName, {
        connection: {
          url: env.REDIS_URL
        }
      });
      this.queues.set(queueName, queue);
      this.logger.debug(`Initialized Queue: ${queueName}`);
    }
    return this.queues.get(queueName)!;
  }

  public registerWorker(queueName: string, processor: (job: Job) => Promise<unknown>): Worker {
    const worker = new Worker(queueName, processor, {
      connection: {
        url: env.REDIS_URL
      }
    });

    worker.on('completed', (job: Job) => {
      this.logger.debug(`Job ${job.id} completed in queue ${queueName}`);
    });

    worker.on('failed', (job: Job | undefined, err: Error) => {
      this.logger.error(`Job ${job?.id} failed in queue ${queueName}`, { err });
    });

    this.workers.push(worker);
    return worker;
  }

  public async shutdown(): Promise<void> {
    this.logger.info('🛑 Shutting down BullMQ workers and queues...');
    for (const worker of this.workers) {
      await worker.close();
    }
    for (const queue of this.queues.values()) {
      await queue.close();
    }
    this.logger.info('✅ BullMQ shutdown complete');
  }

  public getStatus(): string {
    return this.workers.length > 0 || this.queues.size > 0 ? 'connected' : 'initialized';
  }
}
