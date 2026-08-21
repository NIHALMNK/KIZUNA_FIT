import { useQuery } from '@tanstack/react-query';
import { offerApi } from '../../infrastructure/api/offerApi';
import { OfferQueryParams } from '../../domain/types/offer.types';

export const OFFER_QUERY_KEYS = {
  all: ['offers'] as const,
  sent: (params?: OfferQueryParams) => ['offers', 'sent', params] as const,
  received: (params?: OfferQueryParams) => ['offers', 'received', params] as const,
  detail: (offerId: string) => ['offers', 'detail', offerId] as const,
  byConsultation: (consultationId: string) => ['offers', 'consultation', consultationId] as const,
  byPipeline: (pipelineId: string) => ['offers', 'pipeline', pipelineId] as const,
};

export const useSentOffers = (params?: OfferQueryParams) => {
  return useQuery({
    queryKey: OFFER_QUERY_KEYS.sent(params),
    queryFn: () => offerApi.getSentOffers(params),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};

export const useReceivedOffers = (params?: OfferQueryParams) => {
  return useQuery({
    queryKey: OFFER_QUERY_KEYS.received(params),
    queryFn: () => offerApi.getReceivedOffers(params),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};

export const useOfferDetail = (offerId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: OFFER_QUERY_KEYS.detail(offerId),
    queryFn: () => offerApi.getOffer(offerId),
    enabled: Boolean(offerId) && enabled,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};

export const useOfferByConsultation = (consultationId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: OFFER_QUERY_KEYS.byConsultation(consultationId),
    queryFn: () => offerApi.getOfferByConsultation(consultationId),
    enabled: Boolean(consultationId) && enabled,
    staleTime: 1000 * 60 * 2,
    retry: false,
  });
};
