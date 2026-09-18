import { describe, it, expect } from 'vitest';
import { AcquisitionPipelineFactory } from '../../../../src/modules/marketplace/domain/factories/acquisition-pipeline.factory';

describe('AcquisitionPipelineFactory', () => {
  const sampleSnapshotProps = {
    trainerId: 'trainer_456',
    fullName: 'Jane Trainer',
    headline: 'Certified Fitness Specialist',
    profileImage: 'https://cdn.kizunafit.com/avatar.jpg',
    specializations: ['Weight Loss'],
    yearsOfExperience: 4,
    averageRating: 4.7,
    totalReviews: 30,
  };

  it('should successfully create initial AcquisitionPipeline aggregate via factory', () => {
    const result = AcquisitionPipelineFactory.createNewPipeline({
      clientId: 'client_123',
      trainerId: 'trainer_456',
      clientGoal: 'Lose weight and build stamina',
      clientMessage: 'Looking for 3 sessions per week',
      trainerSnapshot: sampleSnapshotProps,
    });

    expect(result.isSuccess).toBe(true);
    const pipeline = result.getValue();
    expect(pipeline.clientId).toBe('client_123');
    expect(pipeline.trainerId).toBe('trainer_456');
    expect(pipeline.trainerRequest.clientGoal).toBe('Lose weight and build stamina');
    expect(pipeline.trainerSnapshot.fullName).toBe('Jane Trainer');
  });

  it('should return failure Result if invalid snapshot props are passed', () => {
    const invalidSnapshotProps = { ...sampleSnapshotProps, averageRating: 10 };

    const result = AcquisitionPipelineFactory.createNewPipeline({
      clientId: 'client_123',
      trainerId: 'trainer_456',
      clientGoal: 'Valid Goal',
      trainerSnapshot: invalidSnapshotProps,
    });

    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('averageRating');
  });
});
