import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GetPaymentUseCase } from '../../../../src/modules/payment/application/use-cases/get-payment.use-case';
import { IPaymentRepository } from '../../../../src/modules/payment/domain/repositories/payment.repository';
import { Payment } from '../../../../src/modules/payment/domain/aggregates/payment.aggregate';
import { PaymentPricing } from '../../../../src/modules/payment/domain/value-objects/payment-pricing.value-object';

describe('GetPaymentUseCase Unit Tests', () => {
  let paymentRepo: IPaymentRepository;
  let useCase: GetPaymentUseCase;

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

    useCase = new GetPaymentUseCase(paymentRepo);
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
        offerId: 'off_test_1',
        acquisitionPipelineId: 'pipe_1',
        clientId,
        trainerId,
        pricing,
      },
      'pay_test_001',
    ).getValue()!;
  };

  it('should allow client to view own payment', async () => {
    const payment = createMockPayment('client_100', 'trainer_200');
    vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

    const result = await useCase.execute({
      paymentId: 'pay_test_001',
      userId: 'client_100',
      role: 'CLIENT',
    });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().id).toBe('pay_test_001');
    expect(result.getValue().clientId).toBe('client_100');
  });

  it('should reject client trying to view another client payment', async () => {
    const payment = createMockPayment('client_100', 'trainer_200');
    vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

    const result = await useCase.execute({
      paymentId: 'pay_test_001',
      userId: 'attacker_client_999',
      role: 'CLIENT',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('not authorized');
  });

  it('should allow trainer to view their assigned trainee payment', async () => {
    const payment = createMockPayment('client_100', 'trainer_200');
    vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

    const result = await useCase.execute({
      paymentId: 'pay_test_001',
      userId: 'trainer_200',
      role: 'TRAINER',
    });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().trainerId).toBe('trainer_200');
  });

  it('should reject trainer trying to view unrelated payment', async () => {
    const payment = createMockPayment('client_100', 'trainer_200');
    vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

    const result = await useCase.execute({
      paymentId: 'pay_test_001',
      userId: 'other_trainer_300',
      role: 'TRAINER',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('not authorized');
  });

  it('should allow admin to view any payment', async () => {
    const payment = createMockPayment('client_100', 'trainer_200');
    vi.mocked(paymentRepo.findById).mockResolvedValue(payment);

    const result = await useCase.execute({
      paymentId: 'pay_test_001',
      userId: 'admin_master',
      role: 'ADMIN',
    });

    expect(result.isSuccess).toBe(true);
  });

  it('should fail if payment does not exist', async () => {
    vi.mocked(paymentRepo.findById).mockResolvedValue(null);

    const result = await useCase.execute({
      paymentId: 'non_existent_pay',
      userId: 'admin_master',
      role: 'ADMIN',
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('was not found');
  });
});
