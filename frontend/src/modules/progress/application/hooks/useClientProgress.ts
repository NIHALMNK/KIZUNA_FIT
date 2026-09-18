import { useQuery } from '@tanstack/react-query';
import { progressApi } from '../../infrastructure/api/progressApi';
import { ProgressQueryParams } from '../../domain/types/progress.types';

export const CLIENT_PROGRESS_QUERY_KEY = 'clientProgress';

export function useClientProgress(params?: ProgressQueryParams) {
  return useQuery({
    queryKey: [CLIENT_PROGRESS_QUERY_KEY, params],
    queryFn: () => progressApi.getMyProgress(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
