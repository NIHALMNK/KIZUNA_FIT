import { describe, it, expect } from 'vitest';
import { CoachingRelationshipStatus } from '../../domain/types/coaching.types';

describe('Frontend Coaching Domain Types & Contracts', () => {
  it('should define the 7 canonical lifecycle states of SM-07', () => {
    expect(CoachingRelationshipStatus.PENDING).toBe('PENDING');
    expect(CoachingRelationshipStatus.ACTIVE).toBe('ACTIVE');
    expect(CoachingRelationshipStatus.COMPLETED).toBe('COMPLETED');
    expect(CoachingRelationshipStatus.CANCELLED).toBe('CANCELLED');
    expect(CoachingRelationshipStatus.REFUNDED).toBe('REFUNDED');
    expect(CoachingRelationshipStatus.DISPUTED).toBe('DISPUTED');
    expect(CoachingRelationshipStatus.EXPIRED).toBe('EXPIRED');
  });

  it('should verify exactly 7 states exist without extraneous paused/suspended states', () => {
    const states = Object.values(CoachingRelationshipStatus);
    expect(states.length).toBe(7);
    expect(states).not.toContain('PAUSED');
    expect(states).not.toContain('SUSPENDED');
    expect(states).not.toContain('RESUMED');
  });
});
