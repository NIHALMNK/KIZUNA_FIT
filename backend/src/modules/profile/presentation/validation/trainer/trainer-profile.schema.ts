import { z } from 'zod';
import { TrainerAvailabilityStatus } from '../../../domain/enums/TrainerAvailabilityStatus';
import { TrainerSpecialization } from '../../../domain/enums/TrainerSpecialization';
import { ShowcaseType } from '../../../domain/enums/TrainerEnums';
import {
  dateFromHtmlInput,
  optionalDateFromHtmlInput,
  optionalUrlFromHtmlInput,
  optionalString,
} from '../../../../../shared/infrastructure/http/validation/dateValidators';

export const CreateTrainerProfileSchema = z.object({
  body: z.object({
    headline: z.string().min(1, 'Headline is required').max(150),
    bio: z.string().min(1, 'Bio is required').max(2000),
    yearsOfExperience: z.number().min(0, 'Years of experience cannot be negative'),
    languages: z.array(z.string()).min(1, 'At least one language is required'),
    specializations: z
      .array(z.nativeEnum(TrainerSpecialization))
      .min(1, 'At least one specialization is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    country: z.string().min(1, 'Country is required'),
    timezone: optionalString(),
  }),
});

export const UpdateTrainerProfileSchema = z.object({
  body: z.object({
    headline: optionalString(),
    bio: optionalString(),
    yearsOfExperience: z.number().min(0).optional(),
    languages: z.array(z.string()).optional(),
    specializations: z.array(z.nativeEnum(TrainerSpecialization)).optional(),
    city: optionalString(),
    state: optionalString(),
    country: optionalString(),
  }),
});

export const UpdateAvailabilitySchema = z.object({
  body: z.object({
    status: z.nativeEnum(TrainerAvailabilityStatus),
    timezone: optionalString(),
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
  }),
});

export const AddCertificationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    organization: z.string().min(1, 'Organization is required'),
    issuedAt: dateFromHtmlInput('Issued date'),
    expiresAt: optionalDateFromHtmlInput('Expiration date'),
    certificateUrl: optionalUrlFromHtmlInput(),
  }),
});

export const UpdateCertificationSchema = z.object({
  params: z
    .object({
      certificationId: z.string().min(1, 'Certification ID is required'),
    })
    .optional(),
  body: z.object({
    title: optionalString(),
    organization: optionalString(),
    issuedAt: optionalDateFromHtmlInput('Issued date'),
    expiresAt: optionalDateFromHtmlInput('Expiration date'),
    certificateUrl: optionalUrlFromHtmlInput(),
  }),
});

export const AddShowcaseItemSchema = z.object({
  body: z.object({
    type: z.nativeEnum(ShowcaseType),
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    issuedBy: optionalString(),
    achievedAt: optionalDateFromHtmlInput('Achievement date'),
    mediaUrl: optionalUrlFromHtmlInput(),
  }),
});

export const UpdateShowcaseItemSchema = z.object({
  params: z
    .object({
      itemId: z.string().min(1, 'Item ID is required'),
    })
    .optional(),
  body: z.object({
    type: z.nativeEnum(ShowcaseType).optional(),
    title: optionalString(),
    description: optionalString(),
    issuedBy: optionalString(),
    achievedAt: optionalDateFromHtmlInput('Achievement date'),
    mediaUrl: optionalUrlFromHtmlInput(),
  }),
});

export const SearchTrainerQuerySchema = z.object({
  query: z.object({
    search: optionalString(),
    specialization: z.nativeEnum(TrainerSpecialization).optional(),
    experienceLevel: optionalString(),
    minRating: z.coerce.number().min(0).max(5).optional(),
    availability: z.nativeEnum(TrainerAvailabilityStatus).optional(),
    verifiedOnly: z
      .preprocess((val) => {
        if (val === 'true' || val === true) return true;
        if (val === 'false' || val === false) return false;
        return undefined;
      }, z.boolean().optional()),
    sortBy: z.enum(['rating', 'experience', 'newest']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
  }),
});
