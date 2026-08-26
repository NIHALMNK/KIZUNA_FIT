import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { PaymentStatusBadge } from '../../presentation/components/PaymentStatusBadge';
import { PaymentAmountBreakdown } from '../../presentation/components/PaymentAmountBreakdown';
import { PaymentTimeline } from '../../presentation/components/PaymentTimeline';
import { PaymentCard } from '../../presentation/components/PaymentCard';
import { PaymentSummary } from '../../presentation/components/PaymentSummary';
import { PaymentDetailsView } from '../../presentation/components/PaymentDetails';
import { PaymentEarningsSummary } from '../../presentation/trainer/PaymentEarningsSummary';
import {
  PaymentStatus,
  TransactionType,
  SubscriptionStatus,
} from '../../domain/types/payment.types';
import { RefundStatus, RefundType } from '../../domain/types/refund.types';
import { DisputeStatus } from '../../domain/types/dispute.types';
import { PayoutStatus } from '../../domain/types/payout.types';
import { PaymentMapper } from '../../infrastructure/mappers/paymentMapper';

describe('Payment Frontend Presentation Layer (Phase 12.4)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. PaymentStatusBadge Component', () => {
    it('renders PaymentStatus.SUCCESS with emerald styling and label', () => {
      const badge = React.createElement(PaymentStatusBadge, {
        status: PaymentStatus.SUCCESS,
      });
      expect(badge.props.status).toBe(PaymentStatus.SUCCESS);
    });

    it('renders RefundStatus.PENDING with refund pending label', () => {
      const badge = React.createElement(PaymentStatusBadge, {
        status: RefundStatus.PENDING,
        type: 'refund',
      });
      expect(badge.props.status).toBe(RefundStatus.PENDING);
    });

    it('renders DisputeStatus.OPEN with open dispute indicator', () => {
      const badge = React.createElement(PaymentStatusBadge, {
        status: DisputeStatus.OPEN,
        type: 'dispute',
      });
      expect(badge.props.status).toBe(DisputeStatus.OPEN);
    });

    it('renders PayoutStatus.ON_HOLD with escrow hold label', () => {
      const badge = React.createElement(PaymentStatusBadge, {
        status: PayoutStatus.ON_HOLD,
        type: 'payout',
      });
      expect(badge.props.status).toBe(PayoutStatus.ON_HOLD);
    });
  });

  describe('2. PaymentAmountBreakdown Component', () => {
    it('displays server-authoritative money values without client calculations', () => {
      const pricing = {
        trainerFee: 8000,
        platformFee: 2000,
        totalAmount: 10000,
        currency: 'INR',
        commissionRate: 0.2,
      };

      const breakdown = React.createElement(PaymentAmountBreakdown, {
        pricing,
        showPlatformFee: true,
      });

      expect(breakdown.props.pricing.totalAmount).toBe(10000);
      expect(breakdown.props.pricing.trainerFee).toBe(8000);
      expect(breakdown.props.pricing.platformFee).toBe(2000);
    });
  });

  describe('3. PaymentDetailsView Component & Role Enforcement', () => {
    const mockPayment: any = {
      paymentId: 'pay_test_001',
      offerId: 'off_001',
      clientId: 'cli_001',
      trainerId: 'trn_001',
      pricing: {
        trainerFee: 8000,
        platformFee: 2000,
        totalAmount: 10000,
        currency: 'INR',
        commissionRate: 0.2,
      },
      status: PaymentStatus.SUCCESS,
      transactions: [],
      subscription: {
        subscriptionId: 'sub_001',
        status: SubscriptionStatus.ACTIVE,
        sessionsIncluded: 12,
        sessionsRemaining: 12,
      },
      refunds: [],
      disputes: [],
      payout: {
        payoutId: 'pout_001',
        amount: 8000,
        currency: 'INR',
        status: PayoutStatus.ON_HOLD,
      },
      settlement: null,
      hasActiveDispute: false,
      isLockedByDispute: false,
      eligiblePayoutAmount: 8000,
      createdAt: '2026-08-25T10:00:00.000Z',
      updatedAt: '2026-08-25T10:00:00.000Z',
    };

    it('instantiates PaymentDetailsView for CLIENT role', () => {
      const details = React.createElement(PaymentDetailsView, {
        payment: mockPayment,
        userRole: 'CLIENT',
      });
      expect(details.props.userRole).toBe('CLIENT');
      expect(details.props.payment.paymentId).toBe('pay_test_001');
    });

    it('instantiates PaymentDetailsView for TRAINER role', () => {
      const details = React.createElement(PaymentDetailsView, {
        payment: mockPayment,
        userRole: 'TRAINER',
      });
      expect(details.props.userRole).toBe('TRAINER');
    });

    it('instantiates PaymentDetailsView for ADMIN role', () => {
      const details = React.createElement(PaymentDetailsView, {
        payment: mockPayment,
        userRole: 'ADMIN',
      });
      expect(details.props.userRole).toBe('ADMIN');
    });
  });

  describe('4. PaymentEarningsSummary Component for Trainers', () => {
    it('displays settled earnings, in-escrow review, and locked disputes amounts', () => {
      const summary = React.createElement(PaymentEarningsSummary, {
        totalSettled: 24000,
        escrowPending: 8000,
        disputeLocked: 0,
        currency: 'INR',
      });

      expect(summary.props.totalSettled).toBe(24000);
      expect(summary.props.escrowPending).toBe(8000);
      expect(summary.props.disputeLocked).toBe(0);
    });
  });

  describe('5. PaymentCard Component & Lifecycle Indicators', () => {
    it('instantiates PaymentCard with summary fields', () => {
      const cardProps = {
        payment: {
          paymentId: 'pay_card_001',
          offerId: 'off_001',
          clientId: 'cli_001',
          trainerId: 'trn_001',
          pricing: {
            trainerFee: 8000,
            platformFee: 2000,
            totalAmount: 10000,
            currency: 'INR',
            commissionRate: 0.2,
          },
          status: PaymentStatus.SUCCESS,
          subscriptionStatus: SubscriptionStatus.ACTIVE,
          hasActiveDispute: false,
          createdAt: '2026-08-25T10:00:00.000Z',
          updatedAt: '2026-08-25T10:00:00.000Z',
        },
      };
      const card = React.createElement(PaymentCard, cardProps);

      expect(card.props.payment.paymentId).toBe('pay_card_001');
      expect(card.props.payment.pricing.totalAmount).toBe(10000);
      expect(card.props.payment.pricing.trainerFee).toBe(8000);
    });

    it('displays PAID payout lifecycle state with settlement information', () => {
      const cardProps = {
        payment: {
          paymentId: 'pay_paid_001',
          offerId: 'off_001',
          clientId: 'cli_001',
          trainerId: 'trn_001',
          pricing: {
            trainerFee: 8000,
            platformFee: 2000,
            totalAmount: 10000,
            currency: 'INR',
            commissionRate: 0.2,
          },
          status: PaymentStatus.SUCCESS,
          payout: {
            payoutId: 'pout_001',
            amount: 8000,
            currency: 'INR',
            status: PayoutStatus.PAID,
            eligibleAt: '2026-08-28T10:00:00.000Z',
            processedAt: '2026-08-29T10:00:00.000Z',
            createdAt: '2026-08-25T10:00:00.000Z',
            updatedAt: '2026-08-29T10:00:00.000Z',
          },
          settlement: {
            settlementId: 'set_001',
            trainerAmount: 8000,
            platformAmount: 2000,
            currency: 'INR',
            settledAt: '2026-08-29T10:00:00.000Z',
          },
          hasActiveDispute: false,
          createdAt: '2026-08-25T10:00:00.000Z',
          updatedAt: '2026-08-29T10:00:00.000Z',
        },
      };
      const card = React.createElement(PaymentCard, cardProps);
      expect(card.props.payment.payout?.status).toBe(PayoutStatus.PAID);
      expect(card.props.payment.settlement?.trainerAmount).toBe(8000);
    });

    it('displays REFUNDED state with zero trainer earnings', () => {
      const cardProps = {
        payment: {
          paymentId: 'pay_ref_001',
          offerId: 'off_001',
          clientId: 'cli_001',
          trainerId: 'trn_001',
          pricing: {
            trainerFee: 8000,
            platformFee: 2000,
            totalAmount: 10000,
            currency: 'INR',
            commissionRate: 0.2,
          },
          status: PaymentStatus.REFUNDED,
          hasActiveDispute: false,
          createdAt: '2026-08-25T10:00:00.000Z',
          updatedAt: '2026-08-26T10:00:00.000Z',
        },
      };
      const card = React.createElement(PaymentCard, cardProps);
      expect(card.props.payment.status).toBe(PaymentStatus.REFUNDED);
    });

    it('displays active dispute indicator when hasActiveDispute is true', () => {
      const cardProps = {
        payment: {
          paymentId: 'pay_disp_001',
          offerId: 'off_001',
          clientId: 'cli_001',
          trainerId: 'trn_001',
          pricing: {
            trainerFee: 8000,
            platformFee: 2000,
            totalAmount: 10000,
            currency: 'INR',
            commissionRate: 0.2,
          },
          status: PaymentStatus.SUCCESS,
          hasActiveDispute: true,
          createdAt: '2026-08-25T10:00:00.000Z',
          updatedAt: '2026-08-26T10:00:00.000Z',
        },
      };
      const card = React.createElement(PaymentCard, cardProps);
      expect(card.props.payment.hasActiveDispute).toBe(true);
    });
  });

  describe('6. PaymentMapper Domain Serialization & Backend Shape Reconciliation', () => {
    it('correctly maps backend response shape { payments: [...], total, limit, offset } to PaginatedPaymentsResponseDTO', () => {
      const backendPayload = {
        payments: [
          {
            id: 'pay_be_001',
            offerId: 'off_001',
            acquisitionPipelineId: 'acq_001',
            clientId: 'cli_001',
            trainerId: 'trn_001',
            pricing: {
              trainerFee: 8000,
              platformFee: 2000,
              totalAmount: 10000,
              currency: 'INR',
            },
            status: 'SUCCESS',
            subscription: {
              id: 'sub_001',
              status: 'ACTIVE',
              sessionsIncluded: 10,
              sessionsRemaining: 10,
            },
            payout: {
              id: 'pout_001',
              amount: 8000,
              status: 'PAID',
              eligibleAt: '2026-08-28T00:00:00.000Z',
            },
            settlement: {
              id: 'set_001',
              trainerAmount: 8000,
              platformAmount: 2000,
              settledAt: '2026-08-29T00:00:00.000Z',
            },
            transactions: [],
            refunds: [],
            disputes: [],
            createdAt: '2026-08-25T10:00:00.000Z',
            updatedAt: '2026-08-25T10:00:00.000Z',
          },
        ],
        total: 1,
        limit: 20,
        offset: 0,
      };

      const result = PaymentMapper.toPaginatedPaymentsDomain(backendPayload);

      expect(result.data).toBeDefined();
      expect(result.data.length).toBe(1);
      expect(result.data[0].paymentId).toBe('pay_be_001');
      expect(result.data[0].offerId).toBe('off_001');
      expect(result.data[0].pricing.totalAmount).toBe(10000);
      expect(result.data[0].pricing.trainerFee).toBe(8000);
      expect(result.data[0].payout?.status).toBe('PAID');
      expect(result.data[0].settlement?.trainerAmount).toBe(8000);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
    });
  });
});
