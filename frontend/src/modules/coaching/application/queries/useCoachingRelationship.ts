import { useQuery } from '@tanstack/react-query';
import { coachingRepository } from '../../infrastructure/repositories/CoachingRepositoryImpl';
import { COACHING_QUERY_KEYS } from '../queryKeys';
import { CoachingRelationship } from '../../domain/types/coaching.types';

export const useCoachingRelationship = (relationshipId?: string) => {
  return useQuery<CoachingRelationship, Error>({
    queryKey: COACHING_QUERY_KEYS.detail(relationshipId || ''),
    queryFn: () => coachingRepository.getById(relationshipId!),
    enabled: Boolean(relationshipId && relationshipId.trim().length > 0),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};
