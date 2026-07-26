import { z } from 'zod';
import {
  Gender,
  WeightUnit,
  HeightUnit,
  DietaryPreference,
  FitnessGoal,
  ExperienceLevel,
  ActivityLevel,
} from '../../domain/enums/profile.enums';

export const createClientProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100),
});

export const updateClientProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name cannot be empty').max(100).optional(),
  gender: z.nativeEnum(Gender).optional(),
  dateOfBirth: z.string().optional(),
  phoneNumber: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  timezone: z.string().optional(),
  weight: z
    .object({
      value: z.coerce.number().positive('Weight must be positive'),
      unit: z.nativeEnum(WeightUnit),
    })
    .optional(),
  height: z
    .object({
      value: z.coerce.number().positive('Height must be positive'),
      unit: z.nativeEnum(HeightUnit),
    })
    .optional(),
  medicalNotes: z.string().max(1000).optional(),
  dietaryPreferences: z.array(z.nativeEnum(DietaryPreference)).optional(),
  fitnessGoals: z.array(z.nativeEnum(FitnessGoal)).optional(),
  experienceLevel: z.nativeEnum(ExperienceLevel).optional(),
  activityLevel: z.nativeEnum(ActivityLevel).optional(),
});

export type CreateClientProfileFormValues = z.infer<typeof createClientProfileSchema>;
export type UpdateClientProfileFormValues = z.infer<typeof updateClientProfileSchema>;
