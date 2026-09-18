import { useMutation, useQueryClient } from '@tanstack/react-query';
import { coachingRepository } from '../../infrastructure/repositories/CoachingRepositoryImpl';
import { COACHING_QUERY_KEYS } from '../queryKeys';
import { CoachingRelationship, CancelCoachingRequest } from '../../domain/types/coaching.types';

export const useCancelCoachingRelationship = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CoachingRelationship,
    Error,
    { relationshipId: string; payload: CancelCoachingRequest }
  >({
    mutationFn: ({ relationshipId, payload }) => coachingRepository.cancel(relationshipId, payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(COACHING_QUERY_KEYS.detail(updated.relationshipId), updated);
      queryClient.invalidateQueries({ queryKey: COACHING_QUERY_KEYS.active() });
      queryClient.invalidateQueries({ queryKey: COACHING_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: COACHING_QUERY_KEYS.all });
    },
  });
};
