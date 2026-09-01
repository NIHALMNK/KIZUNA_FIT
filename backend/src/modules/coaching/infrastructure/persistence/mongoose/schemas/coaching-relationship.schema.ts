import mongoose, { Schema, Document, Model } from 'mongoose';
import { CoachingRelationshipStatus } from '../../../../domain/enums/coaching-relationship-status.enum';

export interface ICoachingTimelineDocument {
  activatedAt?: Date | null;
  completedAt?: Date | null;
  cancelledAt?: Date | null;
  refundedAt?: Date | null;
  disputedAt?: Date | null;
  expiredAt?: Date | null;
}

export interface ICoachingRelationshipDocument extends Document<string> {
  _id: string;
  acquisitionPipelineId: string;
  paymentId: string;
  subscriptionId: string;
  clientId: string;
  trainerId: string;
  status: CoachingRelationshipStatus;
  timeline: ICoachingTimelineDocument;
  cancellationReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const CoachingTimelineSchema = new Schema<ICoachingTimelineDocument>(
  {
    activatedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    cancelledAt: { type: Date, default: null },
    refundedAt: { type: Date, default: null },
    disputedAt: { type: Date, default: null },
    expiredAt: { type: Date, default: null },
  },
  { _id: false },
);

export const CoachingRelationshipSchema = new Schema<ICoachingRelationshipDocument>(
  {
    _id: { type: String, required: true },
    acquisitionPipelineId: { type: String, required: true, unique: true, index: true },
    paymentId: { type: String, required: true, unique: true, index: true },
    subscriptionId: { type: String, required: true },
    clientId: { type: String, required: true, index: true },
    trainerId: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: Object.values(CoachingRelationshipStatus),
      required: true,
      index: true,
    },
    timeline: { type: CoachingTimelineSchema, default: () => ({}) },
    cancellationReason: { type: String, default: null },
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: 'coachingRelationships',
    timestamps: true,
    optimisticConcurrency: false, // We handle OCC explicitly with __v in repository save()
    versionKey: '__v',
  },
);

// Unique Partial Index: One ACTIVE Coaching Relationship per Client (Rule 2)
CoachingRelationshipSchema.index(
  { clientId: 1, status: 1 },
  {
    unique: true,
    partialFilterExpression: { status: CoachingRelationshipStatus.ACTIVE },
    name: 'unique_active_relationship_per_client',
  },
);

// Compound Indexes for fast queries
CoachingRelationshipSchema.index({ trainerId: 1, status: 1 });
CoachingRelationshipSchema.index({ clientId: 1, createdAt: -1 });
CoachingRelationshipSchema.index({ trainerId: 1, createdAt: -1 });
CoachingRelationshipSchema.index({ status: 1, createdAt: -1 });
CoachingRelationshipSchema.index({ trainerId: 1, clientId: 1 });

export const CoachingRelationshipModel: Model<ICoachingRelationshipDocument> =
  mongoose.models.CoachingRelationship ||
  mongoose.model<ICoachingRelationshipDocument>('CoachingRelationship', CoachingRelationshipSchema);
