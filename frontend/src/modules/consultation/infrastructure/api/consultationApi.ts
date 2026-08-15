import { httpClient } from '../../../../infrastructure/api/HttpClient';
import {
  ConsultationResponseDTO,
  PaginatedConsultationsResponseDTO,
  CreateConsultationPayload,
  BookConsultationSlotPayload,
  RescheduleConsultationPayload,
  ScheduleConsultationPayload,
  CancelConsultationPayload,
  ConsultationQueryParams,
} from '../../domain/types/consultation.types';

export const consultationApi = {
  createConsultation: (payload: CreateConsultationPayload): Promise<ConsultationResponseDTO> => {
    return httpClient.post<ConsultationResponseDTO>('/consultations', payload);
  },

  getUpcomingConsultations: (
    params?: ConsultationQueryParams,
  ): Promise<PaginatedConsultationsResponseDTO> => {
    return httpClient.get<PaginatedConsultationsResponseDTO>('/consultations/upcoming', {
      params,
    });
  },

  getConsultationHistory: (
    params?: ConsultationQueryParams,
  ): Promise<PaginatedConsultationsResponseDTO> => {
    return httpClient.get<PaginatedConsultationsResponseDTO>('/consultations/history', {
      params,
    });
  },

  getConsultation: (consultationId: string): Promise<ConsultationResponseDTO> => {
    return httpClient.get<ConsultationResponseDTO>(`/consultations/${consultationId}`);
  },

  getConsultationByPipeline: (pipelineId: string): Promise<ConsultationResponseDTO> => {
    return httpClient.get<ConsultationResponseDTO>(`/consultations/pipeline/${pipelineId}`);
  },

  getConsultationByRoom: (roomId: string): Promise<ConsultationResponseDTO> => {
    return httpClient.get<ConsultationResponseDTO>(`/consultations/room/${roomId}`);
  },

  bookConsultationSlot: (
    consultationId: string,
    payload: BookConsultationSlotPayload,
  ): Promise<ConsultationResponseDTO> => {
    return httpClient.post<ConsultationResponseDTO>(
      `/consultations/${consultationId}/book`,
      payload,
    );
  },

  rescheduleConsultation: (
    consultationId: string,
    payload: RescheduleConsultationPayload,
  ): Promise<ConsultationResponseDTO> => {
    return httpClient.patch<ConsultationResponseDTO>(`/consultations/${consultationId}`, payload);
  },

  scheduleConsultation: (
    consultationId: string,
    payload: ScheduleConsultationPayload,
  ): Promise<ConsultationResponseDTO> => {
    return httpClient.post<ConsultationResponseDTO>(
      `/consultations/${consultationId}/schedule`,
      payload,
    );
  },

  confirmSchedule: (consultationId: string): Promise<ConsultationResponseDTO> => {
    return httpClient.post<ConsultationResponseDTO>(`/consultations/${consultationId}/confirm`);
  },

  cancelConsultation: (
    consultationId: string,
    payload?: CancelConsultationPayload,
  ): Promise<ConsultationResponseDTO> => {
    return httpClient.post<ConsultationResponseDTO>(
      `/consultations/${consultationId}/cancel`,
      payload || {},
    );
  },

  completeConsultation: (consultationId: string): Promise<ConsultationResponseDTO> => {
    return httpClient.post<ConsultationResponseDTO>(`/consultations/${consultationId}/complete`);
  },

  markNoShow: (consultationId: string): Promise<ConsultationResponseDTO> => {
    return httpClient.post<ConsultationResponseDTO>(`/consultations/${consultationId}/no-show`);
  },
};
