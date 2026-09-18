/**
 * KIZUNAFIT - Refund Mutations
 * Encapsulates Exceptional Service-Failure Refund requests and Admin Review workflows.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { refundRepository } from '../../infrastructure/repositories/RefundRepositoryImpl';
import {
  RequestRefundRequestDTO,
  AdminReviewRefundRequestDTO,
  AdminApproveRefundRequestDTO,
  AdminRejectRefundRequestDTO,
  RefundDetailsDTO,
} from '../../domain/types/refund.types';
import { REFUND_QUERY_KEYS, PAYMENT_QUERY_KEYS, PAYOUT_QUERY_KEYS } from '../queryKeys';

export const useRequestRefund = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RefundDetailsDTO,
    Error,
    { paymentId: string; payload: RequestRefundRequestDTO }
  >({
    mutationFn: ({ paymentId, payload }) => refundRepository.requestRefund(paymentId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: REFUND_QUERY_KEYS.all });
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

export const useReviewRefund = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RefundDetailsDTO,
    Error,
    { paymentId: string; refundId: string; payload?: AdminReviewRefundRequestDTO }
  >({
    mutationFn: ({ paymentId, refundId, payload }) =>
      refundRepository.reviewRefund(paymentId, refundId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: REFUND_QUERY_KEYS.detail(variables.paymentId, variables.refundId),
      });
      queryClient.invalidateQueries({ queryKey: REFUND_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: PAYMENT_QUERY_KEYS.detail(variables.paymentId),
      });
    },
  });
};

export const useApproveRefund = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RefundDetailsDTO,
    Error,
    { paymentId: string; refundId: string; payload?: AdminApproveRefundRequestDTO }
  >({
    mutationFn: ({ paymentId, refundId, payload }) =>
      refundRepository.approveRefund(paymentId, refundId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: REFUND_QUERY_KEYS.detail(variables.paymentId, variables.refundId),
      });
      queryClient.invalidateQueries({ queryKey: REFUND_QUERY_KEYS.lists() });
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

export const useRejectRefund = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RefundDetailsDTO,
    Error,
    { paymentId: string; refundId: string; payload: AdminRejectRefundRequestDTO }
  >({
    mutationFn: ({ paymentId, refundId, payload }) =>
      refundRepository.rejectRefund(paymentId, refundId, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: REFUND_QUERY_KEYS.detail(variables.paymentId, variables.refundId),
      });
      queryClient.invalidateQueries({ queryKey: REFUND_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: PAYMENT_QUERY_KEYS.detail(variables.paymentId),
      });
      queryClient.invalidateQueries({
        queryKey: PAYOUT_QUERY_KEYS.eligibility(variables.paymentId),
      });
    },
  });
};

export const useProcessApprovedRefund = () => {
  const queryClient = useQueryClient();

  return useMutation<RefundDetailsDTO, Error, { paymentId: string; refundId: string }>({
    mutationFn: ({ paymentId, refundId }) =>
      refundRepository.processApprovedRefund(paymentId, refundId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: REFUND_QUERY_KEYS.detail(variables.paymentId, variables.refundId),
      });
      queryClient.invalidateQueries({ queryKey: REFUND_QUERY_KEYS.lists() });
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
