import { describe, it, expect } from 'vitest';
import {
  ExerciseStatus,
  WorkoutProgramStatus,
  WorkoutCompletionStatus,
  WorkoutGoal,
  ExerciseType,
  EquipmentType,
  DifficultyLevel,
  PrimaryMuscleGroup,
} from '../../domain/types/workout.types';

describe('Frontend Workout Domain & Types Tests', () => {
  it('should expose authoritative status enums', () => {
    expect(ExerciseStatus.ACTIVE).toBe('ACTIVE');
    expect(ExerciseStatus.DEPRECATED).toBe('DEPRECATED');

    expect(WorkoutProgramStatus.DRAFT).toBe('DRAFT');
    expect(WorkoutProgramStatus.ACTIVE).toBe('ACTIVE');
    expect(WorkoutProgramStatus.COMPLETED).toBe('COMPLETED');

    expect(WorkoutCompletionStatus.IN_PROGRESS).toBe('IN_PROGRESS');
    expect(WorkoutCompletionStatus.COMPLETED).toBe('COMPLETED');
    expect(WorkoutCompletionStatus.MISSED).toBe('MISSED');
  });

  it('should expose valid training goals', () => {
    expect(WorkoutGoal.MUSCLE_GAIN).toBe('MUSCLE_GAIN');
    expect(WorkoutGoal.FAT_LOSS).toBe('FAT_LOSS');
    expect(WorkoutGoal.STRENGTH).toBe('STRENGTH');
    expect(WorkoutGoal.ENDURANCE).toBe('ENDURANCE');
    expect(WorkoutGoal.GENERAL_FITNESS).toBe('GENERAL_FITNESS');
    expect(WorkoutGoal.MOBILITY).toBe('MOBILITY');
  });

  it('should expose equipment and muscle group enums', () => {
    expect(PrimaryMuscleGroup.CHEST).toBe('CHEST');
    expect(PrimaryMuscleGroup.BACK).toBe('BACK');
    expect(PrimaryMuscleGroup.LEGS).toBe('LEGS');
    expect(EquipmentType.BARBELL).toBe('BARBELL');
    expect(DifficultyLevel.INTERMEDIATE).toBe('INTERMEDIATE');
    expect(ExerciseType.MAIN).toBe('MAIN');
  });
});
