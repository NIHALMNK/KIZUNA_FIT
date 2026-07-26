import { Gender } from '../../../domain/enums/Gender';
import { WeightUnit, HeightUnit } from '../../../domain/enums/Units';
import { DietaryPreference } from '../../../domain/enums/DietaryPreference';
import { FitnessGoal } from '../../../domain/enums/FitnessGoal';
import { ExperienceLevel, ActivityLevel } from '../../../domain/enums/ClientLevels';

export interface CreateClientProfileDTO {
  userId: string;
  fullName: string;
}

export interface UpdateClientProfileDTO {
  userId: string;
  fullName?: string;
  gender?: Gender;
  dateOfBirth?: string; // ISO date string
  phoneNumber?: string;
  country?: string;
  state?: string;
  city?: string;
  timezone?: string;
  weight?: {
    value: number;
    unit: WeightUnit;
  };
  height?: {
    value: number;
    unit: HeightUnit;
  };
  medicalNotes?: string;
  dietaryPreferences?: DietaryPreference[];
  fitnessGoals?: FitnessGoal[];
  experienceLevel?: ExperienceLevel;
  activityLevel?: ActivityLevel;
}

export interface ClientProfileResponseDTO {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl?: string | null;
  gender?: Gender | null;
  dateOfBirth?: string | null;
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
  createdAt: string;
  updatedAt: string;
}
