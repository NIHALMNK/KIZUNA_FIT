import { useMutation, useQueryClient } from '@tanstack/react-query';
import { coachingRepository } from '../../infrastructure/repositories/CoachingRepositoryImpl';
import { COACHING_QUERY_KEYS } from '../queryKeys';
import { CoachingRelationship } from '../../domain/types/coaching.types';

export const useCompleteCoachingRelationship = () => {
  const queryClient = useQueryClient();

  return useMutation<CoachingRelationship, Error, string>({
    mutationFn: (relationshipId: string) => coachingRepository.complete(relationshipId),
    onSuccess: (updated) => {
      queryClient.setQueryData(COACHING_QUERY_KEYS.detail(updated.relationshipId), updated);
      queryClient.invalidateQueries({ queryKey: COACHING_QUERY_KEYS.active() });
      queryClient.invalidateQueries({ queryKey: COACHING_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: COACHING_QUERY_KEYS.all });
    },
  });
};
