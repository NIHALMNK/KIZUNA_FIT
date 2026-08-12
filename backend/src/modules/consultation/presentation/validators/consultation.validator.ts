import { z } from 'zod';
import { ConsultationPlatform } from '../../domain/enums/consultation-platform.enum';
import { ConsultationStatus } from '../../domain/enums/consultation-status.enum';

export const CreateConsultationSchema = z.object({
  body: z.object({
    acquisitionPipelineId: z.string().min(1, 'acquisitionPipelineId is required'),
    scheduledStartAt: z
      .string()
      .datetime({ message: 'scheduledStartAt must be a valid ISO 8601 date string' }),
    scheduledEndAt: z
      .string()
      .datetime({ message: 'scheduledEndAt must be a valid ISO 8601 date string' }),
    timezone: z.string().min(1, 'timezone is required'),
    platform: z.nativeEnum(ConsultationPlatform).optional(),
  }),
});

export const BookConsultationSlotSchema = z.object({
  params: z.object({
    consultationId: z.string().min(1, 'consultationId is required'),
  }),
  body: z.object({
    scheduledStartAt: z
      .string()
      .datetime({ message: 'scheduledStartAt must be a valid ISO 8601 date string' }),
    scheduledEndAt: z
      .string()
      .datetime({ message: 'scheduledEndAt must be a valid ISO 8601 date string' }),
    timezone: z.string().min(1, 'timezone is required'),
  }),
});

export const ScheduleConsultationSchema = z.object({
  params: z.object({
    consultationId: z.string().min(1, 'consultationId is required'),
  }),
  body: z.object({
    scheduledStartAt: z
      .string()
      .datetime({ message: 'scheduledStartAt must be a valid ISO 8601 date string' }),
    scheduledEndAt: z
      .string()
      .datetime({ message: 'scheduledEndAt must be a valid ISO 8601 date string' }),
    timezone: z.string().min(1, 'timezone is required'),
    platform: z.nativeEnum(ConsultationPlatform).optional(),
    meetingDetails: z
      .object({
        platform: z.nativeEnum(ConsultationPlatform),
        roomId: z.string().min(1, 'roomId is required'),
        meetingUrl: z.string().url().optional().nullable(),
        joinCode: z.string().optional().nullable(),
        instructions: z.string().optional().nullable(),
      })
      .optional(),
  }),
});

export const CancelConsultationSchema = z.object({
  params: z.object({
    consultationId: z.string().min(1, 'consultationId is required'),
  }),
  body: z.object({
    reason: z.string().max(1000, 'Reason cannot exceed 1000 characters').optional(),
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

export const RoomIdParamSchema = z.object({
  params: z.object({
    roomId: z.string().min(1, 'roomId is required'),
  }),
});

export const GetConsultationsQuerySchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    status: z.nativeEnum(ConsultationStatus).optional(),
    sort: z.enum(['newest', 'oldest']).optional(),
  }),
});
