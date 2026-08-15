import { useQuery } from '@tanstack/react-query';
import { consultationApi } from '../../infrastructure/api/consultationApi';
import { ConsultationQueryParams } from '../../domain/types/consultation.types';

export const CONSULTATION_QUERY_KEYS = {
  all: ['consultations'] as const,
  upcoming: (params?: ConsultationQueryParams) => ['consultations', 'upcoming', params] as const,
  history: (params?: ConsultationQueryParams) => ['consultations', 'history', params] as const,
  detail: (id: string) => ['consultations', 'detail', id] as const,
  pipeline: (pipelineId: string) => ['consultations', 'pipeline', pipelineId] as const,
  room: (roomId: string) => ['consultations', 'room', roomId] as const,
};

export function useUpcomingConsultations(params?: ConsultationQueryParams) {
  return useQuery({
    queryKey: CONSULTATION_QUERY_KEYS.upcoming(params),
    queryFn: () => consultationApi.getUpcomingConsultations(params),
  });
}

export function useConsultationHistory(params?: ConsultationQueryParams) {
  return useQuery({
    queryKey: CONSULTATION_QUERY_KEYS.history(params),
    queryFn: () => consultationApi.getConsultationHistory(params),
  });
}

export function useConsultationDetail(consultationId?: string) {
  return useQuery({
    queryKey: CONSULTATION_QUERY_KEYS.detail(consultationId || ''),
    queryFn: () => consultationApi.getConsultation(consultationId!),
    enabled: !!consultationId,
  });
}

export function useConsultationByPipeline(pipelineId?: string) {
  return useQuery({
    queryKey: CONSULTATION_QUERY_KEYS.pipeline(pipelineId || ''),
    queryFn: () => consultationApi.getConsultationByPipeline(pipelineId!),
    enabled: !!pipelineId,
  });
}

export function useConsultationByRoom(roomId?: string) {
  return useQuery({
    queryKey: CONSULTATION_QUERY_KEYS.room(roomId || ''),
    queryFn: () => consultationApi.getConsultationByRoom(roomId!),
    enabled: !!roomId,
  });
}
