import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MongoTrainerProfileRepository } from '../../../../src/modules/profile/infrastructure/repositories/MongoTrainerProfileRepository';
import { TrainerProfileFactory } from '../../../../src/modules/profile/domain/factories/TrainerProfileFactory';
import { TrainerSpecialization } from '../../../../src/modules/profile/domain/enums/TrainerSpecialization';
import { TrainerProfileModel } from '../../../../src/modules/profile/infrastructure/persistence/mongoose/models/TrainerProfileModel';
import { TrainerAvailability } from '../../../../src/modules/profile/domain/value-objects/TrainerAvailability';
import { TrainerAvailabilityStatus } from '../../../../src/modules/profile/domain/enums/TrainerAvailabilityStatus';

vi.mock(
  '../../../../src/modules/profile/infrastructure/persistence/mongoose/models/TrainerProfileModel',
  () => ({
    TrainerProfileModel: {
      findByIdAndUpdate: vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue({}),
      }),
    },
  }),
);

describe('MongoTrainerProfileRepository Event Dispatching', () => {
  let mockDispatcher: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDispatcher = {
      dispatchAll: vi.fn().mockResolvedValue(undefined),
    };
  });

  it('should dispatch domain events and clear them after successful persistence', async () => {
    const repo = new MongoTrainerProfileRepository(mockDispatcher);
    const trainer = TrainerProfileFactory.createNew({
      userId: 'user-789',
      headline: 'Elite Coach',
      bio: 'Professional trainer',
      yearsOfExperience: 5,
      languages: ['English'],
      specializations: [TrainerSpecialization.HIIT],
      city: 'Miami',
      state: 'FL',
      country: 'USA',
    }).getValue();

    // Trigger an availability update to record TrainerAvailabilityChangedEvent
    const newAvail = TrainerAvailability.create(
      TrainerAvailabilityStatus.OFFLINE,
      'UTC',
      [],
    ).getValue();
    trainer.updateAvailability(newAvail);

    expect(trainer.domainEvents.length).toBeGreaterThan(0);

    await repo.save(trainer);

    expect(TrainerProfileModel.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    expect(mockDispatcher.dispatchAll).toHaveBeenCalledTimes(1);
    expect(mockDispatcher.dispatchAll.mock.calls[0][0]).toContainEqual(
      expect.objectContaining({
        trainerProfileId: trainer.id,
        userId: 'user-789',
        newStatus: TrainerAvailabilityStatus.OFFLINE,
      }),
    );
    expect(trainer.domainEvents.length).toBe(0);
  });

  it('should NOT dispatch events if database save fails', async () => {
    vi.mocked(TrainerProfileModel.findByIdAndUpdate).mockReturnValueOnce({
      exec: vi.fn().mockRejectedValue(new Error('Database error')),
    } as any);

    const repo = new MongoTrainerProfileRepository(mockDispatcher);
    const trainer = TrainerProfileFactory.createNew({
      userId: 'user-789',
      headline: 'Elite Coach',
      bio: 'Professional trainer',
      yearsOfExperience: 5,
      languages: ['English'],
      specializations: [TrainerSpecialization.HIIT],
      city: 'Miami',
      state: 'FL',
      country: 'USA',
    }).getValue();

    const newAvail = TrainerAvailability.create(
      TrainerAvailabilityStatus.OFFLINE,
      'UTC',
      [],
    ).getValue();
    trainer.updateAvailability(newAvail);

    await expect(repo.save(trainer)).rejects.toThrow('Database error');
    expect(mockDispatcher.dispatchAll).not.toHaveBeenCalled();
    expect(trainer.domainEvents.length).toBeGreaterThan(0);
  });
});
