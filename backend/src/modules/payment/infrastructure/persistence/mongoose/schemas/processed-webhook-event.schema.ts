import { Schema, model, Model } from 'mongoose';
import { IProcessedWebhookEventDocument } from '../documents/processed-webhook-event.document';

export const ProcessedWebhookEventSchema = new Schema<IProcessedWebhookEventDocument>(
  {
    _id: { type: String, required: true },
    provider: { type: String, required: true, default: 'RAZORPAY', uppercase: true },
    eventType: { type: String, required: true, trim: true },
    processedAt: { type: Date, required: true, default: Date.now },
  },
  {
    collection: 'processed_webhook_events',
    timestamps: false,
  },
);

export const ProcessedWebhookEventModel: Model<IProcessedWebhookEventDocument> =
  model<IProcessedWebhookEventDocument>('ProcessedWebhookEvent', ProcessedWebhookEventSchema);
