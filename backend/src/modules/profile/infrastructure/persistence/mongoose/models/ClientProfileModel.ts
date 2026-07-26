import { Schema, model, Document } from 'mongoose';
import { Gender } from '../../../../domain/enums/Gender';
import { WeightUnit, HeightUnit } from '../../../../domain/enums/Units';
import { DietaryPreference } from '../../../../domain/enums/DietaryPreference';
import { FitnessGoal } from '../../../../domain/enums/FitnessGoal';
import { ExperienceLevel, ActivityLevel } from '../../../../domain/enums/ClientLevels';

export interface IClientProfileDocument extends Document {
  userId: string;
  fullName: string;
  avatarUrl?: string | null;
  gender?: Gender | null;
  dateOfBirth?: Date | null;
  phoneNumber?: string | null;
  country?: string | null;
  state?: string | null;
  city?: string | null;
  timezone?: string | null;
  weight?: {
    value: number;
    unit: WeightUnit;
  } | null;
  height?: {
    value: number;
    unit: HeightUnit;
  } | null;
  medicalNotes?: string | null;
  dietaryPreferences: DietaryPreference[];
  fitnessGoals: FitnessGoal[];
  experienceLevel?: ExperienceLevel | null;
  activityLevel?: ActivityLevel | null;
  profileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClientProfileSchema = new Schema(
  {
    _id: { type: String, required: true },
    userId: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true, trim: true },
    avatarUrl: { type: String, default: null },
    gender: { type: String, enum: Object.values(Gender), default: null },
    dateOfBirth: { type: Date, default: null },
    phoneNumber: { type: String, default: null },
    country: { type: String, default: null, index: true },
    state: { type: String, default: null, index: true },
    city: { type: String, default: null, index: true },
    timezone: { type: String, default: null },
    weight: {
      value: { type: Number },
      unit: { type: String, enum: Object.values(WeightUnit) },
    },
    height: {
      value: { type: Number },
      unit: { type: String, enum: Object.values(HeightUnit) },
    },
    medicalNotes: { type: String, default: null },
    dietaryPreferences: [{ type: String, enum: Object.values(DietaryPreference) }],
    fitnessGoals: [{ type: String, enum: Object.values(FitnessGoal), index: true }],
    experienceLevel: { type: String, enum: Object.values(ExperienceLevel), default: null },
    activityLevel: { type: String, enum: Object.values(ActivityLevel), default: null },
    profileCompleted: { type: Boolean, required: true, default: false, index: true },
  },
  {
    timestamps: true,
    _id: false,
  },
);

ClientProfileSchema.index({ country: 1, state: 1 });
ClientProfileSchema.index({ experienceLevel: 1, activityLevel: 1 });

export const ClientProfileModel = model<IClientProfileDocument>(
  'ClientProfile',
  ClientProfileSchema,
  'clientProfiles',
);
