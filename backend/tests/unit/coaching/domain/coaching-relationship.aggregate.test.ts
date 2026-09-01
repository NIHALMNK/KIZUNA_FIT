import { describe, it, expect } from 'vitest';
import { CoachingRelationship } from '../../../../src/modules/coaching/domain/aggregates/coaching-relationship.aggregate';
import { CoachingRelationshipStatus } from '../../../../src/modules/coaching/domain/enums/coaching-relationship-status.enum';
import {
  InvalidCoachingTransitionException,
  UnauthorizedCoachingActionException,
  CoachingRelationshipImmutableException,
} from '../../../../src/modules/coaching/domain/exceptions/coaching-domain.exceptions';

describe('CoachingRelationship Aggregate Domain Tests', () => {
  const createActiveRelationship = () => {
    return CoachingRelationship.createDirectActive({
      acquisitionPipelineId: 'pipe_123',
      paymentId: 'pay_123',
      subscriptionId: 'sub_123',
      clientId: 'usr_client_01',
      trainerId: 'usr_trainer_01',
    }).getValue()!;
  };

  const createPendingRelationship = () => {
    return CoachingRelationship.createPending({
      acquisitionPipelineId: 'pipe_123',
      paymentId: 'pay_123',
      subscriptionId: 'sub_123',
      clientId: 'usr_client_01',
      trainerId: 'usr_trainer_01',
    }).getValue()!;
  };

  describe('Factory and Direct ACTIVE Creation (PaymentSucceeded Flow)', () => {
    it('should create relationship directly in ACTIVE state with activatedAt populated', () => {
      const rel = createActiveRelationship();

      expect(rel.status).toBe(CoachingRelationshipStatus.ACTIVE);
      expect(rel.isActive()).toBe(true);
      expect(rel.isTerminal()).toBe(false);
      expect(rel.timeline.activatedAt).toBeInstanceOf(Date);
      expect(rel.timeline.completedAt).toBeNull();
      expect(rel.timeline.cancelledAt).toBeNull();
      expect(rel.timeline.refundedAt).toBeNull();
      expect(rel.timeline.disputedAt).toBeNull();
      expect(rel.timeline.expiredAt).toBeNull();
      expect(rel.domainEvents.length).toBe(1);
      expect(rel.domainEvents[0].constructor.name).toBe('CoachingRelationshipCreatedEvent');
    });

    it('should fail creation if mandatory fields are missing', () => {
      const res = CoachingRelationship.createDirectActive({
        acquisitionPipelineId: '',
        paymentId: 'pay_123',
        subscriptionId: 'sub_123',
        clientId: 'usr_client_01',
        trainerId: 'usr_trainer_01',
      });

      expect(res.isFailure).toBe(true);
      expect(res.error).toContain('acquisitionPipelineId is required');
    });
  });

  describe('Fallback PENDING Creation and Activation', () => {
    it('should create relationship in PENDING state and activate correctly', () => {
      const rel = createPendingRelationship();

      expect(rel.status).toBe(CoachingRelationshipStatus.PENDING);
      expect(rel.timeline.activatedAt).toBeNull();

      rel.clearEvents();
      rel.activate();

      expect(rel.status).toBe(CoachingRelationshipStatus.ACTIVE);
      expect(rel.timeline.activatedAt).toBeInstanceOf(Date);
      expect(rel.domainEvents.length).toBe(1);
      expect(rel.domainEvents[0].constructor.name).toBe('CoachingRelationshipActivatedEvent');
    });

    it('should throw when activating an already ACTIVE relationship', () => {
      const rel = createActiveRelationship();

      expect(() => rel.activate()).toThrow(InvalidCoachingTransitionException);
    });
  });

  describe('Completion Lifecycle', () => {
    it('should complete active relationship when requested by assigned trainer', () => {
      const rel = createActiveRelationship();
      rel.clearEvents();

      rel.complete('usr_trainer_01');

      expect(rel.status).toBe(CoachingRelationshipStatus.COMPLETED);
      expect(rel.isTerminal()).toBe(true);
      expect(rel.timeline.completedAt).toBeInstanceOf(Date);
      expect(rel.domainEvents.length).toBe(1);
      expect(rel.domainEvents[0].constructor.name).toBe('CoachingRelationshipCompletedEvent');
    });

    it('should reject completion if requested by another user or client', () => {
      const rel = createActiveRelationship();

      expect(() => rel.complete('usr_client_01')).toThrow(UnauthorizedCoachingActionException);
      expect(() => rel.complete('usr_other_trainer')).toThrow(UnauthorizedCoachingActionException);
    });

    it('should reject completion on a terminal or non-active relationship', () => {
      const rel = createActiveRelationship();
      rel.complete('usr_trainer_01');

      expect(() => rel.complete('usr_trainer_01')).toThrow(CoachingRelationshipImmutableException);
    });
  });

  describe('Cancellation Lifecycle', () => {
    it('should cancel active relationship when requested by trainer with reason', () => {
      const rel = createActiveRelationship();
      rel.clearEvents();

      rel.cancel('usr_trainer_01', 'Client relocated away from facility');

      expect(rel.status).toBe(CoachingRelationshipStatus.CANCELLED);
      expect(rel.isTerminal()).toBe(true);
      expect(rel.timeline.cancelledAt).toBeInstanceOf(Date);
      expect(rel.cancellationReason).toBe('Client relocated away from facility');
      expect(rel.domainEvents.length).toBe(1);
      expect(rel.domainEvents[0].constructor.name).toBe('CoachingRelationshipCancelledEvent');
    });

    it('should allow admin to cancel active relationship', () => {
      const rel = createActiveRelationship();
      rel.clearEvents();

      rel.cancel('usr_admin_09', 'Platform policy violation', true);

      expect(rel.status).toBe(CoachingRelationshipStatus.CANCELLED);
      expect(rel.cancellationReason).toBe('Platform policy violation');
    });

    it('should reject cancellation by unauthorized user', () => {
      const rel = createActiveRelationship();

      expect(() => rel.cancel('usr_client_01', 'Cancel request')).toThrow(
        UnauthorizedCoachingActionException,
      );
    });

    it('should reject cancellation without a reason', () => {
      const rel = createActiveRelationship();

      expect(() => rel.cancel('usr_trainer_01', '   ')).toThrow(
        UnauthorizedCoachingActionException,
      );
    });
  });

  describe('Dispute Lifecycle', () => {
    it('should freeze active relationship on dispute and allow resolution back to ACTIVE', () => {
      const rel = createActiveRelationship();
      rel.clearEvents();

      rel.freezeForDispute('disp_999');

      expect(rel.status).toBe(CoachingRelationshipStatus.DISPUTED);
      expect(rel.timeline.disputedAt).toBeInstanceOf(Date);
      expect(rel.domainEvents.length).toBe(1);
      expect(rel.domainEvents[0].constructor.name).toBe('CoachingRelationshipDisputedEvent');

      // Resolve back to ACTIVE
      rel.resolveDispute();
      expect(rel.status).toBe(CoachingRelationshipStatus.ACTIVE);
    });

    it('should reject freezing non-active relationship', () => {
      const rel = createActiveRelationship();
      rel.complete('usr_trainer_01');

      expect(() => rel.freezeForDispute('disp_999')).toThrow(
        CoachingRelationshipImmutableException,
      );
    });
  });

  describe('Refund Lifecycle', () => {
    it('should transition to REFUNDED from ACTIVE or DISPUTED upon approved refund', () => {
      const rel = createActiveRelationship();
      rel.clearEvents();

      rel.markRefunded('ref_888');

      expect(rel.status).toBe(CoachingRelationshipStatus.REFUNDED);
      expect(rel.isTerminal()).toBe(true);
      expect(rel.timeline.refundedAt).toBeInstanceOf(Date);
      expect(rel.domainEvents.length).toBe(1);
      expect(rel.domainEvents[0].constructor.name).toBe('CoachingRelationshipRefundedEvent');
    });

    it('should transition to REFUNDED from DISPUTED state', () => {
      const rel = createActiveRelationship();
      rel.freezeForDispute('disp_123');

      rel.markRefunded('ref_123');
      expect(rel.status).toBe(CoachingRelationshipStatus.REFUNDED);
    });
  });

  describe('Expiration Lifecycle', () => {
    it('should transition to EXPIRED from ACTIVE', () => {
      const rel = createActiveRelationship();
      rel.expire();

      expect(rel.status).toBe(CoachingRelationshipStatus.EXPIRED);
      expect(rel.isTerminal()).toBe(true);
      expect(rel.timeline.expiredAt).toBeInstanceOf(Date);
    });
  });

  describe('Terminal State Reopening Protection (No Relationship Reuse)', () => {
    it('cannot reopen COMPLETED relationship', () => {
      const rel = createActiveRelationship();
      rel.complete('usr_trainer_01');

      expect(() => rel.activate()).toThrow(CoachingRelationshipImmutableException);
      expect(() => rel.complete('usr_trainer_01')).toThrow(CoachingRelationshipImmutableException);
      expect(() => rel.cancel('usr_trainer_01', 'Reason')).toThrow(
        CoachingRelationshipImmutableException,
      );
      expect(() => rel.expire()).toThrow(CoachingRelationshipImmutableException);
    });

    it('cannot reopen CANCELLED relationship', () => {
      const rel = createActiveRelationship();
      rel.cancel('usr_trainer_01', 'Reason');

      expect(() => rel.activate()).toThrow(CoachingRelationshipImmutableException);
    });
  });
});
