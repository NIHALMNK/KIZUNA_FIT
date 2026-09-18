import { useQuery } from '@tanstack/react-query';
import { coachingRepository } from '../../infrastructure/repositories/CoachingRepositoryImpl';
import { COACHING_QUERY_KEYS } from '../queryKeys';
import { CoachingQueryParams, PaginatedCoachingResponse } from '../../domain/types/coaching.types';

export const useCoachingHistory = (params?: CoachingQueryParams) => {
  return useQuery<PaginatedCoachingResponse, Error>({
    queryKey: COACHING_QUERY_KEYS.history(params),
    queryFn: () => coachingRepository.getHistory(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
