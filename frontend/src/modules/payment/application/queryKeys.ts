/**
 * KIZUNAFIT - Centralized Payment Query Keys
 * Composable, stable TanStack Query key definitions for the Payment Domain.
 */

import { PaymentQueryParams } from '../domain/types/payment.types';
import { RefundQueryParams } from '../domain/types/refund.types';
import { DisputeQueryParams } from '../domain/types/dispute.types';
import { PayoutQueryParams } from '../domain/types/payout.types';

export const PAYMENT_QUERY_KEYS = {
  all: ['payments'] as const,
  lists: () => [...PAYMENT_QUERY_KEYS.all, 'list'] as const,
  list: (params?: PaymentQueryParams) => [...PAYMENT_QUERY_KEYS.lists(), params] as const,
  details: () => [...PAYMENT_QUERY_KEYS.all, 'detail'] as const,
  detail: (paymentId: string) => [...PAYMENT_QUERY_KEYS.details(), paymentId] as const,
  invoice: (paymentId: string) => [...PAYMENT_QUERY_KEYS.detail(paymentId), 'invoice'] as const,
};

export const REFUND_QUERY_KEYS = {
  all: ['refunds'] as const,
  lists: () => [...REFUND_QUERY_KEYS.all, 'list'] as const,
  list: (params?: RefundQueryParams) => [...REFUND_QUERY_KEYS.lists(), params] as const,
  detail: (paymentId: string, refundId: string) =>
    [...REFUND_QUERY_KEYS.all, paymentId, refundId] as const,
};

export const DISPUTE_QUERY_KEYS = {
  all: ['disputes'] as const,
  lists: () => [...DISPUTE_QUERY_KEYS.all, 'list'] as const,
  list: (params?: DisputeQueryParams) => [...DISPUTE_QUERY_KEYS.lists(), params] as const,
  detail: (paymentId: string, disputeId: string) =>
    [...DISPUTE_QUERY_KEYS.all, paymentId, disputeId] as const,
};

export const PAYOUT_QUERY_KEYS = {
  all: ['payouts'] as const,
  lists: () => [...PAYOUT_QUERY_KEYS.all, 'list'] as const,
  list: (params?: PayoutQueryParams) => [...PAYOUT_QUERY_KEYS.lists(), params] as const,
  detail: (paymentId: string) => [...PAYOUT_QUERY_KEYS.all, 'detail', paymentId] as const,
  eligibility: (paymentId: string) => [...PAYOUT_QUERY_KEYS.all, 'eligibility', paymentId] as const,
  settlement: (paymentId: string) => [...PAYOUT_QUERY_KEYS.all, 'settlement', paymentId] as const,
};
