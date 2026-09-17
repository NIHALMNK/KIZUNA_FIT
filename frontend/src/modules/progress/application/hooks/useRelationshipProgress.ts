import { useQuery } from '@tanstack/react-query';
import { progressApi } from '../../infrastructure/api/progressApi';
import { ProgressQueryParams } from '../../domain/types/progress.types';

export const RELATIONSHIP_PROGRESS_QUERY_KEY = 'relationshipProgress';

export function useRelationshipProgress(
  relationshipId: string | undefined,
  params?: ProgressQueryParams,
) {
  return useQuery({
    queryKey: [RELATIONSHIP_PROGRESS_QUERY_KEY, relationshipId, params],
    queryFn: () => {
      if (!relationshipId) throw new Error('Relationship ID is required');
      return progressApi.getRelationshipProgress(relationshipId, params);
    },
    enabled: Boolean(relationshipId),
    staleTime: 1000 * 60 * 5,
  });
}
