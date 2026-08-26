/**
 * KIZUNAFIT - Payout Queries: usePayouts
 */

import { useQuery } from '@tanstack/react-query';
import { PAYOUT_QUERY_KEYS } from '../queryKeys';
import { payoutRepository } from '../../infrastructure/repositories/PayoutRepositoryImpl';
import { PayoutQueryParams, PaginatedPayoutsResponseDTO } from '../../domain/types/payout.types';
import { useAuthStore } from '../../../identity/application/store/authStore';

export interface UsePayoutsOptions {
  enabled?: boolean;
}

export const usePayouts = (params?: PayoutQueryParams, options?: UsePayoutsOptions) => {
  const { user } = useAuthStore();
  const role = (user?.role || '').toUpperCase();
  const isAuthorizedRole = role === 'TRAINER' || role === 'ADMIN';

  return useQuery<PaginatedPayoutsResponseDTO, Error>({
    queryKey: PAYOUT_QUERY_KEYS.list(params),
    queryFn: () => payoutRepository.listPayouts(params),
    enabled: isAuthorizedRole && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};
