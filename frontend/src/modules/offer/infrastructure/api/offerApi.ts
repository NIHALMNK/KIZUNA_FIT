import { httpClient } from '../../../../infrastructure/api/HttpClient';
import {
  CoachingOfferResponseDTO,
  PaginatedOffersResponseDTO,
  CreateOfferPayload,
  DeclineOfferPayload,
  OfferQueryParams,
} from '../../domain/types/offer.types';

export const offerApi = {
  createOffer: (payload: CreateOfferPayload): Promise<CoachingOfferResponseDTO> => {
    return httpClient.post<CoachingOfferResponseDTO>('/offers', payload);
  },

  sendOffer: (offerId: string): Promise<CoachingOfferResponseDTO> => {
    return httpClient.post<CoachingOfferResponseDTO>(`/offers/${offerId}/send`, {});
  },

  acceptOffer: (offerId: string): Promise<CoachingOfferResponseDTO> => {
    return httpClient.post<CoachingOfferResponseDTO>(`/offers/${offerId}/accept`, {});
  },

  declineOffer: (
    offerId: string,
    payload?: DeclineOfferPayload,
  ): Promise<CoachingOfferResponseDTO> => {
    return httpClient.post<CoachingOfferResponseDTO>(`/offers/${offerId}/decline`, payload || {});
  },

  getOffer: (offerId: string): Promise<CoachingOfferResponseDTO> => {
    return httpClient.get<CoachingOfferResponseDTO>(`/offers/${offerId}`);
  },

  getOfferByConsultation: (consultationId: string): Promise<CoachingOfferResponseDTO> => {
    return httpClient.get<CoachingOfferResponseDTO>(`/offers/consultation/${consultationId}`);
  },

  getOfferByPipeline: (pipelineId: string): Promise<CoachingOfferResponseDTO> => {
    return httpClient.get<CoachingOfferResponseDTO>(`/offers/pipeline/${pipelineId}`);
  },

  getSentOffers: (params?: OfferQueryParams): Promise<PaginatedOffersResponseDTO> => {
    return httpClient.get<PaginatedOffersResponseDTO>('/offers/sent', {
      params,
    });
  },

  getReceivedOffers: (params?: OfferQueryParams): Promise<PaginatedOffersResponseDTO> => {
    return httpClient.get<PaginatedOffersResponseDTO>('/offers/received', {
      params,
    });
  },

  getAllOffers: (params?: OfferQueryParams): Promise<PaginatedOffersResponseDTO> => {
    return httpClient.get<PaginatedOffersResponseDTO>('/offers', {
      params,
    });
  },
};
