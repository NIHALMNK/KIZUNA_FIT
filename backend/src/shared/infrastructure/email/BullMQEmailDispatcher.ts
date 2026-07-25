import { Queue, Worker, Job } from 'bullmq';
import { IEmailDispatcher } from '../../application/ports/IEmailDispatcher';
import { IEmailProvider, SendTemplatePayload } from '../../application/ports/IEmailProvider';
import { env } from '../../../config/env.config';

export class BullMQEmailDispatcher implements IEmailDispatcher {
  private emailQueue: Queue;
  private worker: Worker | null = null;

  constructor(private readonly emailProvider: IEmailProvider) {
    const connection = {
      url: env.REDIS_URL,
    };

    const queueName = `${env.BULLMQ_PREFIX}:email`;
    this.emailQueue = new Queue(queueName, { connection });

    this.worker = new Worker(queueName, async (job: Job) => {
      const payload: SendTemplatePayload = job.data;
      await this.emailProvider.sendTemplate(payload);
    }, { connection });

    this.worker.on('failed', (job, err) => {
      console.error(`[BullMQEmailDispatcher] Job ${job?.id} failed to send email to ${job?.data.to}:`, err);
    });
  }

  public async dispatch(payload: SendTemplatePayload): Promise<void> {
    try {
      await this.emailQueue.add('sendEmail', payload, {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000, // 2s, 4s, 8s
        },
      });
      console.log(`[BullMQEmailDispatcher] Queued email for ${payload.to} via template ${payload.template}`);
    } catch (error) {
      console.error(`[BullMQEmailDispatcher] Failed to enqueue email for ${payload.to}:`, error);
      // We do not rethrow because we must isolate email failures from business transactions.
    }
  }
}
