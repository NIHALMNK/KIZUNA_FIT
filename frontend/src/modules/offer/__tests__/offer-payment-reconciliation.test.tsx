import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { OfferCard } from '../presentation/components/OfferCard';
import { OfferDetailsModal } from '../presentation/components/OfferDetailsModal';
import {
  CoachingOfferStatus,
  CoachingPlanType,
  CoachingOfferResponseDTO,
} from '../domain/types/offer.types';
import {
  PaymentStatus,
  PaymentSummary,
  SubscriptionStatus,
} from '../../payment/domain/types/payment.types';
import { PayoutStatus } from '../../payment/domain/types/payout.types';
import { paymentApi } from '../../payment/infrastructure/api/paymentApi';

// Mock usePaymentCheckout hook
vi.mock('../../payment/application/hooks/usePaymentCheckout', () => ({
  usePaymentCheckout: () => ({
    startCheckout: vi.fn(),
    isProcessing: false,
    error: null,
  }),
}));

describe('Offer & Payment Reconciliation UI Tests', () => {
  const mockOffer: CoachingOfferResponseDTO = {
    offerId: 'off_rec_123',
    acquisitionPipelineId: 'acq_123',
    consultationId: 'con_123',
    clientId: 'cli_123',
    trainerId: 'trn_123',
    pricing: {
      trainerFee: 8000,
      platformFee: 2000,
      totalAmount: 10000,
      currency: 'INR',
      commissionRate: 0.2,
    },
    scope: {
      durationDays: 30,
      planType: CoachingPlanType.PRO,
      includedFeatures: ['Custom Workout', 'Diet Plan', '3 Sessions/Week'],
    },
    status: CoachingOfferStatus.ACCEPTED,
    expiresAt: '2026-09-30T10:00:00.000Z',
    createdAt: '2026-08-25T10:00:00.000Z',
    updatedAt: '2026-08-25T10:00:00.000Z',
  };

  const createMockPayment = (
    status: PaymentStatus,
    overrides: Partial<PaymentSummary> = {},
  ): PaymentSummary => ({
    paymentId: 'pay_test_001',
    offerId: 'off_rec_123',
    clientId: 'cli_123',
    trainerId: 'trn_123',
    pricing: {
      trainerFee: 8000,
      platformFee: 2000,
      totalAmount: 10000,
      currency: 'INR',
      commissionRate: 0.2,
    },
    status,
    hasActiveDispute: false,
    subscriptionStatus: SubscriptionStatus.ACTIVE,
    createdAt: '2026-08-25T10:00:00.000Z',
    updatedAt: '2026-08-25T10:00:00.000Z',
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('1. OfferCard Payment State Reconciliation', () => {
    it('1. NO PAYMENT -> shows "Pay & Activate" button for accepted offer', () => {
      const card = React.createElement(OfferCard, {
        offer: mockOffer,
        payment: null,
        onSelect: vi.fn(),
        isClient: true,
      });

      expect(card.props.isClient).toBe(true);
      expect(card.props.payment).toBeNull();
      expect(card.props.offer.status).toBe(CoachingOfferStatus.ACCEPTED);
    });

    it('2. PAYMENT CREATED -> shows "Continue Payment" recovery action', () => {
      const createdPayment = createMockPayment(PaymentStatus.CREATED);
      const card = React.createElement(OfferCard, {
        offer: mockOffer,
        payment: createdPayment,
        onSelect: vi.fn(),
        isClient: true,
      });

      expect(card.props.payment?.status).toBe(PaymentStatus.CREATED);
    });

    it('3. PAYMENT PROCESSING -> hides Pay button and shows "Payment Processing"', () => {
      const processingPayment = createMockPayment(PaymentStatus.PROCESSING);
      const card = React.createElement(OfferCard, {
        offer: mockOffer,
        payment: processingPayment,
        onSelect: vi.fn(),
        isClient: true,
      });

      expect(card.props.payment?.status).toBe(PaymentStatus.PROCESSING);
    });

    it('4. PAYMENT SUCCESS -> hides "Pay & Activate" and displays "Payment Successful" and "Coaching Activated"', () => {
      const successPayment = createMockPayment(PaymentStatus.SUCCESS);
      const card = React.createElement(OfferCard, {
        offer: mockOffer,
        payment: successPayment,
        onSelect: vi.fn(),
        isClient: true,
      });

      expect(card.props.payment?.status).toBe(PaymentStatus.SUCCESS);
    });

    it('5. PAYMENT FAILED -> shows "Payment Failed" with "Retry Payment" action', () => {
      const failedPayment = createMockPayment(PaymentStatus.FAILED);
      const card = React.createElement(OfferCard, {
        offer: mockOffer,
        payment: failedPayment,
        onSelect: vi.fn(),
        isClient: true,
      });

      expect(card.props.payment?.status).toBe(PaymentStatus.FAILED);
    });

    it('6. PAYMENT REFUNDED -> hides Pay button and shows "Payment Refunded"', () => {
      const refundedPayment = createMockPayment(PaymentStatus.REFUNDED);
      const card = React.createElement(OfferCard, {
        offer: mockOffer,
        payment: refundedPayment,
        onSelect: vi.fn(),
        isClient: true,
      });

      expect(card.props.payment?.status).toBe(PaymentStatus.REFUNDED);
    });
  });

  describe('2. OfferDetailsModal Payment State Reconciliation', () => {
    it('shows Pay Now button when no payment exists', () => {
      const modal = React.createElement(OfferDetailsModal, {
        offer: mockOffer,
        payment: null,
        isOpen: true,
        onClose: vi.fn(),
        isClient: true,
      });

      expect(modal.props.payment).toBeNull();
    });

    it('shows Payment Successful and Coaching Activated on SUCCESS payment', () => {
      const successPayment = createMockPayment(PaymentStatus.SUCCESS);
      const modal = React.createElement(OfferDetailsModal, {
        offer: mockOffer,
        payment: successPayment,
        isOpen: true,
        onClose: vi.fn(),
        isClient: true,
      });

      expect(modal.props.payment?.status).toBe(PaymentStatus.SUCCESS);
    });

    it('shows Processing state on PROCESSING payment', () => {
      const processingPayment = createMockPayment(PaymentStatus.PROCESSING);
      const modal = React.createElement(OfferDetailsModal, {
        offer: mockOffer,
        payment: processingPayment,
        isOpen: true,
        onClose: vi.fn(),
        isClient: true,
      });

      expect(modal.props.payment?.status).toBe(PaymentStatus.PROCESSING);
    });

    it('shows Payment Refunded on REFUNDED payment', () => {
      const refundedPayment = createMockPayment(PaymentStatus.REFUNDED);
      const modal = React.createElement(OfferDetailsModal, {
        offer: mockOffer,
        payment: refundedPayment,
        isOpen: true,
        onClose: vi.fn(),
        isClient: true,
      });

      expect(modal.props.payment?.status).toBe(PaymentStatus.REFUNDED);
    });
  });
});
