import { z } from 'zod';
import { AcquisitionPipelineStatus } from '../../domain/enums/acquisition-pipeline-status.enum';

export const CreateTrainerRequestSchema = z.object({
  body: z.object({
    trainerId: z
      .string({ required_error: 'trainerId is required' })
      .min(1, 'trainerId cannot be empty'),
    goal: z
      .string({ required_error: 'goal is required' })
      .min(3, 'goal must be at least 3 characters long')
      .max(100, 'goal cannot exceed 100 characters'),
    message: z.string().max(1000, 'message cannot exceed 1000 characters').optional(),
  }),
});

export const RejectTrainerRequestSchema = z.object({
  params: z
    .object({
      requestId: z.string().optional(),
    })
    .passthrough()
    .optional(),
  body: z
    .object({
      reason: z.string().max(500, 'reason cannot exceed 500 characters').optional(),
    })
    .optional(),
});

export const GetTrainerRequestsQuerySchema = z.object({
  query: z.object({
    status: z.nativeEnum(AcquisitionPipelineStatus).optional(),
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10)),
    sort: z.enum(['newest', 'oldest']).optional(),
  }),
});
