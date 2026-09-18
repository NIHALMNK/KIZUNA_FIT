/**
 * KIZUNAFIT - Dispute Mutations
 * Encapsulates Client/Trainer dispute creation and Admin investigation/resolution workflows.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { disputeRepository } from '../../infrastructure/repositories/DisputeRepositoryImpl';
import {
  RaiseDisputeRequestDTO,
  ResolveDisputeRequestDTO,
  DisputeDetailsDTO,
} from '../../domain/types/dispute.types';
import { DISPUTE_QUERY_KEYS, PAYMENT_QUERY_KEYS, PAYOUT_QUERY_KEYS } from '../queryKeys';

export const useRaiseDispute = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DisputeDetailsDTO,
    Error,
    { paymentId: string; payload: RaiseDisputeRequestDTO }
  >({
    mutationFn: ({ paymentId, payload }) => disputeRepository.raiseDispute(paymentId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: DISPUTE_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: PAYMENT_QUERY_KEYS.detail(variables.paymentId),
      });
      queryClient.invalidateQueries({ queryKey: PAYMENT_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: PAYOUT_QUERY_KEYS.eligibility(variables.paymentId),
      });
      queryClient.invalidateQueries({
        queryKey: PAYOUT_QUERY_KEYS.detail(variables.paymentId),
      });
    },
  });
};

export const useInvestigateDispute = () => {
  const queryClient = useQueryClient();

  return useMutation<DisputeDetailsDTO, Error, { paymentId: string; disputeId: string }>({
    mutationFn: ({ paymentId, disputeId }) =>
      disputeRepository.investigateDispute(paymentId, disputeId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: DISPUTE_QUERY_KEYS.detail(variables.paymentId, variables.disputeId),
      });
      queryClient.invalidateQueries({ queryKey: DISPUTE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: PAYMENT_QUERY_KEYS.detail(variables.paymentId),
      });
    },
  });
};

export const useResolveDispute = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DisputeDetailsDTO,
    Error,
    { paymentId: string; disputeId: string; payload: ResolveDisputeRequestDTO }
  >({
    mutationFn: ({ paymentId, disputeId, payload }) =>
      disputeRepository.resolveDispute(paymentId, disputeId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: DISPUTE_QUERY_KEYS.detail(variables.paymentId, variables.disputeId),
      });
      queryClient.invalidateQueries({ queryKey: DISPUTE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: PAYMENT_QUERY_KEYS.detail(variables.paymentId),
      });
    },
  });
};

export const useCloseDispute = () => {
  const queryClient = useQueryClient();

  return useMutation<DisputeDetailsDTO, Error, { paymentId: string; disputeId: string }>({
    mutationFn: ({ paymentId, disputeId }) => disputeRepository.closeDispute(paymentId, disputeId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: DISPUTE_QUERY_KEYS.detail(variables.paymentId, variables.disputeId),
      });
      queryClient.invalidateQueries({ queryKey: DISPUTE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: PAYMENT_QUERY_KEYS.detail(variables.paymentId),
      });
      queryClient.invalidateQueries({
        queryKey: PAYOUT_QUERY_KEYS.eligibility(variables.paymentId),
      });
      queryClient.invalidateQueries({
        queryKey: PAYOUT_QUERY_KEYS.detail(variables.paymentId),
      });
    },
  });
};
