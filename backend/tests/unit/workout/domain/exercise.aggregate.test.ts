import { describe, it, expect } from 'vitest';
import { Exercise } from '../../../../src/modules/workout/domain/aggregates/exercise.aggregate';
import {
  DifficultyLevel,
  EquipmentType,
  ExerciseOrigin,
  ExerciseStatus,
  PrimaryMuscleGroup,
} from '../../../../src/modules/workout/domain/enums';

describe('Exercise Aggregate Domain Tests', () => {
  it('should create an active exercise with auto-generated slug', () => {
    const res = Exercise.create({
      name: 'Incline Barbell Bench Press',
      category: 'Chest',
      primaryMuscleGroup: PrimaryMuscleGroup.CHEST,
      secondaryMuscleGroups: [PrimaryMuscleGroup.TRICEPS, PrimaryMuscleGroup.SHOULDERS],
      equipment: EquipmentType.BARBELL,
      difficulty: DifficultyLevel.INTERMEDIATE,
      instructions: [{ step: 1, instruction: 'Set bench to 30 degrees.' }],
      media: { images: [] },
      caloriesPerMinute: 7,
      status: ExerciseStatus.ACTIVE,
    });

    expect(res.isSuccess).toBe(true);
    const exercise = res.getValue();
    expect(exercise.slug).toBe('incline-barbell-bench-press');
    expect(exercise.status).toBe(ExerciseStatus.ACTIVE);
    expect(exercise.isUsableInNewProgram()).toBe(true);
  });

  it('should fail creation if exercise name is empty', () => {
    const res = Exercise.create({
      name: '',
      category: 'Chest',
      primaryMuscleGroup: PrimaryMuscleGroup.CHEST,
      secondaryMuscleGroups: [],
      equipment: EquipmentType.BARBELL,
      difficulty: DifficultyLevel.INTERMEDIATE,
      instructions: [],
      media: { images: [] },
      caloriesPerMinute: 5,
    });

    expect(res.isFailure).toBe(true);
    expect(res.error).toContain('Exercise name is required');
  });

  it('should generate immutable ExerciseSnapshot capturing definition for prescriptions (Rule EX-3 / WP-6)', () => {
    const exercise = Exercise.create({
      name: 'Barbell Deadlift',
      category: 'Back',
      primaryMuscleGroup: PrimaryMuscleGroup.BACK,
      secondaryMuscleGroups: [PrimaryMuscleGroup.LEGS],
      equipment: EquipmentType.BARBELL,
      difficulty: DifficultyLevel.ADVANCED,
      instructions: [],
      media: { images: [] },
      caloriesPerMinute: 10,
    }).getValue();

    const snapshot = exercise.toSnapshot();
    expect(snapshot.exerciseId).toBe(exercise.id);
    expect(snapshot.name).toBe('Barbell Deadlift');
    expect(snapshot.primaryMuscleGroup).toBe(PrimaryMuscleGroup.BACK);
    expect(snapshot.equipment).toBe(EquipmentType.BARBELL);
  });

  it('should deprecate an exercise without destroying entity history (Rule EX-2)', () => {
    const exercise = Exercise.create({
      name: 'Behind Neck Press',
      category: 'Shoulders',
      primaryMuscleGroup: PrimaryMuscleGroup.SHOULDERS,
      secondaryMuscleGroups: [],
      equipment: EquipmentType.BARBELL,
      difficulty: DifficultyLevel.ADVANCED,
      instructions: [],
      media: { images: [] },
      caloriesPerMinute: 5,
    }).getValue();

    expect(exercise.isUsableInNewProgram()).toBe(true);
    exercise.deprecate();
    expect(exercise.status).toBe(ExerciseStatus.DEPRECATED);
    expect(exercise.isUsableInNewProgram()).toBe(false);
  });

  it('should support trainer-authored exercises with ownership guards', () => {
    const trainerId = 'trainer-123';
    const otherTrainerId = 'trainer-999';

    const exercise = Exercise.create({
      name: 'Deficit Deadlift',
      category: 'Back',
      primaryMuscleGroup: PrimaryMuscleGroup.BACK,
      secondaryMuscleGroups: [PrimaryMuscleGroup.LEGS],
      equipment: EquipmentType.BARBELL,
      difficulty: DifficultyLevel.ADVANCED,
      origin: ExerciseOrigin.TRAINER,
      createdByTrainerId: trainerId,
    }).getValue();

    expect(exercise.origin).toBe(ExerciseOrigin.TRAINER);
    expect(exercise.createdByTrainerId).toBe(trainerId);
    expect(exercise.isCreatedBy(trainerId)).toBe(true);
    expect(exercise.canBeEditedBy(trainerId)).toBe(true);
    expect(exercise.canBeEditedBy(otherTrainerId)).toBe(false);
    expect(exercise.canBeEditedBy(otherTrainerId, 'ADMIN')).toBe(true);
  });

  it('should prevent non-admin from editing platform exercises', () => {
    const platformExercise = Exercise.create({
      name: 'Platform Deadlift',
      category: 'Back',
      primaryMuscleGroup: PrimaryMuscleGroup.BACK,
      secondaryMuscleGroups: [],
      equipment: EquipmentType.BARBELL,
      difficulty: DifficultyLevel.ADVANCED,
      origin: ExerciseOrigin.PLATFORM,
      createdByTrainerId: null,
    }).getValue();

    expect(platformExercise.canBeEditedBy('trainer-123', 'TRAINER')).toBe(false);
    expect(platformExercise.canBeEditedBy('admin-1', 'ADMIN')).toBe(true);
  });
});
