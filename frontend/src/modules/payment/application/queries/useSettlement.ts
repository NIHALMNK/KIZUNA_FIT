/**
 * KIZUNAFIT - Payout Queries: useSettlement
 * Fetches post-PAID immutable financial settlement snapshot.
 */

import { useQuery } from '@tanstack/react-query';
import { PAYOUT_QUERY_KEYS } from '../queryKeys';
import { payoutRepository } from '../../infrastructure/repositories/PayoutRepositoryImpl';
import { SettlementDetailsDTO } from '../../domain/types/settlement.types';
import { useAuthStore } from '../../../identity/application/store/authStore';

export interface UseSettlementOptions {
  enabled?: boolean;
}

export const useSettlement = (paymentId: string, options?: UseSettlementOptions) => {
  const { user } = useAuthStore();
  const role = (user?.role || '').toUpperCase();
  const isAuthorizedRole = role === 'TRAINER' || role === 'ADMIN';

  return useQuery<SettlementDetailsDTO, Error>({
    queryKey: PAYOUT_QUERY_KEYS.settlement(paymentId),
    queryFn: () => payoutRepository.getSettlement(paymentId),
    enabled: Boolean(paymentId) && isAuthorizedRole && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
