import { z } from 'zod';
import { Gender } from '../../../domain/enums/Gender';
import { WeightUnit, HeightUnit } from '../../../domain/enums/Units';
import { DietaryPreference } from '../../../domain/enums/DietaryPreference';
import { FitnessGoal } from '../../../domain/enums/FitnessGoal';
import { ExperienceLevel, ActivityLevel } from '../../../domain/enums/ClientLevels';
import {
  optionalDateFromHtmlInput,
  optionalString,
} from '../../../../../shared/infrastructure/http/validation/dateValidators';

export const CreateClientProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(1, 'Full name is required').max(100),
  }),
});

export const UpdateClientProfileSchema = z.object({
  body: z.object({
    fullName: optionalString(),
    gender: z.nativeEnum(Gender).optional(),
    dateOfBirth: optionalDateFromHtmlInput('Date of birth'),
    phoneNumber: optionalString(),
    country: optionalString(),
    state: optionalString(),
    city: optionalString(),
    timezone: optionalString(),
    weight: z
      .object({
        value: z.number().positive(),
        unit: z.nativeEnum(WeightUnit),
      })
      .optional(),
    height: z
      .object({
        value: z.number().positive(),
        unit: z.nativeEnum(HeightUnit),
      })
      .optional(),
    medicalNotes: optionalString(),
    dietaryPreferences: z.array(z.nativeEnum(DietaryPreference)).optional(),
    fitnessGoals: z.array(z.nativeEnum(FitnessGoal)).optional(),
    experienceLevel: z.nativeEnum(ExperienceLevel).optional(),
    activityLevel: z.nativeEnum(ActivityLevel).optional(),
  }),
});
