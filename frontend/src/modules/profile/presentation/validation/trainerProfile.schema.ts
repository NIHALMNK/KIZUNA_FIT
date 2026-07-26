import { z } from 'zod';
import {
  TrainerAvailabilityStatus,
  TrainerSpecialization,
  ShowcaseType,
} from '../../domain/enums/profile.enums';

export const createTrainerProfileSchema = z.object({
  headline: z.string().min(1, 'Headline is required').max(150),
  bio: z.string().min(1, 'Bio is required').max(2000),
  yearsOfExperience: z.coerce.number().min(0, 'Years of experience cannot be negative'),
  languages: z.array(z.string()).min(1, 'At least one language is required'),
  specializations: z.array(z.nativeEnum(TrainerSpecialization)).min(1, 'At least one specialization is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  timezone: z.string().optional(),
});

export const updateTrainerProfileSchema = z.object({
  headline: z.string().min(1).max(150).optional(),
  bio: z.string().min(1).max(2000).optional(),
  yearsOfExperience: z.coerce.number().min(0).optional(),
  languages: z.array(z.string()).optional(),
  specializations: z.array(z.nativeEnum(TrainerSpecialization)).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
});

export const updateAvailabilitySchema = z.object({
  status: z.nativeEnum(TrainerAvailabilityStatus),
  timezone: z.string().optional(),
  weeklySchedule: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      slots: z.array(
        z.object({
          startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format must be HH:MM'),
          endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Format must be HH:MM'),
        }),
      ),
    }),
  ),
});

export const certificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  organization: z.string().min(1, 'Organization is required'),
  issuedAt: z.string().min(1, 'Issued date is required'),
  expiresAt: z.string().optional(),
  certificateUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export const showcaseSchema = z.object({
  type: z.nativeEnum(ShowcaseType),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  issuedBy: z.string().optional(),
  achievedAt: z.string().optional(),
  mediaUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export type CreateTrainerProfileFormValues = z.infer<typeof createTrainerProfileSchema>;
export type UpdateTrainerProfileFormValues = z.infer<typeof updateTrainerProfileSchema>;
export type UpdateAvailabilityFormValues = z.infer<typeof updateAvailabilitySchema>;
export type CertificationFormValues = z.infer<typeof certificationSchema>;
export type ShowcaseFormValues = z.infer<typeof showcaseSchema>;
