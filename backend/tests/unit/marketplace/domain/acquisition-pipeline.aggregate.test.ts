import { describe, it, expect } from 'vitest';
import { AcquisitionPipeline } from '../../../../src/modules/marketplace/domain/aggregates/acquisition-pipeline.aggregate';
import { TrainerRequest } from '../../../../src/modules/marketplace/domain/entities/trainer-request.entity';
import { TrainerSnapshot } from '../../../../src/modules/marketplace/domain/value-objects/trainer-snapshot.value-object';
import { AcquisitionPipelineStatus } from '../../../../src/modules/marketplace/domain/enums/acquisition-pipeline-status.enum';
import { TrainerRequestStatus } from '../../../../src/modules/marketplace/domain/enums/trainer-request-status.enum';
import { ClientCannotRequestSelfException } from '../../../../src/modules/marketplace/domain/exceptions/client-cannot-request-self.exception';
import { InvalidPipelineStateTransitionException } from '../../../../src/modules/marketplace/domain/exceptions/invalid-pipeline-state-transition.exception';
import { PipelineAlreadyClosedException } from '../../../../src/modules/marketplace/domain/exceptions/pipeline-already-closed.exception';
import { TrainerRequestCreatedEvent } from '../../../../src/modules/marketplace/domain/events/trainer-request-created.event';
import { TrainerRequestAcceptedEvent } from '../../../../src/modules/marketplace/domain/events/trainer-request-accepted.event';
import { TrainerRequestRejectedEvent } from '../../../../src/modules/marketplace/domain/events/trainer-request-rejected.event';
import { TrainerRequestWithdrawnEvent } from '../../../../src/modules/marketplace/domain/events/trainer-request-withdrawn.event';
import { AcquisitionPipelineClosedEvent } from '../../../../src/modules/marketplace/domain/events/acquisition-pipeline-closed.event';

describe('AcquisitionPipeline Aggregate Root', () => {
  const sampleSnapshot = TrainerSnapshot.create({
    trainerId: 'trainer_456',
    fullName: 'Alex Trainer',
    headline: 'Pro Endurance Coach',
    profileImage: 'https://cdn.kizunafit.com/avatar.jpg',
    specializations: ['Endurance'],
    yearsOfExperience: 6,
    averageRating: 4.9,
    totalReviews: 50,
  }).getValue();

  const sampleRequest = TrainerRequest.create({
    clientGoal: 'Marathon training',
    clientMessage: 'I need weekly plans',
  }).getValue();

  it('should successfully create an AcquisitionPipeline and register TrainerRequestCreatedEvent', () => {
    const result = AcquisitionPipeline.create({
      clientId: 'client_123',
      trainerId: 'trainer_456',
      trainerRequest: sampleRequest,
      trainerSnapshot: sampleSnapshot,
    });

    expect(result.isSuccess).toBe(true);
    const pipeline = result.getValue();
    expect(pipeline.clientId).toBe('client_123');
    expect(pipeline.trainerId).toBe('trainer_456');
    expect(pipeline.status).toBe(AcquisitionPipelineStatus.REQUESTED);
    expect(pipeline.domainEvents.length).toBe(1);
    expect(pipeline.domainEvents[0]).toBeInstanceOf(TrainerRequestCreatedEvent);
  });

  it('should throw ClientCannotRequestSelfException if clientId equals trainerId', () => {
    expect(() =>
      AcquisitionPipeline.create({
        clientId: 'user_999',
        trainerId: 'user_999',
        trainerRequest: sampleRequest,
        trainerSnapshot: sampleSnapshot,
      }),
    ).toThrow(ClientCannotRequestSelfException);
  });

  it('should execute accept() transition cleanly', () => {
    const pipeline = AcquisitionPipeline.create({
      clientId: 'client_123',
      trainerId: 'trainer_456',
      trainerRequest: sampleRequest,
      trainerSnapshot: sampleSnapshot,
    }).getValue();

    pipeline.clearEvents();

    pipeline.accept();

    expect(pipeline.status).toBe(AcquisitionPipelineStatus.ACCEPTED);
    expect(pipeline.trainerRequest.status).toBe(TrainerRequestStatus.ACCEPTED);
    expect(pipeline.domainEvents.length).toBe(1);
    expect(pipeline.domainEvents[0]).toBeInstanceOf(TrainerRequestAcceptedEvent);
  });

  it('should fail accept() if pipeline is already accepted or terminal', () => {
    const pipeline = AcquisitionPipeline.create({
      clientId: 'client_123',
      trainerId: 'trainer_456',
      trainerRequest: sampleRequest,
      trainerSnapshot: sampleSnapshot,
    }).getValue();

    pipeline.accept();
    expect(() => pipeline.accept()).toThrow(InvalidPipelineStateTransitionException);
  });

  it('should execute reject() transition cleanly with reason', () => {
    const pipeline = AcquisitionPipeline.create({
      clientId: 'client_123',
      trainerId: 'trainer_456',
      trainerRequest: sampleRequest,
      trainerSnapshot: sampleSnapshot,
    }).getValue();

    pipeline.clearEvents();

    pipeline.reject('Fully booked');

    expect(pipeline.status).toBe(AcquisitionPipelineStatus.REJECTED);
    expect(pipeline.trainerRequest.status).toBe(TrainerRequestStatus.REJECTED);
    expect(pipeline.trainerRequest.responseReason).toBe('Fully booked');
    expect(pipeline.domainEvents.length).toBe(1);
    expect(pipeline.domainEvents[0]).toBeInstanceOf(TrainerRequestRejectedEvent);
  });

  it('should execute withdraw() transition cleanly', () => {
    const pipeline = AcquisitionPipeline.create({
      clientId: 'client_123',
      trainerId: 'trainer_456',
      trainerRequest: sampleRequest,
      trainerSnapshot: sampleSnapshot,
    }).getValue();

    pipeline.clearEvents();

    pipeline.withdraw();

    expect(pipeline.status).toBe(AcquisitionPipelineStatus.WITHDRAWN);
    expect(pipeline.trainerRequest.status).toBe(TrainerRequestStatus.WITHDRAWN);
    expect(pipeline.domainEvents.length).toBe(1);
    expect(pipeline.domainEvents[0]).toBeInstanceOf(TrainerRequestWithdrawnEvent);
  });

  it('should execute close() transition cleanly from ACCEPTED status', () => {
    const pipeline = AcquisitionPipeline.create({
      clientId: 'client_123',
      trainerId: 'trainer_456',
      trainerRequest: sampleRequest,
      trainerSnapshot: sampleSnapshot,
    }).getValue();

    pipeline.accept();
    pipeline.clearEvents();

    pipeline.close();

    expect(pipeline.status).toBe(AcquisitionPipelineStatus.CLOSED);
    expect(pipeline.domainEvents.length).toBe(1);
    expect(pipeline.domainEvents[0]).toBeInstanceOf(AcquisitionPipelineClosedEvent);
  });

  it('should fail close() if pipeline is already closed', () => {
    const pipeline = AcquisitionPipeline.create({
      clientId: 'client_123',
      trainerId: 'trainer_456',
      trainerRequest: sampleRequest,
      trainerSnapshot: sampleSnapshot,
    }).getValue();

    pipeline.accept();
    pipeline.close();

    expect(() => pipeline.close()).toThrow(PipelineAlreadyClosedException);
  });

  it('should correctly report predicate guard methods', () => {
    const pipeline = AcquisitionPipeline.create({
      clientId: 'client_123',
      trainerId: 'trainer_456',
      trainerRequest: sampleRequest,
      trainerSnapshot: sampleSnapshot,
    }).getValue();

    expect(pipeline.canAccept()).toBe(true);
    expect(pipeline.canReject()).toBe(true);
    expect(pipeline.canWithdraw()).toBe(true);
    expect(pipeline.canClose()).toBe(false); // Must be ACCEPTED first

    pipeline.accept();
    expect(pipeline.canClose()).toBe(true);
  });
});
