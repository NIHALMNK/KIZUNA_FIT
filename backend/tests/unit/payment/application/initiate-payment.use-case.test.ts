import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InitiatePaymentUseCase } from '../../../../src/modules/payment/application/use-cases/initiate-payment.use-case';
import { IPaymentRepository } from '../../../../src/modules/payment/domain/repositories/payment.repository';
import { ICoachingOfferRepository } from '../../../../src/modules/offer/domain/repositories/coaching-offer.repository';
import { IPaymentGatewayPort } from '../../../../src/modules/payment/application/ports/payment-gateway.port';
import { CoachingOffer } from '../../../../src/modules/offer/domain/aggregates/coaching-offer.aggregate';
import { CoachingOfferStatus } from '../../../../src/modules/offer/domain/enums/coaching-offer-status.enum';
import { PricingSnapshot } from '../../../../src/modules/offer/domain/value-objects/pricing-snapshot.value-object';
import { ScopeSnapshot } from '../../../../src/modules/offer/domain/value-objects/scope-snapshot.value-object';
import { PaymentStatus } from '../../../../src/modules/payment/domain/enums/payment-status.enum';
import { Payment } from '../../../../src/modules/payment/domain/aggregates/payment.aggregate';
import { PaymentPricing } from '../../../../src/modules/payment/domain/value-objects/payment-pricing.value-object';

describe('InitiatePaymentUseCase Unit Tests', () => {
  let paymentRepo: IPaymentRepository;
  let offerRepo: ICoachingOfferRepository;
  let paymentGateway: IPaymentGatewayPort;
  let useCase: InitiatePaymentUseCase;

  beforeEach(() => {
    paymentRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findByOfferId: vi.fn(),
      findByProviderOrderId: vi.fn(),
      findByProviderPaymentId: vi.fn(),
      listByClientId: vi.fn(),
      listByTrainerId: vi.fn(),
      listAll: vi.fn(),
      existsForOffer: vi.fn().mockResolvedValue(false),
    };

    offerRepo = {
      save: vi.fn(),
      findById: vi.fn(),
      findByConsultationId: vi.fn(),
      findByAcquisitionPipelineId: vi.fn(),
      findByClientId: vi.fn(),
      findByTrainerId: vi.fn(),
      findExpiredPendingOffers: vi.fn(),
    };

    paymentGateway = {
      createOrder: vi.fn().mockResolvedValue({
        providerOrderId: 'order_rzp_mock_123',
        amount: 10000,
        currency: 'INR',
        keyId: 'rzp_test_key123',
      }),
      verifyPayment: vi.fn(),
      fetchPayment: vi.fn(),
      processRefund: vi.fn(),
    };

    useCase = new InitiatePaymentUseCase(paymentRepo, offerRepo, paymentGateway);
  });

  const createMockOffer = (
    status: CoachingOfferStatus = CoachingOfferStatus.ACCEPTED,
    clientId: string = 'client_123',
  ): CoachingOffer => {
    const pricing = PricingSnapshot.create({
      trainerFee: 9000,
      platformFee: 1000,
      totalAmount: 10000,
      currency: 'INR',
      commissionRate: 0.1,
    }).getValue();

    const scope = ScopeSnapshot.create({
      durationDays: 30,
      planType: 'PRO',
      includedFeatures: ['Custom Diet Plan'],
    }).getValue();

    return CoachingOffer.create(
      {
        acquisitionPipelineId: 'pipe_123',
        consultationId: 'cons_123',
        clientId,
        trainerId: 'trainer_456',
        pricingSnapshot: pricing,
        scopeSnapshot: scope,
        status,
        expiresAt: new Date(Date.now() + 86400000),
      },
      'offer_123',
    ).getValue();
  };

  it('should successfully initiate payment for an ACCEPTED offer owned by client', async () => {
    const offer = createMockOffer(CoachingOfferStatus.ACCEPTED, 'client_123');
    vi.mocked(offerRepo.findById).mockResolvedValue(offer);

    const result = await useCase.execute({
      offerId: 'offer_123',
      clientId: 'client_123',
    });

    expect(result.isSuccess).toBe(true);
    const value = result.getValue();
    expect(value.offerId).toBe('offer_123');
    expect(value.providerOrderId).toBe('order_rzp_mock_123');
    expect(value.keyId).toBe('rzp_test_key123');
    expect(value.totalAmount).toBe(10000);
    expect(value.trainerFee).toBe(9000);
    expect(value.platformFee).toBe(1000);
    expect(value.status).toBe(PaymentStatus.PROCESSING);

    expect(paymentGateway.createOrder).toHaveBeenCalledWith({
      paymentId: expect.any(String),
      amount: 10000,
      currency: 'INR',
      metadata: {
        offerId: 'offer_123',
        clientId: 'client_123',
        trainerId: 'trainer_456',
        acquisitionPipelineId: 'pipe_123',
      },
    });

    expect(paymentRepo.save).toHaveBeenCalledTimes(1);
  });

  it('should fail if offer does not exist', async () => {
    vi.mocked(offerRepo.findById).mockResolvedValue(null);

    const result = await useCase.execute({
      offerId: 'non_existent_offer',
      clientId: 'client_123',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('was not found');
    expect(paymentGateway.createOrder).not.toHaveBeenCalled();
    expect(paymentRepo.save).not.toHaveBeenCalled();
  });

  it('should fail if offer is not in ACCEPTED status (e.g. SENT)', async () => {
    const offer = createMockOffer(CoachingOfferStatus.SENT, 'client_123');
    vi.mocked(offerRepo.findById).mockResolvedValue(offer);

    const result = await useCase.execute({
      offerId: 'offer_123',
      clientId: 'client_123',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('ACCEPTED');
    expect(paymentGateway.createOrder).not.toHaveBeenCalled();
    expect(paymentRepo.save).not.toHaveBeenCalled();
  });

  it('should fail if unauthorized client attempts to initiate payment', async () => {
    const offer = createMockOffer(CoachingOfferStatus.ACCEPTED, 'client_123');
    vi.mocked(offerRepo.findById).mockResolvedValue(offer);

    const result = await useCase.execute({
      offerId: 'offer_123',
      clientId: 'attacker_client_999',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('not authorized');
    expect(paymentGateway.createOrder).not.toHaveBeenCalled();
    expect(paymentRepo.save).not.toHaveBeenCalled();
  });

  it('should mark payment as FAILED and persist it if Razorpay order creation fails', async () => {
    const offer = createMockOffer(CoachingOfferStatus.ACCEPTED, 'client_123');
    vi.mocked(offerRepo.findById).mockResolvedValue(offer);
    vi.mocked(paymentGateway.createOrder).mockRejectedValue(
      new Error('Gateway connection timeout'),
    );

    const result = await useCase.execute({
      offerId: 'offer_123',
      clientId: 'client_123',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('Failed to initiate payment with gateway');
    expect(paymentRepo.save).toHaveBeenCalledTimes(1);

    // Verify saved payment is in FAILED status
    const savedPayment = vi.mocked(paymentRepo.save).mock.calls[0][0];
    expect(savedPayment.status).toBe(PaymentStatus.FAILED);
  });

  it('should idempotently reuse existing PROCESSING payment without creating a duplicate order or aggregate', async () => {
    const offer = createMockOffer(CoachingOfferStatus.ACCEPTED, 'client_123');
    vi.mocked(offerRepo.findById).mockResolvedValue(offer);

    const existingPaymentResult = Payment.create({
      offerId: 'offer_123',
      acquisitionPipelineId: 'pipe_123',
      clientId: 'client_123',
      trainerId: 'trainer_456',
      pricing: PaymentPricing.create({
        trainerFee: 9000,
        platformFee: 1000,
        totalAmount: 10000,
        currency: 'INR',
      }).getValue()!,
    });
    const existingPayment = existingPaymentResult.getValue()!;
    existingPayment.startProcessing('order_existing_rzp_456');

    vi.mocked(paymentRepo.findByOfferId).mockResolvedValue(existingPayment);
    if (paymentGateway.getKeyId) {
      vi.mocked(paymentGateway.getKeyId).mockReturnValue('rzp_test_key123');
    }

    const result = await useCase.execute({
      offerId: 'offer_123',
      clientId: 'client_123',
    });

    expect(result.isSuccess).toBe(true);
    const value = result.getValue();
    expect(value.paymentId).toBe(existingPayment.paymentId);
    expect(value.providerOrderId).toBe('order_existing_rzp_456');
    // Order was NOT recreated
    expect(paymentGateway.createOrder).not.toHaveBeenCalled();
    // Payment was NOT resaved
    expect(paymentRepo.save).not.toHaveBeenCalled();
  });

  it('should fail with error if existing payment has already reached SUCCESS', async () => {
    const offer = createMockOffer(CoachingOfferStatus.ACCEPTED, 'client_123');
    vi.mocked(offerRepo.findById).mockResolvedValue(offer);

    const existingPaymentResult = Payment.create({
      offerId: 'offer_123',
      acquisitionPipelineId: 'pipe_123',
      clientId: 'client_123',
      trainerId: 'trainer_456',
      pricing: PaymentPricing.create({
        trainerFee: 9000,
        platformFee: 1000,
        totalAmount: 10000,
        currency: 'INR',
      }).getValue()!,
    });
    const existingPayment = existingPaymentResult.getValue()!;
    existingPayment.startProcessing('order_existing_rzp_456');
    existingPayment.markSuccess('pay_rzp_captured_789');

    vi.mocked(paymentRepo.findByOfferId).mockResolvedValue(existingPayment);

    const result = await useCase.execute({
      offerId: 'offer_123',
      clientId: 'client_123',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('already exists and has succeeded');
    expect(paymentGateway.createOrder).not.toHaveBeenCalled();
  });
});
