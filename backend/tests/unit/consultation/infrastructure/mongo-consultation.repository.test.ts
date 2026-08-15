import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MongoConsultationRepository } from '../../../../src/modules/consultation/infrastructure/persistence/mongoose/repositories/mongo-consultation.repository';
import { Consultation } from '../../../../src/modules/consultation/domain/aggregates/consultation.aggregate';
import { ConsultationSlot } from '../../../../src/modules/consultation/domain/value-objects/consultation-slot.vo';
import { ConsultationModel } from '../../../../src/modules/consultation/infrastructure/persistence/mongoose/schemas/consultation.schema';

vi.mock(
  '../../../../src/modules/consultation/infrastructure/persistence/mongoose/schemas/consultation.schema',
  () => ({
    ConsultationModel: {
      findByIdAndUpdate: vi.fn().mockResolvedValue({}),
      findById: vi.fn(),
      findOne: vi.fn(),
      find: vi.fn(),
      countDocuments: vi.fn(),
    },
  }),
);

describe('MongoConsultationRepository Infrastructure Tests (Custom Domain IDs)', () => {
  let mockDispatcher: any;
  const sampleSlot = ConsultationSlot.create({
    scheduledStartAt: new Date(Date.now() + 3600000),
    scheduledEndAt: new Date(Date.now() + 7200000),
    timezone: 'UTC',
  }).getValue();

  beforeEach(() => {
    vi.clearAllMocks();
    mockDispatcher = {
      dispatchAll: vi.fn().mockResolvedValue(undefined),
    };
  });

  it('should save aggregate with custom string domain IDs, dispatch events, and clear events upon success', async () => {
    const repo = new MongoConsultationRepository(mockDispatcher);
    const customPipelineId = 'pipe_1786359655394_11qed';

    const consultation = Consultation.create({
      acquisitionPipelineId: customPipelineId,
      clientId: 'client_123',
      trainerId: 'trainer_456',
      slot: sampleSlot,
    }).getValue();

    expect(consultation.consultationId).toContain('consultation_');
    expect(consultation.domainEvents.length).toBeGreaterThan(0);

    await repo.save(consultation);

    expect(ConsultationModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    expect(ConsultationModel.findByIdAndUpdate).toHaveBeenCalledWith(
      consultation.consultationId,
      expect.objectContaining({
        $set: expect.objectContaining({
          _id: consultation.consultationId,
          acquisitionPipelineId: customPipelineId,
        }),
      }),
      expect.any(Object),
    );
    expect(mockDispatcher.dispatchAll).toHaveBeenCalledTimes(1);
    expect(consultation.domainEvents.length).toBe(0);
  });

  it('should query findByAcquisitionPipelineId with exact custom string pipeline ID (pipe_...)', async () => {
    const repo = new MongoConsultationRepository(mockDispatcher);
    const customPipelineId = 'pipe_1786359655394_11qed';

    await repo.findByAcquisitionPipelineId(customPipelineId);

    expect(ConsultationModel.findOne).toHaveBeenCalledWith({
      acquisitionPipelineId: customPipelineId,
    });
  });

  it('should NOT dispatch events and preserve events if database update fails', async () => {
    vi.mocked(ConsultationModel.findByIdAndUpdate).mockRejectedValueOnce(
      new Error('DB Connection Timeout'),
    );

    const repo = new MongoConsultationRepository(mockDispatcher);
    const consultation = Consultation.create({
      acquisitionPipelineId: 'pipe_123',
      clientId: 'client_123',
      trainerId: 'trainer_456',
      slot: sampleSlot,
    }).getValue();

    await expect(repo.save(consultation)).rejects.toThrow('DB Connection Timeout');
    expect(mockDispatcher.dispatchAll).not.toHaveBeenCalled();
    expect(consultation.domainEvents.length).toBeGreaterThan(0);
  });

  it('should translate Mongoose duplicate key error into a clear domain message', async () => {
    const mongoDuplicateError: any = new Error('E11000 duplicate key error collection');
    mongoDuplicateError.code = 11000;

    vi.mocked(ConsultationModel.findByIdAndUpdate).mockRejectedValueOnce(mongoDuplicateError);

    const repo = new MongoConsultationRepository(mockDispatcher);
    const consultation = Consultation.create({
      acquisitionPipelineId: 'pipe_123',
      clientId: 'client_123',
      trainerId: 'trainer_456',
      slot: sampleSlot,
    }).getValue();

    await expect(repo.save(consultation)).rejects.toThrow(
      'A consultation already exists for acquisition pipeline',
    );
  });

  it('should return null if findById is called with an empty string', async () => {
    const repo = new MongoConsultationRepository(mockDispatcher);
    const result = await repo.findById('  ');
    expect(result).toBeNull();
    expect(ConsultationModel.findById).not.toHaveBeenCalled();
  });
});
