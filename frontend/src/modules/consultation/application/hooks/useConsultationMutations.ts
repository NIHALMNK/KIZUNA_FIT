import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { consultationApi } from '../../infrastructure/api/consultationApi';
import { CONSULTATION_QUERY_KEYS } from './useConsultationQueries';
import {
  CreateConsultationPayload,
  BookConsultationSlotPayload,
  RescheduleConsultationPayload,
  ScheduleConsultationPayload,
  CancelConsultationPayload,
} from '../../domain/types/consultation.types';

function getErrorMessage(err: unknown): string {
  if (
    err &&
    typeof err === 'object' &&
    'message' in err &&
    typeof (err as { message: unknown }).message === 'string'
  ) {
    return (err as { message: string }).message;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'An unexpected error occurred.';
}

export function useCreateConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateConsultationPayload) => consultationApi.createConsultation(payload),
    onSuccess: (data) => {
      toast.success('Consultation session created successfully.');
      queryClient.invalidateQueries({ queryKey: CONSULTATION_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['client-dashboard', 'upcoming-consultations'] });
      if (data.acquisitionPipelineId) {
        queryClient.invalidateQueries({
          queryKey: CONSULTATION_QUERY_KEYS.pipeline(data.acquisitionPipelineId),
        });
      }
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
}

export function useBookSlot() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      consultationId,
      payload,
    }: {
      consultationId: string;
      payload: BookConsultationSlotPayload;
    }) => consultationApi.bookConsultationSlot(consultationId, payload),
    onSuccess: (data, variables) => {
      toast.success('Consultation slot booked successfully.');
      queryClient.invalidateQueries({ queryKey: CONSULTATION_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['client-dashboard', 'upcoming-consultations'] });
      queryClient.invalidateQueries({
        queryKey: CONSULTATION_QUERY_KEYS.detail(variables.consultationId),
      });
      if (data.acquisitionPipelineId) {
        queryClient.invalidateQueries({
          queryKey: CONSULTATION_QUERY_KEYS.pipeline(data.acquisitionPipelineId),
        });
      }
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
}

export function useRescheduleConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      consultationId,
      payload,
    }: {
      consultationId: string;
      payload: RescheduleConsultationPayload;
    }) => consultationApi.rescheduleConsultation(consultationId, payload),
    onSuccess: (_data, variables) => {
      toast.success('Consultation rescheduled successfully.');
      queryClient.invalidateQueries({ queryKey: CONSULTATION_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['client-dashboard', 'upcoming-consultations'] });
      queryClient.invalidateQueries({ queryKey: ['trainer-dashboard', 'upcoming-consultations'] });
      queryClient.invalidateQueries({
        queryKey: CONSULTATION_QUERY_KEYS.detail(variables.consultationId),
      });
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
}

export function useScheduleConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      consultationId,
      payload,
    }: {
      consultationId: string;
      payload: ScheduleConsultationPayload;
    }) => consultationApi.scheduleConsultation(consultationId, payload),
    onSuccess: (data, variables) => {
      toast.success('Consultation scheduled successfully.');
      queryClient.invalidateQueries({ queryKey: CONSULTATION_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['client-dashboard', 'upcoming-consultations'] });
      queryClient.invalidateQueries({
        queryKey: CONSULTATION_QUERY_KEYS.detail(variables.consultationId),
      });
      if (data.roomId) {
        queryClient.invalidateQueries({
          queryKey: CONSULTATION_QUERY_KEYS.room(data.roomId),
        });
      }
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
}

export function useConfirmSchedule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (consultationId: string) => consultationApi.confirmSchedule(consultationId),
    onSuccess: (_data, consultationId) => {
      toast.success('Consultation schedule confirmed.');
      queryClient.invalidateQueries({ queryKey: CONSULTATION_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['client-dashboard', 'upcoming-consultations'] });
      queryClient.invalidateQueries({
        queryKey: CONSULTATION_QUERY_KEYS.detail(consultationId),
      });
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
}

export function useCancelConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      consultationId,
      payload,
    }: {
      consultationId: string;
      payload?: CancelConsultationPayload;
    }) => consultationApi.cancelConsultation(consultationId, payload),
    onSuccess: (_data, variables) => {
      toast.success('Consultation cancelled.');
      queryClient.invalidateQueries({ queryKey: CONSULTATION_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['client-dashboard', 'upcoming-consultations'] });
      queryClient.invalidateQueries({
        queryKey: CONSULTATION_QUERY_KEYS.detail(variables.consultationId),
      });
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
}

export function useCompleteConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (consultationId: string) => consultationApi.completeConsultation(consultationId),
    onSuccess: (_data, consultationId) => {
      toast.success('Consultation marked as completed.');
      queryClient.invalidateQueries({ queryKey: CONSULTATION_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['client-dashboard', 'upcoming-consultations'] });
      queryClient.invalidateQueries({
        queryKey: CONSULTATION_QUERY_KEYS.detail(consultationId),
      });
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
}

export function useMarkNoShow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (consultationId: string) => consultationApi.markNoShow(consultationId),
    onSuccess: (_data, consultationId) => {
      toast.success('Consultation marked as no-show.');
      queryClient.invalidateQueries({ queryKey: CONSULTATION_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['client-dashboard', 'upcoming-consultations'] });
      queryClient.invalidateQueries({
        queryKey: CONSULTATION_QUERY_KEYS.detail(consultationId),
      });
    },
    onError: (err: unknown) => {
      toast.error(getErrorMessage(err));
    },
  });
}
