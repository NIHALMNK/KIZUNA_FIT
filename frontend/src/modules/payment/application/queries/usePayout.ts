/**
 * KIZUNAFIT - Payout Queries: usePayout
 */

import { useQuery } from '@tanstack/react-query';
import { PAYOUT_QUERY_KEYS } from '../queryKeys';
import { payoutRepository } from '../../infrastructure/repositories/PayoutRepositoryImpl';
import { PayoutDetailsDTO } from '../../domain/types/payout.types';
import { useAuthStore } from '../../../identity/application/store/authStore';

export interface UsePayoutOptions {
  enabled?: boolean;
}

export const usePayout = (paymentId: string, options?: UsePayoutOptions) => {
  const { user } = useAuthStore();
  const role = (user?.role || '').toUpperCase();
  const isAuthorizedRole = role === 'TRAINER' || role === 'ADMIN';

  return useQuery<PayoutDetailsDTO, Error>({
    queryKey: PAYOUT_QUERY_KEYS.detail(paymentId),
    queryFn: () => payoutRepository.getPayout(paymentId),
    enabled: Boolean(paymentId) && isAuthorizedRole && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};
