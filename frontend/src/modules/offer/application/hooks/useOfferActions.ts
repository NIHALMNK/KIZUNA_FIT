import { useMutation, useQueryClient } from '@tanstack/react-query';
import { offerApi } from '../../infrastructure/api/offerApi';
import { CreateOfferPayload, DeclineOfferPayload } from '../../domain/types/offer.types';
import { OFFER_QUERY_KEYS } from './useOffers';

export const useOfferActions = () => {
  const queryClient = useQueryClient();

  const invalidateOfferQueries = () => {
    queryClient.invalidateQueries({ queryKey: OFFER_QUERY_KEYS.all });
    queryClient.invalidateQueries({ queryKey: ['client-dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['consultations'] });
    queryClient.invalidateQueries({ queryKey: ['trainer-requests'] });
    queryClient.invalidateQueries({ queryKey: ['trainer-requests-pending'] });
    queryClient.invalidateQueries({ queryKey: ['trainer-requests-history'] });
  };

  const createOfferMutation = useMutation({
    mutationFn: (payload: CreateOfferPayload) => offerApi.createOffer(payload),
    onSuccess: () => {
      invalidateOfferQueries();
    },
  });

  const sendOfferMutation = useMutation({
    mutationFn: (offerId: string) => offerApi.sendOffer(offerId),
    onSuccess: () => {
      invalidateOfferQueries();
    },
  });

  const acceptOfferMutation = useMutation({
    mutationFn: (offerId: string) => offerApi.acceptOffer(offerId),
    onSuccess: () => {
      invalidateOfferQueries();
    },
  });

  const declineOfferMutation = useMutation({
    mutationFn: ({ offerId, payload }: { offerId: string; payload?: DeclineOfferPayload }) =>
      offerApi.declineOffer(offerId, payload),
    onSuccess: () => {
      invalidateOfferQueries();
    },
  });

  return {
    createOffer: createOfferMutation.mutateAsync,
    isCreating: createOfferMutation.isPending,
    createError: createOfferMutation.error,

    sendOffer: sendOfferMutation.mutateAsync,
    isSending: sendOfferMutation.isPending,
    sendError: sendOfferMutation.error,

    acceptOffer: acceptOfferMutation.mutateAsync,
    isAccepting: acceptOfferMutation.isPending,
    acceptError: acceptOfferMutation.error,

    declineOffer: declineOfferMutation.mutateAsync,
    isDeclining: declineOfferMutation.isPending,
    declineError: declineOfferMutation.error,
  };
};
