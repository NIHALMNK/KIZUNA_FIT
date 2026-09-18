import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetInvoiceUseCase } from '../../../../src/modules/payment/application/use-cases/get-invoice.use-case';
import { IPaymentRepository } from '../../../../src/modules/payment/domain/repositories/payment.repository';
import { Payment } from '../../../../src/modules/payment/domain/aggregates/payment.aggregate';
import { PaymentPricing } from '../../../../src/modules/payment/domain/value-objects/payment-pricing.value-object';

describe('GetInvoiceUseCase Unit Tests', () => {
  let paymentRepo: IPaymentRepository;
  let useCase: GetInvoiceUseCase;

  beforeEach(() => {
    paymentRepo = {
      save: vi.fn(),
      findById: vi.fn(),
      findByOfferId: vi.fn(),
      findByProviderOrderId: vi.fn(),
      findByProviderPaymentId: vi.fn(),
      listByClientId: vi.fn(),
      listByTrainerId: vi.fn(),
      listAll: vi.fn(),
      existsForOffer: vi.fn(),
    };

    useCase = new GetInvoiceUseCase(paymentRepo);
  });

  const createMockPayment = (clientId = 'client_100', trainerId = 'trainer_200') => {
    const pricing = PaymentPricing.create({
      trainerFee: 8000,
      platformFee: 2000,
      totalAmount: 10000,
      currency: 'INR',
    }).getValue()!;

    return Payment.create(
      {
        offerId: 'off_inv_1',
        acquisitionPipelineId: 'pipe_1',
        clientId,
        trainerId,
        pricing,
      },
      'pay_inv_001',
    ).getValue()!;
  };

  it('should allow client to view invoice of own payment', async () => {
    const payment = createMockPayment('client_100', 'trainer_200');
    vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

    const result = await useCase.execute({
      paymentId: 'pay_inv_001',
      userId: 'client_100',
      role: 'CLIENT',
    });

    expect(result.isSuccess).toBe(true);
    const invoice = result.getValue();
    expect(invoice.paymentId).toBe('pay_inv_001');
    expect(invoice.totalAmount).toBe(10000);
    expect(invoice.invoiceNumber).toBeDefined();
  });

  it('should reject unauthorized user attempting to access invoice', async () => {
    const payment = createMockPayment('client_100', 'trainer_200');
    vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

    const result = await useCase.execute({
      paymentId: 'pay_inv_001',
      userId: 'stranger_user',
      role: 'CLIENT',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('not authorized');
  });
});
