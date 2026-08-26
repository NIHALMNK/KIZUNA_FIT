/**
 * KIZUNAFIT - Refund Queries: useRefund
 */

import { useQuery } from '@tanstack/react-query';
import { REFUND_QUERY_KEYS } from '../queryKeys';
import { refundRepository } from '../../infrastructure/repositories/RefundRepositoryImpl';
import { RefundDetailsDTO } from '../../domain/types/refund.types';

export interface UseRefundOptions {
  enabled?: boolean;
}

export const useRefund = (paymentId: string, refundId: string, options?: UseRefundOptions) => {
  return useQuery<RefundDetailsDTO, Error>({
    queryKey: REFUND_QUERY_KEYS.detail(paymentId, refundId),
    queryFn: () => refundRepository.getRefund(paymentId, refundId),
    enabled: Boolean(paymentId) && Boolean(refundId) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};
