import { describe, it, expect } from 'vitest';
import { ClientProfileFactory } from '../../../src/modules/profile/domain/factories/ClientProfileFactory';
import { Weight } from '../../../src/modules/profile/domain/value-objects/Weight';
import { Height } from '../../../src/modules/profile/domain/value-objects/Height';
import { WeightUnit, HeightUnit } from '../../../src/modules/profile/domain/enums/Units';
import { Gender } from '../../../src/modules/profile/domain/enums/Gender';
import { FitnessGoal } from '../../../src/modules/profile/domain/enums/FitnessGoal';
import {
  ExperienceLevel,
  ActivityLevel,
} from '../../../src/modules/profile/domain/enums/ClientLevels';

describe('ClientProfile Aggregate Root', () => {
  it('should create a valid client profile with factory defaults', () => {
    const res = ClientProfileFactory.createNew({
      userId: 'user-123',
      fullName: 'John Client',
    });

    expect(res.isSuccess).toBe(true);
    const profile = res.getValue();
    expect(profile.userId).toBe('user-123');
    expect(profile.fullName).toBe('John Client');
    expect(profile.profileCompleted).toBe(false);
  });

  it('should update client profile details and recalculate profile completion', () => {
    const profile = ClientProfileFactory.createNew({
      userId: 'user-123',
      fullName: 'John Client',
    }).getValue();

    const weight = Weight.create(75, WeightUnit.KG).getValue();
    const height = Height.create(180, HeightUnit.CM).getValue();

    const updateRes = profile.updateDetails({
      gender: Gender.MALE,
      dateOfBirth: new Date('1995-05-15'),
      weight,
      height,
      fitnessGoals: [FitnessGoal.FAT_LOSS, FitnessGoal.MUSCLE_GAIN],
      experienceLevel: ExperienceLevel.INTERMEDIATE,
      activityLevel: ActivityLevel.MODERATELY_ACTIVE,
    });

    expect(updateRes.isSuccess).toBe(true);
    expect(profile.profileCompleted).toBe(true);
  });

  it('should update bio and clear bio correctly', () => {
    const profile = ClientProfileFactory.createNew({
      userId: 'user-123',
      fullName: 'John Client',
    }).getValue();

    expect(profile.bio).toBeUndefined();

    const updateRes = profile.updateDetails({
      bio: 'Training for strength and muscle gain.',
    });

    expect(updateRes.isSuccess).toBe(true);
    expect(profile.bio).toBe('Training for strength and muscle gain.');

    const clearRes = profile.updateDetails({
      bio: null,
    });

    expect(clearRes.isSuccess).toBe(true);
    expect(profile.bio).toBeNull();
  });

  it('should reject bio exceeding 500 characters', () => {
    const profile = ClientProfileFactory.createNew({
      userId: 'user-123',
      fullName: 'John Client',
    }).getValue();

    const longBio = 'a'.repeat(501);
    const updateRes = profile.updateDetails({
      bio: longBio,
    });

    expect(updateRes.isFailure).toBe(true);
    expect(updateRes.error).toContain('Bio must not exceed 500 characters');
  });
});
