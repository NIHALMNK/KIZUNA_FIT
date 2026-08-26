/**
 * KIZUNAFIT - Refund Queries: useRefunds
 */

import { useQuery } from '@tanstack/react-query';
import { REFUND_QUERY_KEYS } from '../queryKeys';
import { refundRepository } from '../../infrastructure/repositories/RefundRepositoryImpl';
import { RefundQueryParams, PaginatedRefundsResponseDTO } from '../../domain/types/refund.types';

export interface UseRefundsOptions {
  enabled?: boolean;
}

export const useRefunds = (params?: RefundQueryParams, options?: UseRefundsOptions) => {
  return useQuery<PaginatedRefundsResponseDTO, Error>({
    queryKey: REFUND_QUERY_KEYS.list(params),
    queryFn: () => refundRepository.listRefunds(params),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};
