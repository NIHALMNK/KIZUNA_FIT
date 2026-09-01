import { CoachingQueryParams } from '../domain/types/coaching.types';

export const COACHING_QUERY_KEYS = {
  all: ['coaching'] as const,
  lists: () => [...COACHING_QUERY_KEYS.all, 'list'] as const,
  list: (params?: CoachingQueryParams) => [...COACHING_QUERY_KEYS.lists(), params] as const,
  active: () => [...COACHING_QUERY_KEYS.all, 'active'] as const,
  history: (params?: CoachingQueryParams) =>
    [...COACHING_QUERY_KEYS.all, 'history', params] as const,
  details: () => [...COACHING_QUERY_KEYS.all, 'detail'] as const,
  detail: (relationshipId: string) => [...COACHING_QUERY_KEYS.details(), relationshipId] as const,
};
