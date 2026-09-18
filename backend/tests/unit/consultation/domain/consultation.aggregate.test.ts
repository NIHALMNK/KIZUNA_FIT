import { describe, it, expect } from 'vitest';
import { Consultation } from '../../../../src/modules/consultation/domain/aggregates/consultation.aggregate';
import { ConsultationSlot } from '../../../../src/modules/consultation/domain/value-objects/consultation-slot.vo';
import { ConsultationStatus } from '../../../../src/modules/consultation/domain/enums/consultation-status.enum';
import { ConsultationPlatform } from '../../../../src/modules/consultation/domain/enums/consultation-platform.enum';
import { CancellationActor } from '../../../../src/modules/consultation/domain/enums/cancellation-actor.enum';
import { InvalidConsultationStateTransitionException } from '../../../../src/modules/consultation/domain/exceptions/invalid-consultation-state-transition.exception';
import { ConsultationCreatedEvent } from '../../../../src/modules/consultation/domain/events/consultation-created.event';
import { ConsultationSlotBookedEvent } from '../../../../src/modules/consultation/domain/events/consultation-slot-booked.event';
import { ConsultationScheduledEvent } from '../../../../src/modules/consultation/domain/events/consultation-scheduled.event';
import { ConsultationCancelledEvent } from '../../../../src/modules/consultation/domain/events/consultation-cancelled.event';
import { ConsultationCompletedEvent } from '../../../../src/modules/consultation/domain/events/consultation-completed.event';
import { ConsultationNoShowEvent } from '../../../../src/modules/consultation/domain/events/consultation-no-show.event';

describe('Consultation Aggregate Root', () => {
  const sampleSlot = ConsultationSlot.create({
    scheduledStartAt: new Date(Date.now() + 3600000),
    scheduledEndAt: new Date(Date.now() + 7200000),
    timezone: 'UTC',
  }).getValue();

  const newSlot = ConsultationSlot.create({
    scheduledStartAt: new Date(Date.now() + 10000000),
    scheduledEndAt: new Date(Date.now() + 13600000),
    timezone: 'UTC',
  }).getValue();

  it('should successfully create a new Consultation in CREATED status and emit ConsultationCreatedEvent', () => {
    const result = Consultation.create({
      acquisitionPipelineId: 'pipe_123',
      clientId: 'client_456',
      trainerId: 'trainer_789',
      slot: sampleSlot,
    });

    expect(result.isSuccess).toBe(true);
    const consultation = result.getValue();
    expect(consultation.status).toBe(ConsultationStatus.CREATED);
    expect(consultation.acquisitionPipelineId).toBe('pipe_123');
    expect(consultation.clientId).toBe('client_456');
    expect(consultation.trainerId).toBe('trainer_789');
    expect(consultation.platform).toBe(ConsultationPlatform.WEBRTC);
    expect(consultation.roomId).toBeDefined();

    expect(consultation.domainEvents).toHaveLength(1);
    expect(consultation.domainEvents[0]).toBeInstanceOf(ConsultationCreatedEvent);
  });

  it('should fail creation if client and trainer are the same user', () => {
    const result = Consultation.create({
      acquisitionPipelineId: 'pipe_123',
      clientId: 'user_999',
      trainerId: 'user_999',
      slot: sampleSlot,
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('Client cannot have a consultation with themselves');
  });

  it('should transition from CREATED to SLOT_BOOKED and emit ConsultationSlotBookedEvent', () => {
    const consultation = Consultation.create({
      acquisitionPipelineId: 'pipe_123',
      clientId: 'client_456',
      trainerId: 'trainer_789',
      slot: sampleSlot,
    }).getValue();

    consultation.clearEvents();

    consultation.bookSlot(newSlot);

    expect(consultation.status).toBe(ConsultationStatus.SLOT_BOOKED);
    expect(consultation.slot).toBe(newSlot);
    expect(consultation.domainEvents).toHaveLength(1);
    expect(consultation.domainEvents[0]).toBeInstanceOf(ConsultationSlotBookedEvent);
  });

  it('should transition from SLOT_BOOKED to SCHEDULED via confirmSchedule', () => {
    const consultation = Consultation.create({
      acquisitionPipelineId: 'pipe_123',
      clientId: 'client_456',
      trainerId: 'trainer_789',
      slot: sampleSlot,
    }).getValue();

    consultation.bookSlot(newSlot);
    consultation.clearEvents();

    consultation.confirmSchedule();

    expect(consultation.status).toBe(ConsultationStatus.SCHEDULED);
    expect(consultation.domainEvents).toHaveLength(1);
    expect(consultation.domainEvents[0]).toBeInstanceOf(ConsultationScheduledEvent);
  });

  it('should transition from CREATED to SCHEDULED via schedule method', () => {
    const consultation = Consultation.create({
      acquisitionPipelineId: 'pipe_123',
      clientId: 'client_456',
      trainerId: 'trainer_789',
      slot: sampleSlot,
    }).getValue();

    consultation.clearEvents();

    consultation.schedule(newSlot);

    expect(consultation.status).toBe(ConsultationStatus.SCHEDULED);
    expect(consultation.domainEvents).toHaveLength(1);
    expect(consultation.domainEvents[0]).toBeInstanceOf(ConsultationScheduledEvent);
  });

  it('should transition from SCHEDULED to COMPLETED and set completedAt timestamp', () => {
    const consultation = Consultation.create({
      acquisitionPipelineId: 'pipe_123',
      clientId: 'client_456',
      trainerId: 'trainer_789',
      slot: sampleSlot,
    }).getValue();

    consultation.schedule(sampleSlot);
    consultation.clearEvents();

    consultation.complete();

    expect(consultation.status).toBe(ConsultationStatus.COMPLETED);
    expect(consultation.completedAt).toBeInstanceOf(Date);
    expect(consultation.isTerminal()).toBe(true);
    expect(consultation.domainEvents).toHaveLength(1);
    expect(consultation.domainEvents[0]).toBeInstanceOf(ConsultationCompletedEvent);
  });

  it('should transition from SCHEDULED to NO_SHOW', () => {
    const consultation = Consultation.create({
      acquisitionPipelineId: 'pipe_123',
      clientId: 'client_456',
      trainerId: 'trainer_789',
      slot: sampleSlot,
    }).getValue();

    consultation.schedule(sampleSlot);
    consultation.clearEvents();

    consultation.markNoShow();

    expect(consultation.status).toBe(ConsultationStatus.NO_SHOW);
    expect(consultation.isTerminal()).toBe(true);
    expect(consultation.domainEvents).toHaveLength(1);
    expect(consultation.domainEvents[0]).toBeInstanceOf(ConsultationNoShowEvent);
  });

  it('should transition to CANCELLED and store cancellation details', () => {
    const consultation = Consultation.create({
      acquisitionPipelineId: 'pipe_123',
      clientId: 'client_456',
      trainerId: 'trainer_789',
      slot: sampleSlot,
    }).getValue();

    consultation.clearEvents();

    consultation.cancel(CancellationActor.CLIENT, 'Client rescheduled elsewhere');

    expect(consultation.status).toBe(ConsultationStatus.CANCELLED);
    expect(consultation.isTerminal()).toBe(true);
    expect(consultation.cancellation).not.toBeNull();
    expect(consultation.cancellation?.cancelledBy).toBe(CancellationActor.CLIENT);
    expect(consultation.cancellation?.reason).toBe('Client rescheduled elsewhere');
    expect(consultation.domainEvents).toHaveLength(1);
    expect(consultation.domainEvents[0]).toBeInstanceOf(ConsultationCancelledEvent);
  });

  it('should throw InvalidConsultationStateTransitionException when attempting to modify COMPLETED terminal state', () => {
    const consultation = Consultation.create({
      acquisitionPipelineId: 'pipe_123',
      clientId: 'client_456',
      trainerId: 'trainer_789',
      slot: sampleSlot,
    }).getValue();

    consultation.schedule(sampleSlot);
    consultation.complete();

    expect(() => consultation.complete()).toThrow(InvalidConsultationStateTransitionException);
    expect(() => consultation.cancel(CancellationActor.TRAINER)).toThrow(
      InvalidConsultationStateTransitionException,
    );
    expect(() => consultation.markNoShow()).toThrow(InvalidConsultationStateTransitionException);
    expect(() => consultation.bookSlot(newSlot)).toThrow(
      InvalidConsultationStateTransitionException,
    );
  });

  it('should throw InvalidConsultationStateTransitionException when attempting to modify CANCELLED terminal state', () => {
    const consultation = Consultation.create({
      acquisitionPipelineId: 'pipe_123',
      clientId: 'client_456',
      trainerId: 'trainer_789',
      slot: sampleSlot,
    }).getValue();

    consultation.cancel(CancellationActor.SYSTEM, 'Timeout');

    expect(() => consultation.complete()).toThrow(InvalidConsultationStateTransitionException);
    expect(() => consultation.confirmSchedule()).toThrow(
      InvalidConsultationStateTransitionException,
    );
  });
});
