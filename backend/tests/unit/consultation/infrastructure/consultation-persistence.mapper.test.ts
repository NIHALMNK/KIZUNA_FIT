import { describe, it, expect } from 'vitest';
import { ConsultationPersistenceMapper } from '../../../../src/modules/consultation/infrastructure/persistence/mongoose/mappers/consultation-persistence.mapper';
import { Consultation } from '../../../../src/modules/consultation/domain/aggregates/consultation.aggregate';
import { ConsultationSlot } from '../../../../src/modules/consultation/domain/value-objects/consultation-slot.vo';
import { MeetingDetails } from '../../../../src/modules/consultation/domain/value-objects/meeting-details.vo';
import { ConsultationCancellation } from '../../../../src/modules/consultation/domain/value-objects/consultation-cancellation.vo';
import { ConsultationStatus } from '../../../../src/modules/consultation/domain/enums/consultation-status.enum';
import { ConsultationPlatform } from '../../../../src/modules/consultation/domain/enums/consultation-platform.enum';
import { CancellationActor } from '../../../../src/modules/consultation/domain/enums/cancellation-actor.enum';
import { IConsultationDocument } from '../../../../src/modules/consultation/infrastructure/persistence/mongoose/documents/consultation.document';

describe('ConsultationPersistenceMapper ID Strategy Tests', () => {
  const sampleSlot = ConsultationSlot.create({
    scheduledStartAt: new Date('2026-09-01T10:00:00Z'),
    scheduledEndAt: new Date('2026-09-01T10:45:00Z'),
    timezone: 'UTC',
  }).getValue();

  const sampleMeetingDetails = MeetingDetails.create({
    platform: ConsultationPlatform.WEBRTC,
    roomId: 'room_abc123',
    meetingUrl: 'https://meet.kizunafit.com/room_abc123',
    instructions: 'Test mic before joining',
  }).getValue();

  it('should preserve realistic domain custom IDs (consultation_..., pipe_...) in persistence payloads', () => {
    const customConsultationId = 'consultation_1786359655394_abc';
    const customPipelineId = 'pipe_1786359655394_11qed';
    const clientId = 'client_1786359655394_xyz';
    const trainerId = 'trainer_1786359655394_pro';

    const consultation = Consultation.create(
      {
        acquisitionPipelineId: customPipelineId,
        clientId,
        trainerId,
        slot: sampleSlot,
        platform: ConsultationPlatform.WEBRTC,
        meetingDetails: sampleMeetingDetails,
      },
      customConsultationId,
    ).getValue();

    const persistenceDoc = ConsultationPersistenceMapper.toPersistence(consultation);

    expect(persistenceDoc._id).toBe(customConsultationId);
    expect(persistenceDoc.acquisitionPipelineId).toBe(customPipelineId);
    expect(persistenceDoc.clientId).toBe(clientId);
    expect(persistenceDoc.trainerId).toBe(trainerId);
    expect(persistenceDoc.status).toBe(ConsultationStatus.CREATED);
  });

  it('should perform 100% loss-free round-trip domain rehydration with exact custom domain IDs', () => {
    const customConsultationId = 'consultation_1786359655394_abc';
    const customPipelineId = 'pipe_1786359655394_11qed';
    const clientId = 'client_1786359655394_xyz';
    const trainerId = 'trainer_1786359655394_pro';

    const mockDoc: Record<string, unknown> = {
      _id: customConsultationId,
      acquisitionPipelineId: customPipelineId,
      clientId,
      trainerId,
      slot: {
        scheduledStartAt: new Date('2026-09-01T10:00:00Z'),
        scheduledEndAt: new Date('2026-09-01T10:45:00Z'),
        timezone: 'UTC',
        bookedAt: new Date(),
      },
      platform: ConsultationPlatform.WEBRTC,
      roomId: 'room_abc123',
      meetingUrl: 'https://meet.kizunafit.com/room_abc123',
      meetingDetails: {
        platform: ConsultationPlatform.WEBRTC,
        roomId: 'room_abc123',
        meetingUrl: 'https://meet.kizunafit.com/room_abc123',
        joinCode: null,
        instructions: 'Test mic',
      },
      status: ConsultationStatus.SCHEDULED,
      completedAt: null,
      cancellation: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const aggregate = ConsultationPersistenceMapper.toDomain(
      mockDoc as unknown as IConsultationDocument,
    );

    expect(aggregate.consultationId).toBe(customConsultationId);
    expect(aggregate.acquisitionPipelineId).toBe(customPipelineId);
    expect(aggregate.clientId).toBe(clientId);
    expect(aggregate.trainerId).toBe(trainerId);
    expect(aggregate.status).toBe(ConsultationStatus.SCHEDULED);

    // Crucial rehydration invariant: Rehydrating from persistence must NOT trigger domain creation events
    expect(aggregate.domainEvents).toHaveLength(0);
  });

  it('should accurately map cancellation details when present in document', () => {
    const customConsultationId = 'consultation_1786359655394_abc';
    const customPipelineId = 'pipe_1786359655394_11qed';

    const mockDoc: Record<string, unknown> = {
      _id: customConsultationId,
      acquisitionPipelineId: customPipelineId,
      clientId: 'client_1',
      trainerId: 'trainer_1',
      slot: {
        scheduledStartAt: new Date('2026-09-01T10:00:00Z'),
        scheduledEndAt: new Date('2026-09-01T10:45:00Z'),
        timezone: 'UTC',
        bookedAt: new Date(),
      },
      platform: ConsultationPlatform.WEBRTC,
      roomId: 'room_abc123',
      meetingUrl: null,
      meetingDetails: null,
      status: ConsultationStatus.CANCELLED,
      completedAt: null,
      cancellation: {
        cancelledAt: new Date(),
        cancelledBy: CancellationActor.CLIENT,
        reason: 'Emergency',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const aggregate = ConsultationPersistenceMapper.toDomain(
      mockDoc as unknown as IConsultationDocument,
    );

    expect(aggregate.status).toBe(ConsultationStatus.CANCELLED);
    expect(aggregate.cancellation).not.toBeNull();
    expect(aggregate.cancellation?.cancelledBy).toBe(CancellationActor.CLIENT);
    expect(aggregate.cancellation?.reason).toBe('Emergency');
  });
});
