import { Schema, model, Model } from 'mongoose';
import { ICoachingOfferDocument } from '../documents/coaching-offer.document';
import { CoachingOfferStatus } from '../../../../domain/enums/coaching-offer-status.enum';

const PricingSnapshotSchema = new Schema(
  {
    trainerFee: { type: Number, required: true, min: 0 },
    platformFee: { type: Number, required: true, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, uppercase: true, trim: true, default: 'INR' },
    commissionRate: { type: Number, required: true, default: 0, min: 0, max: 1 },
  },
  { _id: false },
);

const ScopeSnapshotSchema = new Schema(
  {
    durationDays: { type: Number, required: true, min: 1, default: 30 },
    planType: { type: String, required: true, trim: true },
    includedFeatures: { type: [String], default: [] },
    trainerNotes: { type: String, default: null, trim: true },
  },
  { _id: false },
);

export const CoachingOfferSchema = new Schema<ICoachingOfferDocument>(
  {
    _id: { type: String, required: true },
    acquisitionPipelineId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    consultationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clientId: { type: String, required: true, index: true },
    trainerId: { type: String, required: true, index: true },
    pricingSnapshot: { type: PricingSnapshotSchema, required: true },
    scopeSnapshot: { type: ScopeSnapshotSchema, required: true },
    status: {
      type: String,
      enum: Object.values(CoachingOfferStatus),
      default: CoachingOfferStatus.DRAFT,
      required: true,
      index: true,
    },
    expiresAt: { type: Date, required: true, index: true },
    acceptedAt: { type: Date, default: null },
    declinedAt: { type: Date, default: null },
    declineReason: { type: String, default: null, trim: true },
  },
  {
    timestamps: true,
    collection: 'coachingOffers',
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id;
        const output = ret as Record<string, unknown>;
        delete output._id;
        delete output.__v;
        return output;
      },
    },
  },
);

// --- Compound Indexes for Query Optimization ---
CoachingOfferSchema.index({ trainerId: 1, status: 1 });
CoachingOfferSchema.index({ clientId: 1, status: 1 });
CoachingOfferSchema.index({ status: 1, expiresAt: 1 });

// --- Pre-Save Validation Hooks ---
CoachingOfferSchema.pre('save', function (next) {
  if (this.clientId === this.trainerId) {
    return next(new Error('Client cannot create an offer for themselves'));
  }
  next();
});

export const CoachingOfferModel: Model<ICoachingOfferDocument> = model<ICoachingOfferDocument>(
  'CoachingOffer',
  CoachingOfferSchema,
);
