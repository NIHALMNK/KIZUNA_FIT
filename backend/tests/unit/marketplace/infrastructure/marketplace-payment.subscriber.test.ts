import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MarketplacePaymentSubscriber } from '../../../../src/modules/marketplace/infrastructure/subscribers/marketplace-payment.subscriber';
import { DomainEventDispatcher } from '../../../../src/shared/events/domain-event-dispatcher';
import { IAcquisitionPipelineRepository } from '../../../../src/modules/marketplace/domain/repositories/acquisition-pipeline.repository';
import { ILogger } from '../../../../src/shared/contracts/ILogger';
import { PaymentSucceededEvent } from '../../../../src/modules/payment/domain/events/payment-succeeded.event';
import { AcquisitionPipeline } from '../../../../src/modules/marketplace/domain/aggregates/acquisition-pipeline.aggregate';
import { TrainerRequest } from '../../../../src/modules/marketplace/domain/entities/trainer-request.entity';
import { TrainerSnapshot } from '../../../../src/modules/marketplace/domain/value-objects/trainer-snapshot.value-object';
import { AcquisitionPipelineStatus } from '../../../../src/modules/marketplace/domain/enums/acquisition-pipeline-status.enum';

describe('MarketplacePaymentSubscriber Unit Tests', () => {
  let dispatcher: DomainEventDispatcher;
  let pipelineRepo: IAcquisitionPipelineRepository;
  let logger: ILogger;
  let subscriber: MarketplacePaymentSubscriber;

  beforeEach(() => {
    dispatcher = new DomainEventDispatcher();
    pipelineRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findActivePipelineBetween: vi.fn(),
      findActivePipelineForClient: vi.fn(),
      findActivePipelinesForTrainer: vi.fn(),
      findAllPipelinesForClient: vi.fn(),
      findAllPipelinesForTrainer: vi.fn(),
      findRecentHistoryForClient: vi.fn(),
      findRecentHistoryForTrainer: vi.fn(),
    };

    logger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    };

    subscriber = new MarketplacePaymentSubscriber(dispatcher, pipelineRepo, logger);
    subscriber.register();
  });

  const mockTrainerRequest = TrainerRequest.create({
    clientGoal: 'Build muscle and increase strength',
    clientMessage: 'I need structured programming',
  }).getValue();

  const mockTrainerSnapshot = TrainerSnapshot.create({
    trainerId: 'trainer_200',
    fullName: 'Jane Coach',
    headline: 'Certified Strength Coach',
    profileImage: 'https://example.com/jane.jpg',
    specializations: ['Hypertrophy'],
    yearsOfExperience: 6,
    averageRating: 4.9,
    totalReviews: 10,
  }).getValue();

  const createAcceptedOfferPipeline = () => {
    const pipeline = AcquisitionPipeline.create(
      {
        clientId: 'client_100',
        trainerId: 'trainer_200',
        trainerRequest: mockTrainerRequest,
        trainerSnapshot: mockTrainerSnapshot,
      },
      'pipe_test_100',
    ).getValue();

    pipeline.accept();
    pipeline.scheduleConsultation();
    pipeline.completeConsultation();
    pipeline.sendOffer();
    pipeline.acceptOffer();
    pipeline.clearEvents();
    return pipeline;
  };

  it('should transition pipeline from OFFER_ACCEPTED to PAYMENT_COMPLETED then CONVERTED and persist', async () => {
    const pipeline = createAcceptedOfferPipeline();
    vi.mocked(pipelineRepo.findById).mockResolvedValue(pipeline);

    const event = new PaymentSucceededEvent(
      'pay_123',
      'off_456',
      pipeline.id,
      'client_100',
      'trainer_200',
      10000,
      8000,
      2000,
      'INR',
      'sub_123',
      'INV-2026-0001',
    );

    await dispatcher.dispatch(event);

    expect(pipeline.status).toBe(AcquisitionPipelineStatus.CONVERTED);
    expect(pipelineRepo.save).toHaveBeenCalledWith(pipeline);
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(`Successfully converted AcquisitionPipeline '${pipeline.id}'`),
    );
  });

  it('should handle duplicate events idempotently (2x, 3x) without throwing or double converting', async () => {
    const pipeline = createAcceptedOfferPipeline();
    vi.mocked(pipelineRepo.findById).mockResolvedValue(pipeline);

    const event = new PaymentSucceededEvent(
      'pay_123',
      'off_456',
      pipeline.id,
      'client_100',
      'trainer_200',
      10000,
      8000,
      2000,
      'INR',
      'sub_123',
      'INV-2026-0001',
    );

    // Dispatch first time
    await dispatcher.dispatch(event);
    expect(pipeline.status).toBe(AcquisitionPipelineStatus.CONVERTED);
    expect(pipelineRepo.save).toHaveBeenCalledTimes(1);

    // Dispatch second time
    await dispatcher.dispatch(event);
    expect(pipeline.status).toBe(AcquisitionPipelineStatus.CONVERTED);
    expect(pipelineRepo.save).toHaveBeenCalledTimes(1); // Not saved again

    // Dispatch third time
    await dispatcher.dispatch(event);
    expect(pipeline.status).toBe(AcquisitionPipelineStatus.CONVERTED);
    expect(pipelineRepo.save).toHaveBeenCalledTimes(1);
  });

  it('should cleanly skip if pipeline is already CONVERTED', async () => {
    const pipeline = createAcceptedOfferPipeline();
    pipeline.markPaymentCompleted();
    pipeline.convert();
    vi.mocked(pipelineRepo.findById).mockResolvedValue(pipeline);

    const event = new PaymentSucceededEvent(
      'pay_123',
      'off_456',
      pipeline.id,
      'client_100',
      'trainer_200',
      10000,
      8000,
      2000,
      'INR',
      'sub_123',
      'INV-2026-0001',
    );

    await dispatcher.dispatch(event);

    expect(pipelineRepo.save).not.toHaveBeenCalled();
    expect(logger.debug).toHaveBeenCalledWith(
      expect.stringContaining('is already CONVERTED. Skipping.'),
    );
  });

  it('should log warning and exit cleanly if pipeline is not found', async () => {
    vi.mocked(pipelineRepo.findById).mockResolvedValue(null);
    vi.mocked(pipelineRepo.findActivePipelineBetween).mockResolvedValue(null);

    const event = new PaymentSucceededEvent(
      'pay_123',
      'off_456',
      'non_existent_pipe',
      'client_100',
      'trainer_200',
      10000,
      8000,
      2000,
      'INR',
      'sub_123',
      'INV-2026-0001',
    );

    await dispatcher.dispatch(event);

    expect(pipelineRepo.save).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('No acquisition pipeline found'),
    );
  });

  it('should catch repository errors and log them without bubbling exception to caller', async () => {
    const pipeline = createAcceptedOfferPipeline();
    vi.mocked(pipelineRepo.findById).mockResolvedValue(pipeline);
    vi.mocked(pipelineRepo.save).mockRejectedValue(new Error('Database lock failure'));

    const event = new PaymentSucceededEvent(
      'pay_123',
      'off_456',
      pipeline.id,
      'client_100',
      'trainer_200',
      10000,
      8000,
      2000,
      'INR',
      'sub_123',
      'INV-2026-0001',
    );

    // Must not throw
    await expect(dispatcher.dispatch(event)).resolves.not.toThrow();

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Failed to process PaymentSucceededEvent'),
      expect.any(Object),
    );
  });
});
