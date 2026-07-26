import { describe, it, expect } from 'vitest';
import { TrainerProfileFactory } from '../../../src/modules/profile/domain/factories/TrainerProfileFactory';
import { TrainerAvailability } from '../../../src/modules/profile/domain/value-objects/TrainerAvailability';
import { TrainerAvailabilityStatus } from '../../../src/modules/profile/domain/enums/TrainerAvailabilityStatus';
import { TrainerSpecialization } from '../../../src/modules/profile/domain/enums/TrainerSpecialization';
import { TrainerCertification } from '../../../src/modules/profile/domain/entities/TrainerCertification';
import { CertificationStatus } from '../../../src/modules/profile/domain/enums/TrainerEnums';

describe('TrainerProfile Aggregate Root & Availability VO', () => {
  it('should validate overlapping slots in TrainerAvailability', () => {
    const validRes = TrainerAvailability.create(TrainerAvailabilityStatus.AVAILABLE, 'UTC', [
      {
        dayOfWeek: 1,
        slots: [
          { startTime: '09:00', endTime: '12:00' },
          { startTime: '13:00', endTime: '17:00' },
        ],
      },
    ]);
    expect(validRes.isSuccess).toBe(true);

    const overlapRes = TrainerAvailability.create(TrainerAvailabilityStatus.AVAILABLE, 'UTC', [
      {
        dayOfWeek: 1,
        slots: [
          { startTime: '09:00', endTime: '13:00' },
          { startTime: '12:00', endTime: '15:00' },
        ],
      },
    ]);
    expect(overlapRes.isFailure).toBe(true);
    expect(overlapRes.error).toContain('Overlapping');
  });

  it('should manage trainer certifications correctly', () => {
    const trainer = TrainerProfileFactory.createNew({
      userId: 'trainer-123',
      headline: 'Certified Fitness Coach',
      bio: 'Helping clients transform since 2018',
      yearsOfExperience: 6,
      languages: ['English', 'Spanish'],
      specializations: [TrainerSpecialization.WEIGHT_LOSS, TrainerSpecialization.STRENGTH_TRAINING],
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
    }).getValue();

    const cert = TrainerCertification.create({
      title: 'NASM CPT',
      organization: 'NASM',
      issuedAt: new Date('2020-01-01'),
      certificateUrl: 'https://cloudinary.com/cert.pdf',
      status: CertificationStatus.PENDING,
    }).getValue();

    const addRes = trainer.addCertification(cert);
    expect(addRes.isSuccess).toBe(true);
    expect(trainer.certifications.length).toBe(1);

    cert.approve();
    expect(cert.status).toBe(CertificationStatus.APPROVED);

    const updateRes = trainer.updateCertification(cert.certificationId, { title: 'New Title' });
    expect(updateRes.isFailure).toBe(true); // Approved certs cannot be edited
  });
});
