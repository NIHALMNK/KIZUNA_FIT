import { Schema, model, Model } from 'mongoose';
import { IAcquisitionPipelineDocument } from '../documents/acquisition-pipeline.document';
import { AcquisitionPipelineStatus } from '../../../../domain/enums/acquisition-pipeline-status.enum';
import { TrainerRequestStatus } from '../../../../domain/enums/trainer-request-status.enum';

const TrainerRequestSchema = new Schema(
  {
    requestId: { type: String, required: true },
    clientGoal: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
    clientMessage: { type: String, required: false, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: Object.values(TrainerRequestStatus),
      default: TrainerRequestStatus.PENDING,
      required: true,
    },
    submittedAt: { type: Date, required: true, default: Date.now },
    respondedAt: { type: Date, default: null },
    responseReason: { type: String, default: null, trim: true, maxlength: 500 },
  },
  { _id: false },
);

const TrainerSnapshotSchema = new Schema(
  {
    trainerId: { type: String, required: true },
    fullName: { type: String, required: true, trim: true },
    headline: { type: String, default: '', trim: true },
    profileImage: { type: String, default: '', trim: true },
    specializations: { type: [String], default: [] },
    yearsOfExperience: { type: Number, required: true, min: 0 },
    averageRating: { type: Number, required: true, min: 0, max: 5 },
    totalReviews: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

export const AcquisitionPipelineSchema = new Schema<IAcquisitionPipelineDocument>(
  {
    clientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    trainerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    trainerRequest: { type: TrainerRequestSchema, required: true },
    trainerSnapshot: { type: TrainerSnapshotSchema, required: true },
    status: {
      type: String,
      enum: Object.values(AcquisitionPipelineStatus),
      default: AcquisitionPipelineStatus.REQUESTED,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'acquisitionPipelines',
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        const output = ret as Record<string, unknown>;
        delete output._id;
        delete output.__v;
        return output;
      },
    },
  },
);

// --- Compound Indexes for High Query Efficiency ---
AcquisitionPipelineSchema.index({ clientId: 1, status: 1 });
AcquisitionPipelineSchema.index({ trainerId: 1, status: 1 });
AcquisitionPipelineSchema.index({ clientId: 1, trainerId: 1 });
AcquisitionPipelineSchema.index({ status: 1, createdAt: -1 });

// --- Invariant & Immutability Pre-Save Hooks ---
AcquisitionPipelineSchema.pre('save', function (next) {
  if (this.clientId.equals(this.trainerId)) {
    return next(new Error('Client cannot create a trainer request to themselves'));
  }

  if (!this.isNew && this.isModified('trainerSnapshot')) {
    return next(new Error('TrainerSnapshot is immutable and cannot be updated after creation'));
  }

  next();
});

// --- Virtual Properties ---
AcquisitionPipelineSchema.virtual('isOpen').get(function (this: IAcquisitionPipelineDocument) {
  const terminalStates = [
    AcquisitionPipelineStatus.REJECTED,
    AcquisitionPipelineStatus.WITHDRAWN,
    AcquisitionPipelineStatus.CANCELLED,
    AcquisitionPipelineStatus.OFFER_DECLINED,
    AcquisitionPipelineStatus.CONVERTED,
    AcquisitionPipelineStatus.CLOSED,
  ];
  return !terminalStates.includes(this.status);
});

AcquisitionPipelineSchema.virtual('isConverted').get(function (this: IAcquisitionPipelineDocument) {
  return this.status === AcquisitionPipelineStatus.CONVERTED;
});

export const AcquisitionPipelineModel: Model<IAcquisitionPipelineDocument> =
  model<IAcquisitionPipelineDocument>('AcquisitionPipeline', AcquisitionPipelineSchema);
