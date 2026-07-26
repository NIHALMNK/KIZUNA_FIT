import { Schema, model, Document } from 'mongoose';
import { TrainerAvailabilityStatus } from '../../../../domain/enums/TrainerAvailabilityStatus';
import { TrainerSpecialization } from '../../../../domain/enums/TrainerSpecialization';
import { ShowcaseType, CertificationStatus } from '../../../../domain/enums/TrainerEnums';

export interface ITrainerCertificationSubDoc {
  _id: string;
  title: string;
  organization: string;
  issuedAt: Date;
  expiresAt?: Date | null;
  certificateUrl: string;
  status: CertificationStatus;
  rejectionReason?: string | null;
  verifiedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITrainerShowcaseSubDoc {
  _id: string;
  type: ShowcaseType;
  title: string;
  description: string;
  mediaUrl?: string | null;
  issuedBy?: string | null;
  achievedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITrainerProfileDocument extends Document {
  userId: string;
  headline: string;
  bio: string;
  avatarUrl?: string | null;
  yearsOfExperience: number;
  languages: string[];
  specializations: TrainerSpecialization[];
  certifications: ITrainerCertificationSubDoc[];
  location: {
    city: string;
    state: string;
    country: string;
  };
  availability: {
    status: TrainerAvailabilityStatus;
    timezone: string;
    weeklySchedule: {
      dayOfWeek: number;
      slots: {
        startTime: string;
        endTime: string;
      }[];
    }[];
  };
  totalClients: number;
  totalReviews: number;
  averageRating: number;
  profileCompleted: boolean;
  showcase: ITrainerShowcaseSubDoc[];
  createdAt: Date;
  updatedAt: Date;
}

const CertificationSubSchema = new Schema(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true },
    organization: { type: String, required: true },
    issuedAt: { type: Date, required: true },
    expiresAt: { type: Date, default: null },
    certificateUrl: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(CertificationStatus),
      required: true,
      default: CertificationStatus.PENDING,
    },
    rejectionReason: { type: String, default: null },
    verifiedAt: { type: Date, default: null },
  },
  { timestamps: true, _id: false },
);

const ShowcaseSubSchema = new Schema(
  {
    _id: { type: String, required: true },
    type: { type: String, enum: Object.values(ShowcaseType), required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    mediaUrl: { type: String, default: null },
    issuedBy: { type: String, default: null },
    achievedAt: { type: Date, default: null },
  },
  { timestamps: true, _id: false },
);

const TrainerProfileSchema = new Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, unique: true, index: true },
    headline: { type: String, required: true, trim: true },
    bio: { type: String, required: true, trim: true },
    avatarUrl: { type: String, default: null },
    yearsOfExperience: { type: Number, required: true, min: 0 },
    languages: [{ type: String, index: true }],
    specializations: [{ type: String, enum: Object.values(TrainerSpecialization), index: true }],
    certifications: [CertificationSubSchema],
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true, index: true },
    },
    availability: {
      status: {
        type: String,
        enum: Object.values(TrainerAvailabilityStatus),
        required: true,
        default: TrainerAvailabilityStatus.AVAILABLE,
        index: true,
      },
      timezone: { type: String, required: true, default: 'UTC' },
      weeklySchedule: [
        {
          dayOfWeek: { type: Number, required: true },
          slots: [
            {
              startTime: { type: String, required: true },
              endTime: { type: String, required: true },
            },
          ],
        },
      ],
    },
    totalClients: { type: Number, required: true, default: 0, index: true },
    totalReviews: { type: Number, required: true, default: 0, index: true },
    averageRating: { type: Number, required: true, default: 0.0, index: true },
    profileCompleted: { type: Boolean, required: true, default: false, index: true },
    showcase: [ShowcaseSubSchema],
  },
  {
    timestamps: true,
    _id: false,
  },
);

TrainerProfileSchema.index({ 'availability.status': 1, averageRating: -1 });
TrainerProfileSchema.index({ specializations: 1, 'availability.status': 1 });
TrainerProfileSchema.index({ 'location.country': 1, 'location.state': 1 });

export const TrainerProfileModel = model<ITrainerProfileDocument>(
  'TrainerProfile',
  TrainerProfileSchema,
  'trainerProfiles',
);
