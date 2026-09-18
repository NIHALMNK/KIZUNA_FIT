import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { PUBLIC_TRAINER_PROFILE_QUERY_KEY, SEARCH_TRAINERS_QUERY_KEY } from '../usePublicTrainers';

describe('Trainer Profile Mutation Query Key Invalidation Rules', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    vi.spyOn(queryClient, 'invalidateQueries');
  });

  it('should invalidate publicTrainerProfile and searchTrainers query families', () => {
    queryClient.invalidateQueries({ queryKey: [PUBLIC_TRAINER_PROFILE_QUERY_KEY] });
    queryClient.invalidateQueries({ queryKey: [SEARCH_TRAINERS_QUERY_KEY] });

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['publicTrainerProfile'],
    });
    expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['searchTrainers'],
    });
  });
});
