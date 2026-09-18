import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MarketplaceConsultationSubscriber } from '../../../../src/modules/marketplace/infrastructure/subscribers/marketplace-consultation.subscriber';
import { DomainEventDispatcher } from '../../../../src/shared/events/domain-event-dispatcher';
import { IAcquisitionPipelineRepository } from '../../../../src/modules/marketplace/domain/repositories/acquisition-pipeline.repository';
import { ConsultationCancelledEvent } from '../../../../src/modules/consultation/domain/events/consultation-cancelled.event';
import { CancellationActor } from '../../../../src/modules/consultation/domain/enums/cancellation-actor.enum';
import { AcquisitionPipeline } from '../../../../src/modules/marketplace/domain/aggregates/acquisition-pipeline.aggregate';
import { AcquisitionPipelineStatus } from '../../../../src/modules/marketplace/domain/enums/acquisition-pipeline-status.enum';
import { TrainerRequest } from '../../../../src/modules/marketplace/domain/entities/trainer-request.entity';
import { TrainerSnapshot } from '../../../../src/modules/marketplace/domain/value-objects/trainer-snapshot.value-object';
import { ILogger } from '../../../../src/shared/contracts/ILogger';

describe('MarketplaceConsultationSubscriber Unit Tests', () => {
  let dispatcher: DomainEventDispatcher;
  let pipelineRepo: IAcquisitionPipelineRepository;
  let logger: ILogger;
  let subscriber: MarketplaceConsultationSubscriber;

  const mockTrainerRequest = TrainerRequest.create({
    clientGoal: 'Build muscle and increase strength',
    clientMessage: 'I need structured programming',
  }).getValue();

  const mockTrainerSnapshot = TrainerSnapshot.create({
    trainerId: 'trainer_123',
    fullName: 'Jane Coach',
    headline: 'Certified Strength Coach',
    profileImage: 'https://example.com/jane.jpg',
    specializations: ['Hypertrophy'],
    yearsOfExperience: 6,
    averageRating: 4.9,
  }).getValue();

  beforeEach(() => {
    dispatcher = new DomainEventDispatcher();
    pipelineRepo = {
      save: vi.fn().mockResolvedValue(undefined),
      findById: vi.fn(),
      findByRequestId: vi.fn(),
      findActivePipeline: vi.fn(),
      findActivePipelineBetween: vi.fn(),
      findByClientId: vi.fn(),
      findByTrainerId: vi.fn(),
      findPendingByTrainer: vi.fn(),
      findHistory: vi.fn(),
    };
    logger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    };

    subscriber = new MarketplaceConsultationSubscriber(dispatcher, pipelineRepo, logger);
    subscriber.register();
  });

  it('should cancel active pipeline when ConsultationCancelledEvent is dispatched', async () => {
    const pipeline = AcquisitionPipeline.create(
      {
        clientId: 'client_123',
        trainerId: 'trainer_123',
        trainerRequest: mockTrainerRequest,
        trainerSnapshot: mockTrainerSnapshot,
        status: AcquisitionPipelineStatus.ACCEPTED,
      },
      'pipe_123',
    ).getValue();

    vi.spyOn(pipelineRepo, 'findActivePipelineBetween').mockResolvedValue(pipeline);

    const event = new ConsultationCancelledEvent(
      'consultation_123',
      'client_123',
      'trainer_123',
      CancellationActor.CLIENT,
      'Schedule conflict',
    );

    await dispatcher.dispatch(event);

    expect(pipelineRepo.findActivePipelineBetween).toHaveBeenCalledWith(
      'client_123',
      'trainer_123',
    );
    expect(pipeline.status).toBe(AcquisitionPipelineStatus.CANCELLED);
    expect(pipelineRepo.save).toHaveBeenCalledWith(pipeline);
  });

  it('should handle event idempotently if pipeline is already terminal', async () => {
    const pipeline = AcquisitionPipeline.create(
      {
        clientId: 'client_123',
        trainerId: 'trainer_123',
        trainerRequest: mockTrainerRequest,
        trainerSnapshot: mockTrainerSnapshot,
        status: AcquisitionPipelineStatus.CANCELLED,
      },
      'pipe_123',
    ).getValue();

    vi.spyOn(pipelineRepo, 'findActivePipelineBetween').mockResolvedValue(pipeline);

    const event = new ConsultationCancelledEvent(
      'consultation_123',
      'client_123',
      'trainer_123',
      CancellationActor.TRAINER,
      'Trainer emergency',
    );

    await dispatcher.dispatch(event);

    expect(pipelineRepo.save).not.toHaveBeenCalled();
    expect(logger.debug).toHaveBeenCalled();
  });

  it('should log warning safely if pipeline is not found', async () => {
    vi.spyOn(pipelineRepo, 'findActivePipelineBetween').mockResolvedValue(null);

    const event = new ConsultationCancelledEvent(
      'consultation_999',
      'client_999',
      'trainer_999',
      CancellationActor.CLIENT,
    );

    await dispatcher.dispatch(event);

    expect(pipelineRepo.save).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalled();
  });
});
