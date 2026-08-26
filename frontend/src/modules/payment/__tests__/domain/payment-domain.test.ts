import { describe, it, expect } from 'vitest';
import {
  PaymentStatus,
  TransactionType,
  SubscriptionStatus,
  isPaymentSuccess,
  isPaymentTerminal,
  isPaymentRefunded,
} from '../../domain/types/payment.types';
import {
  RefundStatus,
  RefundType,
  isRefundPending,
  isRefundUnderReview,
  isRefundApproved,
  isRefundProcessed,
  isRefundTerminal,
} from '../../domain/types/refund.types';
import {
  DisputeStatus,
  isDisputeActive,
  isDisputeClosed,
  isDisputeResolved,
} from '../../domain/types/dispute.types';
import {
  PayoutStatus,
  isPayoutPending,
  isPayoutOnHold,
  isPayoutProcessing,
  isPayoutPaid,
  isPayoutFailed,
  isPayoutTerminal,
} from '../../domain/types/payout.types';
import {
  PAYMENT_QUERY_KEYS,
  REFUND_QUERY_KEYS,
  DISPUTE_QUERY_KEYS,
  PAYOUT_QUERY_KEYS,
} from '../../application/queryKeys';

describe('Payment Frontend Domain Contracts & Type Safety (Phase 12.1)', () => {
  describe('1. Payment Enums & Status Helpers', () => {
    it('should define exact authoritative PaymentStatus enum values', () => {
      expect(PaymentStatus.CREATED).toBe('CREATED');
      expect(PaymentStatus.PROCESSING).toBe('PROCESSING');
      expect(PaymentStatus.SUCCESS).toBe('SUCCESS');
      expect(PaymentStatus.FAILED).toBe('FAILED');
      expect(PaymentStatus.REFUNDED).toBe('REFUNDED');
      expect(Object.values(PaymentStatus)).toHaveLength(5);
    });

    it('should evaluate isPaymentSuccess correctly', () => {
      expect(isPaymentSuccess(PaymentStatus.SUCCESS)).toBe(true);
      expect(isPaymentSuccess(PaymentStatus.PROCESSING)).toBe(false);
      expect(isPaymentSuccess(PaymentStatus.CREATED)).toBe(false);
      expect(isPaymentSuccess(PaymentStatus.FAILED)).toBe(false);
      expect(isPaymentSuccess(PaymentStatus.REFUNDED)).toBe(false);
    });

    it('should evaluate isPaymentTerminal correctly', () => {
      expect(isPaymentTerminal(PaymentStatus.SUCCESS)).toBe(true);
      expect(isPaymentTerminal(PaymentStatus.FAILED)).toBe(true);
      expect(isPaymentTerminal(PaymentStatus.REFUNDED)).toBe(true);
      expect(isPaymentTerminal(PaymentStatus.CREATED)).toBe(false);
      expect(isPaymentTerminal(PaymentStatus.PROCESSING)).toBe(false);
    });

    it('should evaluate isPaymentRefunded correctly', () => {
      expect(isPaymentRefunded(PaymentStatus.REFUNDED)).toBe(true);
      expect(isPaymentRefunded(PaymentStatus.SUCCESS)).toBe(false);
    });

    it('should define exact authoritative TransactionType values', () => {
      expect(TransactionType.PAYMENT).toBe('PAYMENT');
      expect(TransactionType.REFUND).toBe('REFUND');
      expect(TransactionType.PAYOUT).toBe('PAYOUT');
      expect(Object.values(TransactionType)).toHaveLength(3);
    });

    it('should define exact authoritative SubscriptionStatus values', () => {
      expect(SubscriptionStatus.PENDING).toBe('PENDING');
      expect(SubscriptionStatus.ACTIVE).toBe('ACTIVE');
      expect(SubscriptionStatus.PAUSED).toBe('PAUSED');
      expect(SubscriptionStatus.COMPLETED).toBe('COMPLETED');
      expect(SubscriptionStatus.CANCELLED).toBe('CANCELLED');
      expect(SubscriptionStatus.REFUNDED).toBe('REFUNDED');
      expect(Object.values(SubscriptionStatus)).toHaveLength(6);
    });
  });

  describe('2. Refund Enums & Exceptional Policy Guards', () => {
    it('should define exact authoritative RefundStatus enum values', () => {
      expect(RefundStatus.PENDING).toBe('PENDING');
      expect(RefundStatus.UNDER_REVIEW).toBe('UNDER_REVIEW');
      expect(RefundStatus.APPROVED).toBe('APPROVED');
      expect(RefundStatus.REJECTED).toBe('REJECTED');
      expect(RefundStatus.PROCESSED).toBe('PROCESSED');
      expect(RefundStatus.CANCELLED).toBe('CANCELLED');
      expect(Object.values(RefundStatus)).toHaveLength(6);
    });

    it('should define only FULL_TRAINER_FEE_REFUND for exceptional service failure', () => {
      expect(RefundType.FULL_TRAINER_FEE_REFUND).toBe('FULL_TRAINER_FEE_REFUND');
      expect(Object.values(RefundType)).toEqual(['FULL_TRAINER_FEE_REFUND']);
    });

    it('should evaluate refund helper guards correctly', () => {
      expect(isRefundPending(RefundStatus.PENDING)).toBe(true);
      expect(isRefundPending(RefundStatus.UNDER_REVIEW)).toBe(false);

      expect(isRefundUnderReview(RefundStatus.UNDER_REVIEW)).toBe(true);
      expect(isRefundApproved(RefundStatus.APPROVED)).toBe(true);
      expect(isRefundProcessed(RefundStatus.PROCESSED)).toBe(true);

      expect(isRefundTerminal(RefundStatus.PROCESSED)).toBe(true);
      expect(isRefundTerminal(RefundStatus.REJECTED)).toBe(true);
      expect(isRefundTerminal(RefundStatus.CANCELLED)).toBe(true);
      expect(isRefundTerminal(RefundStatus.PENDING)).toBe(false);
      expect(isRefundTerminal(RefundStatus.UNDER_REVIEW)).toBe(false);
      expect(isRefundTerminal(RefundStatus.APPROVED)).toBe(false);
    });
  });

  describe('3. Dispute Enums & Freeze State Guards', () => {
    it('should define exact authoritative DisputeStatus enum values', () => {
      expect(DisputeStatus.OPEN).toBe('OPEN');
      expect(DisputeStatus.UNDER_INVESTIGATION).toBe('UNDER_INVESTIGATION');
      expect(DisputeStatus.RESOLVED).toBe('RESOLVED');
      expect(DisputeStatus.CLOSED).toBe('CLOSED');
      expect(Object.values(DisputeStatus)).toHaveLength(4);
    });

    it('should evaluate isDisputeActive correctly (OPEN or UNDER_INVESTIGATION)', () => {
      expect(isDisputeActive(DisputeStatus.OPEN)).toBe(true);
      expect(isDisputeActive(DisputeStatus.UNDER_INVESTIGATION)).toBe(true);
      expect(isDisputeActive(DisputeStatus.RESOLVED)).toBe(false);
      expect(isDisputeActive(DisputeStatus.CLOSED)).toBe(false);
    });

    it('should evaluate dispute resolution guards', () => {
      expect(isDisputeResolved(DisputeStatus.RESOLVED)).toBe(true);
      expect(isDisputeResolved(DisputeStatus.OPEN)).toBe(false);

      expect(isDisputeClosed(DisputeStatus.CLOSED)).toBe(true);
      expect(isDisputeClosed(DisputeStatus.UNDER_INVESTIGATION)).toBe(false);
    });
  });

  describe('4. Payout Enums & Terminal State Guards', () => {
    it('should define exact authoritative PayoutStatus enum values', () => {
      expect(PayoutStatus.PENDING).toBe('PENDING');
      expect(PayoutStatus.ON_HOLD).toBe('ON_HOLD');
      expect(PayoutStatus.PROCESSING).toBe('PROCESSING');
      expect(PayoutStatus.PAID).toBe('PAID');
      expect(PayoutStatus.FAILED).toBe('FAILED');
      expect(Object.values(PayoutStatus)).toHaveLength(5);
    });

    it('should evaluate payout state helpers correctly', () => {
      expect(isPayoutPending(PayoutStatus.PENDING)).toBe(true);
      expect(isPayoutOnHold(PayoutStatus.ON_HOLD)).toBe(true);
      expect(isPayoutProcessing(PayoutStatus.PROCESSING)).toBe(true);
      expect(isPayoutPaid(PayoutStatus.PAID)).toBe(true);
      expect(isPayoutFailed(PayoutStatus.FAILED)).toBe(true);

      // PAID and FAILED are terminal
      expect(isPayoutTerminal(PayoutStatus.PAID)).toBe(true);
      expect(isPayoutTerminal(PayoutStatus.FAILED)).toBe(true);
      expect(isPayoutTerminal(PayoutStatus.PROCESSING)).toBe(false);
      expect(isPayoutTerminal(PayoutStatus.ON_HOLD)).toBe(false);
      expect(isPayoutTerminal(PayoutStatus.PENDING)).toBe(false);
    });
  });

  describe('5. Composable TanStack Query Keys', () => {
    it('should compose stable payment query keys', () => {
      expect(PAYMENT_QUERY_KEYS.all).toEqual(['payments']);
      expect(PAYMENT_QUERY_KEYS.lists()).toEqual(['payments', 'list']);
      expect(PAYMENT_QUERY_KEYS.list({ status: PaymentStatus.SUCCESS })).toEqual([
        'payments',
        'list',
        { status: 'SUCCESS' },
      ]);
      expect(PAYMENT_QUERY_KEYS.details()).toEqual(['payments', 'detail']);
      expect(PAYMENT_QUERY_KEYS.detail('pay_123')).toEqual(['payments', 'detail', 'pay_123']);
      expect(PAYMENT_QUERY_KEYS.invoice('pay_123')).toEqual([
        'payments',
        'detail',
        'pay_123',
        'invoice',
      ]);
    });

    it('should compose stable refund query keys', () => {
      expect(REFUND_QUERY_KEYS.all).toEqual(['refunds']);
      expect(REFUND_QUERY_KEYS.list({ status: RefundStatus.PENDING })).toEqual([
        'refunds',
        'list',
        { status: 'PENDING' },
      ]);
      expect(REFUND_QUERY_KEYS.detail('pay_123', 'ref_456')).toEqual([
        'refunds',
        'pay_123',
        'ref_456',
      ]);
    });

    it('should compose stable dispute query keys', () => {
      expect(DISPUTE_QUERY_KEYS.all).toEqual(['disputes']);
      expect(DISPUTE_QUERY_KEYS.list({ status: DisputeStatus.OPEN })).toEqual([
        'disputes',
        'list',
        { status: 'OPEN' },
      ]);
      expect(DISPUTE_QUERY_KEYS.detail('pay_123', 'disp_789')).toEqual([
        'disputes',
        'pay_123',
        'disp_789',
      ]);
    });

    it('should compose stable payout query keys', () => {
      expect(PAYOUT_QUERY_KEYS.all).toEqual(['payouts']);
      expect(PAYOUT_QUERY_KEYS.list({ trainerId: 'trn_123' })).toEqual([
        'payouts',
        'list',
        { trainerId: 'trn_123' },
      ]);
      expect(PAYOUT_QUERY_KEYS.detail('pay_123')).toEqual(['payouts', 'detail', 'pay_123']);
      expect(PAYOUT_QUERY_KEYS.eligibility('pay_123')).toEqual([
        'payouts',
        'eligibility',
        'pay_123',
      ]);
      expect(PAYOUT_QUERY_KEYS.settlement('pay_123')).toEqual(['payouts', 'settlement', 'pay_123']);
    });
  });
});
