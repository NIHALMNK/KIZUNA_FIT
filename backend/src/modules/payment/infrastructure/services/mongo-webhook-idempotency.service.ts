import { IWebhookIdempotencyPort } from '../../application/ports/webhook-idempotency.port';
import { ProcessedWebhookEventModel } from '../persistence/mongoose/schemas/processed-webhook-event.schema';

function isMongoDuplicateKeyError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  const err = error as { code?: number; codeName?: string };
  return err.code === 11000 || err.codeName === 'DuplicateKey';
}

export class MongoWebhookIdempotencyService implements IWebhookIdempotencyPort {
  public async acquire(eventId: string, eventType: string): Promise<boolean> {
    try {
      await ProcessedWebhookEventModel.create({
        _id: eventId,
        provider: 'RAZORPAY',
        eventType,
        processedAt: new Date(),
      });
      return true;
    } catch (error: unknown) {
      if (isMongoDuplicateKeyError(error)) {
        return false;
      }
      throw error;
    }
  }

  public async release(eventId: string): Promise<void> {
    try {
      await ProcessedWebhookEventModel.findByIdAndDelete(eventId);
    } catch {
      // Best-effort cleanup
    }
  }
}
