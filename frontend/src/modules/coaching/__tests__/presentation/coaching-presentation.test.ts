import { describe, it, expect } from 'vitest';
import React from 'react';
import { CoachingStatusBadge } from '../../presentation/components/CoachingStatusBadge';
import { CoachingTimelineView } from '../../presentation/components/CoachingTimelineView';
import { CoachingCard } from '../../presentation/components/CoachingCard';
import { CoachingRelationshipStatus } from '../../domain/types/coaching.types';

describe('Frontend Coaching Presentation Layer Tests', () => {
  describe('CoachingStatusBadge', () => {
    it('instantiates ACTIVE status badge', () => {
      const el = React.createElement(CoachingStatusBadge, {
        status: CoachingRelationshipStatus.ACTIVE,
      });
      expect(el.props.status).toBe(CoachingRelationshipStatus.ACTIVE);
    });

    it('instantiates COMPLETED status badge', () => {
      const el = React.createElement(CoachingStatusBadge, {
        status: CoachingRelationshipStatus.COMPLETED,
      });
      expect(el.props.status).toBe(CoachingRelationshipStatus.COMPLETED);
    });

    it('instantiates CANCELLED status badge', () => {
      const el = React.createElement(CoachingStatusBadge, {
        status: CoachingRelationshipStatus.CANCELLED,
      });
      expect(el.props.status).toBe(CoachingRelationshipStatus.CANCELLED);
    });
  });

  describe('CoachingTimelineView', () => {
    it('instantiates timeline view with active timestamps', () => {
      const timeline = {
        activatedAt: '2026-08-01T10:00:00.000Z',
        completedAt: null,
        cancelledAt: null,
        refundedAt: null,
        disputedAt: null,
        expiredAt: null,
      };

      const el = React.createElement(CoachingTimelineView, {
        timeline,
        createdAt: '2026-08-01T09:59:00.000Z',
      });

      expect(el.props.timeline.activatedAt).toBe('2026-08-01T10:00:00.000Z');
    });
  });

  describe('CoachingCard', () => {
    it('instantiates card for client role', () => {
      const relationship = {
        relationshipId: 'rel_100',
        trainer: { id: 'usr_trainer_01', fullName: 'Coach Alex' },
        client: { id: 'usr_client_01', fullName: 'John Doe' },
        acquisitionPipelineId: 'pipe_100',
        paymentId: 'pay_100',
        subscriptionId: 'sub_100',
        status: CoachingRelationshipStatus.ACTIVE,
        startedAt: '2026-08-01T10:00:00.000Z',
        completedAt: null,
        createdAt: '2026-08-01T10:00:00.000Z',
      };

      const el = React.createElement(CoachingCard, {
        relationship,
        role: 'CLIENT',
      });

      expect(el.props.relationship.relationshipId).toBe('rel_100');
      expect(el.props.role).toBe('CLIENT');
    });
  });
});
