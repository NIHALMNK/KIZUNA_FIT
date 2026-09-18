/**
 * KIZUNAFIT - Payout Queries: usePayoutEligibility
 */

import { useQuery } from '@tanstack/react-query';
import { PAYOUT_QUERY_KEYS } from '../queryKeys';
import { payoutRepository } from '../../infrastructure/repositories/PayoutRepositoryImpl';
import { PayoutEligibilityDTO } from '../../domain/types/payout.types';
import { useAuthStore } from '../../../identity/application/store/authStore';

export interface UsePayoutEligibilityOptions {
  enabled?: boolean;
}

export const usePayoutEligibility = (paymentId: string, options?: UsePayoutEligibilityOptions) => {
  const { user } = useAuthStore();
  const role = (user?.role || '').toUpperCase();
  const isAuthorizedRole = role === 'TRAINER' || role === 'ADMIN';

  return useQuery<PayoutEligibilityDTO, Error>({
    queryKey: PAYOUT_QUERY_KEYS.eligibility(paymentId),
    queryFn: () => payoutRepository.checkEligibility(paymentId),
    enabled: Boolean(paymentId) && isAuthorizedRole && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};
