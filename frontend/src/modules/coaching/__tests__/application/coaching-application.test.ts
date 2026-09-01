import { describe, it, expect } from 'vitest';
import { COACHING_QUERY_KEYS } from '../../application/queryKeys';
import { CoachingRelationshipStatus } from '../../domain/types/coaching.types';

describe('Frontend Coaching Application Query Keys', () => {
  it('should generate hierarchical cache keys', () => {
    expect(COACHING_QUERY_KEYS.all).toEqual(['coaching']);
    expect(COACHING_QUERY_KEYS.lists()).toEqual(['coaching', 'list']);
    expect(COACHING_QUERY_KEYS.list({ status: CoachingRelationshipStatus.ACTIVE })).toEqual([
      'coaching',
      'list',
      { status: CoachingRelationshipStatus.ACTIVE },
    ]);
    expect(COACHING_QUERY_KEYS.active()).toEqual(['coaching', 'active']);
    expect(COACHING_QUERY_KEYS.history()).toEqual(['coaching', 'history', undefined]);
    expect(COACHING_QUERY_KEYS.detail('rel_100')).toEqual(['coaching', 'detail', 'rel_100']);
  });
});
