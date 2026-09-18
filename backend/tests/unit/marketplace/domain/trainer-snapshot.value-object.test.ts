import { describe, it, expect } from 'vitest';
import { TrainerSnapshot } from '../../../../src/modules/marketplace/domain/value-objects/trainer-snapshot.value-object';

describe('TrainerSnapshot Value Object', () => {
  const validProps = {
    trainerId: 'trainer_123',
    fullName: 'Alex Miller',
    headline: 'Certified Strength Coach',
    profileImage: 'https://cdn.kizunafit.com/avatars/trainer_123.jpg',
    specializations: ['Strength', 'Hypertrophy'],
    yearsOfExperience: 5,
    averageRating: 4.8,
    totalReviews: 42,
  };

  it('should successfully create a valid TrainerSnapshot', () => {
    const result = TrainerSnapshot.create(validProps);

    expect(result.isSuccess).toBe(true);
    const snapshot = result.getValue();
    expect(snapshot.trainerId).toBe('trainer_123');
    expect(snapshot.fullName).toBe('Alex Miller');
    expect(snapshot.headline).toBe('Certified Strength Coach');
    expect(snapshot.specializations).toEqual(['Strength', 'Hypertrophy']);
    expect(snapshot.yearsOfExperience).toBe(5);
    expect(snapshot.averageRating).toBe(4.8);
    expect(snapshot.totalReviews).toBe(42);
  });

  it('should fail creation if trainerId is empty', () => {
    const result = TrainerSnapshot.create({ ...validProps, trainerId: '   ' });
    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('trainerId');
  });

  it('should fail creation if fullName is empty', () => {
    const result = TrainerSnapshot.create({ ...validProps, fullName: '' });
    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('fullName');
  });

  it('should fail creation if yearsOfExperience is negative', () => {
    const result = TrainerSnapshot.create({ ...validProps, yearsOfExperience: -1 });
    expect(result.isFailure).toBe(true);
    expect(result.error).toContain('yearsOfExperience');
  });

  it('should fail creation if averageRating is out of 0-5 bounds', () => {
    const resultLow = TrainerSnapshot.create({ ...validProps, averageRating: -0.5 });
    const resultHigh = TrainerSnapshot.create({ ...validProps, averageRating: 5.5 });

    expect(resultLow.isFailure).toBe(true);
    expect(resultHigh.isFailure).toBe(true);
  });

  it('should support serialization to primitives via toPrimitives()', () => {
    const snapshot = TrainerSnapshot.create(validProps).getValue();
    const primitives = snapshot.toPrimitives();

    expect(primitives).toEqual(validProps);
    expect(primitives).not.toBe(snapshot.props); // Unlinked copy
  });

  it('should accurately compare value object equality', () => {
    const snapshot1 = TrainerSnapshot.create(validProps).getValue();
    const snapshot2 = TrainerSnapshot.create(validProps).getValue();
    const snapshot3 = TrainerSnapshot.create({
      ...validProps,
      fullName: 'Different Name',
    }).getValue();

    expect(snapshot1.equals(snapshot2)).toBe(true);
    expect(snapshot1.equals(snapshot3)).toBe(false);
  });
});
