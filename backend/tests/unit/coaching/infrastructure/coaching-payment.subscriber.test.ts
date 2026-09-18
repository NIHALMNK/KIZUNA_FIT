import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CoachingPaymentSubscriber } from '../../../../src/modules/coaching/infrastructure/subscribers/coaching-payment.subscriber';
import { DomainEventDispatcher } from '../../../../src/shared/events/domain-event-dispatcher';
import { CreateCoachingRelationshipUseCase } from '../../../../src/modules/coaching/application/use-cases/create-coaching-relationship.use-case';
import { ILogger } from '../../../../src/shared/contracts/ILogger';
import { PaymentSucceededEvent } from '../../../../src/modules/payment/domain/events/payment-succeeded.event';

describe('CoachingPaymentSubscriber Unit Tests', () => {
  let mockDispatcher: DomainEventDispatcher;
  let mockUseCase: CreateCoachingRelationshipUseCase;
  let mockLogger: ILogger;
  let subscriber: CoachingPaymentSubscriber;
  let eventHandler: (event: PaymentSucceededEvent) => Promise<void>;

  beforeEach(() => {
    mockDispatcher = {
      register: vi.fn().mockImplementation((_name, handler) => {
        eventHandler = handler;
      }),
    } as unknown as DomainEventDispatcher;

    mockUseCase = {
      execute: vi.fn().mockResolvedValue({ relationshipId: 'rel_123' }),
    } as unknown as CreateCoachingRelationshipUseCase;

    mockLogger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    } as unknown as ILogger;

    subscriber = new CoachingPaymentSubscriber(mockDispatcher, mockUseCase, mockLogger);
    subscriber.register();
  });

  it('should register for PaymentSucceededEvent on dispatcher', () => {
    expect(mockDispatcher.register).toHaveBeenCalledWith(
      'PaymentSucceededEvent',
      expect.any(Function),
    );
  });

  it('should process valid PaymentSucceededEvent and invoke CreateCoachingRelationshipUseCase', async () => {
    const event = new PaymentSucceededEvent(
      'pay_100',
      'off_100',
      'pipe_100',
      'usr_client_01',
      'usr_trainer_01',
      10000,
      9000,
      1000,
      'INR',
      'sub_100',
      'INV-001',
    );

    await eventHandler(event);

    expect(mockUseCase.execute).toHaveBeenCalledWith({
      acquisitionPipelineId: 'pipe_100',
      paymentId: 'pay_100',
      subscriptionId: 'sub_100',
      clientId: 'usr_client_01',
      trainerId: 'usr_trainer_01',
    });
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining(
        "Successfully created/verified ACTIVE coaching relationship for payment 'pay_100'",
      ),
    );
  });

  it('should ignore event when required fields are missing', async () => {
    const event = new PaymentSucceededEvent(
      '',
      'off_100',
      'pipe_100',
      '',
      '',
      10000,
      9000,
      1000,
      'INR',
      'sub_100',
      'INV-001',
    );

    await eventHandler(event);

    expect(mockUseCase.execute).not.toHaveBeenCalled();
    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringContaining('Missing required fields in PaymentSucceededEvent'),
    );
  });

  it('should handle duplicate creation error safely without throwing', async () => {
    (mockUseCase.execute as any).mockRejectedValue(
      new Error('A coaching relationship already exists for payment pay_100'),
    );

    const event = new PaymentSucceededEvent(
      'pay_100',
      'off_100',
      'pipe_100',
      'usr_client_01',
      'usr_trainer_01',
      10000,
      9000,
      1000,
      'INR',
      'sub_100',
      'INV-001',
    );

    await expect(eventHandler(event)).resolves.not.toThrow();
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringContaining('Skipping duplicate creation'),
    );
  });
});
