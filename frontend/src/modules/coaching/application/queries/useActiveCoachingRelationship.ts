import { useQuery } from '@tanstack/react-query';
import { coachingRepository } from '../../infrastructure/repositories/CoachingRepositoryImpl';
import { COACHING_QUERY_KEYS } from '../queryKeys';
import { CoachingRelationship } from '../../domain/types/coaching.types';

export const useActiveCoachingRelationship = () => {
  return useQuery<CoachingRelationship[], Error>({
    queryKey: COACHING_QUERY_KEYS.active(),
    queryFn: () => coachingRepository.getActive(),
    staleTime: 1000 * 60, // 1 minute
  });
};
