/**
 * KIZUNAFIT - Dispute Queries: useDisputes
 */

import { useQuery } from '@tanstack/react-query';
import { DISPUTE_QUERY_KEYS } from '../queryKeys';
import { disputeRepository } from '../../infrastructure/repositories/DisputeRepositoryImpl';
import { DisputeQueryParams, PaginatedDisputesResponseDTO } from '../../domain/types/dispute.types';

export interface UseDisputesOptions {
  enabled?: boolean;
}

export const useDisputes = (params?: DisputeQueryParams, options?: UseDisputesOptions) => {
  return useQuery<PaginatedDisputesResponseDTO, Error>({
    queryKey: DISPUTE_QUERY_KEYS.list(params),
    queryFn: () => disputeRepository.listDisputes(params),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};
