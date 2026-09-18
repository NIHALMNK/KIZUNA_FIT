/**
 * KIZUNAFIT - Payment Queries: usePayments
 */

import { useQuery } from '@tanstack/react-query';
import { PAYMENT_QUERY_KEYS } from '../queryKeys';
import { paymentRepository } from '../../infrastructure/repositories/PaymentRepositoryImpl';
import { PaymentQueryParams, PaginatedPaymentsResponseDTO } from '../../domain/types/payment.types';

export interface UsePaymentsOptions {
  enabled?: boolean;
}

export const usePayments = (params?: PaymentQueryParams, options?: UsePaymentsOptions) => {
  return useQuery<PaginatedPaymentsResponseDTO, Error>({
    queryKey: PAYMENT_QUERY_KEYS.list(params),
    queryFn: () => paymentRepository.listPayments(params),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};
