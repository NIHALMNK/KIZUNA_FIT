import { Document } from 'mongoose';

export interface IProcessedWebhookEventDocument extends Document<string> {
  _id: string; // event ID or hash
  provider: string; // 'RAZORPAY'
  eventType: string; // e.g. 'payment.captured', 'payment.failed'
  processedAt: Date;
}
