import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VerifyPaymentUseCase } from '../../../../src/modules/payment/application/use-cases/verify-payment.use-case';
import { IPaymentRepository } from '../../../../src/modules/payment/domain/repositories/payment.repository';
import { IPaymentGatewayPort } from '../../../../src/modules/payment/application/ports/payment-gateway.port';
import { Payment } from '../../../../src/modules/payment/domain/aggregates/payment.aggregate';
import { PaymentPricing } from '../../../../src/modules/payment/domain/value-objects/payment-pricing.value-object';
import { PaymentStatus } from '../../../../src/modules/payment/domain/enums/payment-status.enum';

describe('VerifyPaymentUseCase Unit Tests', () => {
  let paymentRepo: IPaymentRepository;
  let paymentGateway: IPaymentGatewayPort;
  let useCase: VerifyPaymentUseCase;

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
      existsForOffer: vi.fn(),
    };

    paymentGateway = {
      createOrder: vi.fn(),
      verifyPayment: vi.fn(),
      fetchPayment: vi.fn(),
      processRefund: vi.fn(),
    };

    useCase = new VerifyPaymentUseCase(paymentRepo, paymentGateway);
  });

  const createProcessingPayment = (clientId = 'client_100') => {
    const pricing = PaymentPricing.create({
      trainerFee: 8000,
      platformFee: 2000,
      totalAmount: 10000,
      currency: 'INR',
    }).getValue()!;

    const payment = Payment.create(
      {
        offerId: 'off_verify_1',
        acquisitionPipelineId: 'pipe_verify_1',
        clientId,
        trainerId: 'trainer_200',
        pricing,
      },
      'pay_verify_001',
    ).getValue()!;

    payment.startProcessing('order_rzp_order123');
    payment.clearEvents();
    return payment;
  };

  it('should successfully verify payment when gateway confirms signature and status', async () => {
    const payment = createProcessingPayment('client_100');
    vi.mocked(paymentRepo.findById).mockResolvedValue(payment);
    vi.mocked(paymentGateway.verifyPayment).mockResolvedValue({
      isValid: true,
      providerPaymentId: 'pay_rzp_payment456',
      providerOrderId: 'order_rzp_order123',
      amount: 10000,
      currency: 'INR',
      status: 'captured',
    });

    const result = await useCase.execute({
      paymentId: 'pay_verify_001',
      providerPaymentId: 'pay_rzp_payment456',
      providerOrderId: 'order_rzp_order123',
      providerSignature: 'valid_signature_hash',
      clientId: 'client_100',
    });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().status).toBe(PaymentStatus.SUCCESS);
    expect(result.getValue().providerPaymentId).toBe('pay_rzp_payment456');

    expect(payment.status).toBe(PaymentStatus.SUCCESS);
    expect(paymentRepo.save).toHaveBeenCalledWith(payment);
  });

  it('should return idempotent success if payment is already in SUCCESS status', async () => {
    const payment = createProcessingPayment('client_100');
    payment.markSuccess('pay_rzp_payment456');
    vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

    const result = await useCase.execute({
      paymentId: 'pay_verify_001',
      providerPaymentId: 'pay_rzp_payment456',
      providerOrderId: 'order_rzp_order123',
      providerSignature: 'valid_signature_hash',
      clientId: 'client_100',
    });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().status).toBe(PaymentStatus.SUCCESS);
    expect(paymentGateway.verifyPayment).not.toHaveBeenCalled();
  });

  it('should mark payment as FAILED and reject if gateway verification fails', async () => {
    const payment = createProcessingPayment('client_100');
    vi.mocked(paymentRepo.findById).mockResolvedValue(payment);
    vi.mocked(paymentGateway.verifyPayment).mockResolvedValue({
      isValid: false,
      providerPaymentId: 'pay_rzp_fake',
      providerOrderId: 'order_rzp_fake',
      amount: 10000,
      currency: 'INR',
      status: 'failed',
    });

    const result = await useCase.execute({
      paymentId: 'pay_verify_001',
      providerPaymentId: 'pay_rzp_fake',
      providerOrderId: 'order_rzp_fake',
      providerSignature: 'invalid_signature_hash',
      clientId: 'client_100',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('verification failed');
    expect(payment.status).toBe(PaymentStatus.FAILED);
    expect(paymentRepo.save).toHaveBeenCalledWith(payment);
  });

  it('should reject unauthorized client attempting to verify payment', async () => {
    const payment = createProcessingPayment('client_100');
    vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

    const result = await useCase.execute({
      paymentId: 'pay_verify_001',
      providerPaymentId: 'pay_rzp_payment456',
      providerOrderId: 'order_rzp_order123',
      providerSignature: 'valid_signature_hash',
      clientId: 'attacker_client_999',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('not authorized');
    expect(paymentGateway.verifyPayment).not.toHaveBeenCalled();
  });
});
