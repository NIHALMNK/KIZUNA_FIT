/**
 * KIZUNAFIT - Payment Queries: usePayment & usePaymentInvoice
 */

import { useQuery } from '@tanstack/react-query';
import { PAYMENT_QUERY_KEYS } from '../queryKeys';
import { paymentRepository } from '../../infrastructure/repositories/PaymentRepositoryImpl';
import { PaymentDetails, PaymentInvoice } from '../../domain/types/payment.types';

export interface UsePaymentOptions {
  enabled?: boolean;
}

export const usePayment = (paymentId: string, options?: UsePaymentOptions) => {
  return useQuery<PaymentDetails, Error>({
    queryKey: PAYMENT_QUERY_KEYS.detail(paymentId),
    queryFn: () => paymentRepository.getPayment(paymentId),
    enabled: Boolean(paymentId) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};

export const usePaymentInvoice = (paymentId: string, options?: UsePaymentOptions) => {
  return useQuery<PaymentInvoice, Error>({
    queryKey: PAYMENT_QUERY_KEYS.invoice(paymentId),
    queryFn: () => paymentRepository.getInvoice(paymentId),
    enabled: Boolean(paymentId) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
