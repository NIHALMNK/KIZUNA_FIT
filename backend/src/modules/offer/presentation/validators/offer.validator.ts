import { z } from 'zod';
import { CoachingOfferStatus } from '../../domain/enums/coaching-offer-status.enum';
import { CoachingPlanType } from '../../domain/enums/coaching-plan-type.enum';

export const CreateOfferSchema = z.object({
  body: z.object({
    consultationId: z.string().min(1, 'consultationId is required'),
    planType: z.nativeEnum(CoachingPlanType, {
      errorMap: () => ({ message: 'planType must be one of: BASIC, PRO, PREMIUM' }),
    }),
    trainerFee: z.number().positive('trainerFee must be a positive amount'),
    currency: z.string().min(1, 'currency must be a valid code').optional().default('INR'),
    trainerNotes: z.string().max(2000, 'trainerNotes cannot exceed 2000 characters').optional(),
    sendImmediately: z.boolean().optional().default(false),
  }),
});

export const DeclineOfferSchema = z.object({
  params: z.object({
    offerId: z.string().min(1, 'offerId is required'),
  }),
  body: z
    .object({
      reason: z.string().max(1000, 'Reason cannot exceed 1000 characters').optional(),
    })
    .optional(),
});

export const OfferIdParamSchema = z.object({
  params: z.object({
    offerId: z.string().min(1, 'offerId is required'),
  }),
});

export const ConsultationIdParamSchema = z.object({
  params: z.object({
    consultationId: z.string().min(1, 'consultationId is required'),
  }),
});

export const PipelineIdParamSchema = z.object({
  params: z.object({
    pipelineId: z.string().min(1, 'pipelineId is required'),
  }),
});

export const GetOffersQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    status: z.nativeEnum(CoachingOfferStatus).optional(),
    sort: z.enum(['newest', 'oldest', 'expiring']).optional(),
  }),
});
