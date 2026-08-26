import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ListPaymentsUseCase } from '../../../../src/modules/payment/application/use-cases/list-payments.use-case';
import { IPaymentRepository } from '../../../../src/modules/payment/domain/repositories/payment.repository';
import { Payment } from '../../../../src/modules/payment/domain/aggregates/payment.aggregate';
import { PaymentPricing } from '../../../../src/modules/payment/domain/value-objects/payment-pricing.value-object';

describe('ListPaymentsUseCase Unit Tests', () => {
  let paymentRepo: IPaymentRepository;
  let useCase: ListPaymentsUseCase;

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

    useCase = new ListPaymentsUseCase(paymentRepo);
  });

  const createMockPayment = (id: string, clientId: string, trainerId: string) => {
    const pricing = PaymentPricing.create({
      trainerFee: 8000,
      platformFee: 2000,
      totalAmount: 10000,
      currency: 'INR',
    }).getValue()!;

    return Payment.create(
      {
        offerId: `off_${id}`,
        acquisitionPipelineId: `pipe_${id}`,
        clientId,
        trainerId,
        pricing,
      },
      id,
    ).getValue()!;
  };

  it('should list payments for CLIENT by clientId', async () => {
    const p1 = createMockPayment('pay_1', 'client_1', 'trainer_1');
    const p2 = createMockPayment('pay_2', 'client_1', 'trainer_2');
    vi.mocked(paymentRepo.listByClientId).mockResolvedValue([p1, p2]);

    const result = await useCase.execute({
      userId: 'client_1',
      role: 'CLIENT',
      limit: 10,
      offset: 0,
    });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().payments.length).toBe(2);
    expect(paymentRepo.listByClientId).toHaveBeenCalledWith('client_1', 10, 0);
  });

  it('should list payments for TRAINER by trainerId', async () => {
    const p1 = createMockPayment('pay_1', 'client_1', 'trainer_X');
    vi.mocked(paymentRepo.listByTrainerId).mockResolvedValue([p1]);

    const result = await useCase.execute({
      userId: 'trainer_X',
      role: 'TRAINER',
    });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().payments.length).toBe(1);
    expect(paymentRepo.listByTrainerId).toHaveBeenCalledWith('trainer_X', 20, 0);
  });

  it('should list all payments for ADMIN', async () => {
    const p1 = createMockPayment('pay_1', 'client_1', 'trainer_1');
    const p2 = createMockPayment('pay_2', 'client_2', 'trainer_2');
    vi.mocked(paymentRepo.listAll).mockResolvedValue([p1, p2]);

    const result = await useCase.execute({
      userId: 'admin_1',
      role: 'ADMIN',
    });

    expect(result.isSuccess).toBe(true);
    expect(result.getValue().payments.length).toBe(2);
    expect(paymentRepo.listAll).toHaveBeenCalledWith(20, 0);
  });
});
