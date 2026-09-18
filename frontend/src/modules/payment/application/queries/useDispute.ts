/**
 * KIZUNAFIT - Dispute Queries: useDispute
 */

import { useQuery } from '@tanstack/react-query';
import { DISPUTE_QUERY_KEYS } from '../queryKeys';
import { disputeRepository } from '../../infrastructure/repositories/DisputeRepositoryImpl';
import { DisputeDetailsDTO } from '../../domain/types/dispute.types';

export interface UseDisputeOptions {
  enabled?: boolean;
}

export const useDispute = (paymentId: string, disputeId: string, options?: UseDisputeOptions) => {
  return useQuery<DisputeDetailsDTO, Error>({
    queryKey: DISPUTE_QUERY_KEYS.detail(paymentId, disputeId),
    queryFn: () => disputeRepository.getDispute(paymentId, disputeId),
    enabled: Boolean(paymentId) && Boolean(disputeId) && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};
