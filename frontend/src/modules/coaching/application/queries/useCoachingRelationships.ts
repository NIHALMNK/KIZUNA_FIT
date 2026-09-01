import { useQuery } from '@tanstack/react-query';
import { coachingRepository } from '../../infrastructure/repositories/CoachingRepositoryImpl';
import { COACHING_QUERY_KEYS } from '../queryKeys';
import { CoachingQueryParams, PaginatedCoachingResponse } from '../../domain/types/coaching.types';

export const useCoachingRelationships = (params?: CoachingQueryParams) => {
  return useQuery<PaginatedCoachingResponse, Error>({
    queryKey: COACHING_QUERY_KEYS.list(params),
    queryFn: () => coachingRepository.list(params),
    staleTime: 1000 * 60 * 2,
  });
};
