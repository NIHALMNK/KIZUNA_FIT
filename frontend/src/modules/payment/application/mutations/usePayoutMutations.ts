/**
 * KIZUNAFIT - Payout Mutations
 * Encapsulates Admin Payout processing and failed transfer retries.
 * Strictly forbids client-controlled payout amounts.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { payoutRepository } from '../../infrastructure/repositories/PayoutRepositoryImpl';
import { ProcessPayoutRequestDTO, PayoutDetailsDTO } from '../../domain/types/payout.types';
import { PAYOUT_QUERY_KEYS, PAYMENT_QUERY_KEYS } from '../queryKeys';

export const useProcessPayout = () => {
  const queryClient = useQueryClient();

  return useMutation<
    PayoutDetailsDTO,
    Error,
    { paymentId: string; payload?: ProcessPayoutRequestDTO }
  >({
    mutationFn: ({ paymentId, payload }) => payoutRepository.processPayout(paymentId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: PAYOUT_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: PAYOUT_QUERY_KEYS.detail(variables.paymentId),
      });
      queryClient.invalidateQueries({
        queryKey: PAYOUT_QUERY_KEYS.eligibility(variables.paymentId),
      });
      queryClient.invalidateQueries({
        queryKey: PAYOUT_QUERY_KEYS.settlement(variables.paymentId),
      });
      queryClient.invalidateQueries({
        queryKey: PAYMENT_QUERY_KEYS.detail(variables.paymentId),
      });
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.lists() });
    },
  });
};

export const useRetryPayout = () => {
  const queryClient = useQueryClient();

  return useMutation<PayoutDetailsDTO, Error, { paymentId: string }>({
    mutationFn: ({ paymentId }) => payoutRepository.retryPayout(paymentId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: PAYOUT_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: PAYOUT_QUERY_KEYS.detail(variables.paymentId),
      });
      queryClient.invalidateQueries({
        queryKey: PAYOUT_QUERY_KEYS.eligibility(variables.paymentId),
      });
      queryClient.invalidateQueries({
        queryKey: PAYMENT_QUERY_KEYS.detail(variables.paymentId),
      });
    },
  });
};
