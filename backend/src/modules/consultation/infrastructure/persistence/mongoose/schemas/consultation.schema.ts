import { Schema, model, Model } from 'mongoose';
import { IConsultationDocument } from '../documents/consultation.document';
import { ConsultationStatus } from '../../../../domain/enums/consultation-status.enum';
import { ConsultationPlatform } from '../../../../domain/enums/consultation-platform.enum';
import { CancellationActor } from '../../../../domain/enums/cancellation-actor.enum';

const ConsultationSlotSchema = new Schema(
  {
    scheduledStartAt: { type: Date, required: true },
    scheduledEndAt: { type: Date, required: true },
    timezone: { type: String, required: true, trim: true },
    bookedAt: { type: Date, required: true, default: Date.now },
  },
  { _id: false },
);

const MeetingDetailsSchema = new Schema(
  {
    platform: {
      type: String,
      enum: Object.values(ConsultationPlatform),
      required: true,
    },
    roomId: { type: String, required: true, trim: true },
    meetingUrl: { type: String, default: null, trim: true },
    joinCode: { type: String, default: null, trim: true },
    instructions: { type: String, default: null, trim: true },
  },
  { _id: false },
);

const ConsultationCancellationSchema = new Schema(
  {
    cancelledAt: { type: Date, required: true, default: Date.now },
    cancelledBy: {
      type: String,
      enum: Object.values(CancellationActor),
      required: true,
    },
    reason: { type: String, default: null, trim: true, maxlength: 1000 },
  },
  { _id: false },
);

export const ConsultationSchema = new Schema<IConsultationDocument>(
  {
    _id: { type: String, required: true },
    acquisitionPipelineId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    clientId: { type: String, required: true, index: true },
    trainerId: { type: String, required: true, index: true },
    slot: { type: ConsultationSlotSchema, required: true },
    platform: {
      type: String,
      enum: Object.values(ConsultationPlatform),
      default: ConsultationPlatform.WEBRTC,
      required: true,
    },
    roomId: { type: String, required: true, index: true },
    meetingUrl: { type: String, default: null, trim: true },
    meetingDetails: { type: MeetingDetailsSchema, default: null },
    status: {
      type: String,
      enum: Object.values(ConsultationStatus),
      default: ConsultationStatus.CREATED,
      required: true,
      index: true,
    },
    completedAt: { type: Date, default: null },
    cancellation: { type: ConsultationCancellationSchema, default: null },
  },
  {
    timestamps: true,
    collection: 'consultations',
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
ConsultationSchema.index({ clientId: 1, status: 1 });
ConsultationSchema.index({ trainerId: 1, status: 1 });
ConsultationSchema.index({ clientId: 1, 'slot.scheduledStartAt': 1 });
ConsultationSchema.index({ trainerId: 1, 'slot.scheduledStartAt': 1 });
ConsultationSchema.index({ roomId: 1 });

// --- Pre-Save Validation Hooks ---
ConsultationSchema.pre('save', function (next) {
  if (this.clientId === this.trainerId) {
    return next(new Error('Client cannot have a consultation with themselves'));
  }
  next();
});

export const ConsultationModel: Model<IConsultationDocument> = model<IConsultationDocument>(
  'Consultation',
  ConsultationSchema,
);
