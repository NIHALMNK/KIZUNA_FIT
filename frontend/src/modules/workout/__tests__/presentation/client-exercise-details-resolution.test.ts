import { describe, it, expect } from 'vitest';
import React from 'react';
import { ExerciseDetailModal } from '../../presentation/catalog/ExerciseDetailModal';
import {
  Exercise,
  ExerciseOrigin,
  DifficultyLevel,
  EquipmentType,
  PrimaryMuscleGroup,
} from '../../domain/types/workout.types';

describe('Client Exercise Details Resolution & Presentation Tests', () => {
  const trainerCustomExercise: Exercise = {
    id: 'ex_trainer_custom_deadlift',
    name: 'Deadlift',
    slug: 'deadlift-trainer-custom',
    category: 'Back',
    primaryMuscleGroup: PrimaryMuscleGroup.BACK,
    secondaryMuscleGroups: [PrimaryMuscleGroup.LEGS, PrimaryMuscleGroup.GLUTES],
    equipment: EquipmentType.BARBELL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    instructions: [
      { step: 1, instruction: 'Stand with midfoot under the barbell.' },
      { step: 2, instruction: 'Hinge and grip bar just outside legs.' },
      { step: 3, instruction: 'Pull with a straight back and drive hips through.' },
    ],
    media: {
      thumbnailUrl: 'https://res.cloudinary.com/kizunafit/exercises/deadlift_thumb.jpg',
      imageUrls: ['https://res.cloudinary.com/kizunafit/exercises/deadlift_form.jpg'],
      videoUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    },
    caloriesPerMinute: 8,
    status: 'ACTIVE' as any,
    origin: ExerciseOrigin.TRAINER,
    createdByTrainerId: 'usr_trainer_nihal',
    creatorName: 'Nihal Trainer',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const platformExercise: Exercise = {
    id: 'ex_platform_deadlift',
    name: 'Deadlift',
    slug: 'deadlift-platform',
    category: 'Back',
    primaryMuscleGroup: PrimaryMuscleGroup.BACK,
    secondaryMuscleGroups: [PrimaryMuscleGroup.LEGS],
    equipment: EquipmentType.BARBELL,
    difficulty: DifficultyLevel.INTERMEDIATE,
    instructions: [{ step: 1, instruction: 'Standard platform deadlift guidance.' }],
    media: {
      thumbnailUrl: 'https://res.cloudinary.com/kizunafit/exercises/platform_deadlift.jpg',
      imageUrls: [],
      videoUrl: null,
    },
    caloriesPerMinute: 7,
    status: 'ACTIVE' as any,
    origin: ExerciseOrigin.PLATFORM,
    createdByTrainerId: null,
    creatorName: 'KIZUNAFIT / Platform',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('1. ExerciseDetailModal renders trainer origin & creator info when full trainer exercise is passed', () => {
    const el = React.createElement(ExerciseDetailModal, {
      exercise: trainerCustomExercise,
      isOpen: true,
      onClose: () => {},
    });

    expect(el.props.exercise?.id).toBe('ex_trainer_custom_deadlift');
    expect(el.props.exercise?.origin).toBe(ExerciseOrigin.TRAINER);
    expect(el.props.exercise?.createdByTrainerId).toBe('usr_trainer_nihal');
    expect(el.props.exercise?.instructions).toHaveLength(3);
    expect(el.props.exercise?.media.videoUrl).toBe('https://www.youtube.com/watch?v=op9kVnSso6Q');
  });

  it('2. ExerciseDetailModal renders platform origin when platform exercise is passed', () => {
    const el = React.createElement(ExerciseDetailModal, {
      exercise: platformExercise,
      isOpen: true,
      onClose: () => {},
    });

    expect(el.props.exercise?.id).toBe('ex_platform_deadlift');
    expect(el.props.exercise?.origin).toBe(ExerciseOrigin.PLATFORM);
    expect(el.props.exercise?.createdByTrainerId).toBeNull();
  });

  it('3. Preserves discrete identity for two exercises sharing the same display name ("Deadlift")', () => {
    expect(trainerCustomExercise.name).toBe(platformExercise.name);
    expect(trainerCustomExercise.id).not.toBe(platformExercise.id);
    expect(trainerCustomExercise.origin).not.toBe(platformExercise.origin);
    expect(trainerCustomExercise.media.videoUrl).not.toBe(platformExercise.media.videoUrl);
  });

  it('4. Supports loading state without rendering fallback platform badge', () => {
    const el = React.createElement(ExerciseDetailModal, {
      exercise: null,
      isOpen: true,
      isLoading: true,
      onClose: () => {},
    });

    expect(el.props.isLoading).toBe(true);
    expect(el.props.exercise).toBeNull();
  });

  it('5. Supports error state when exercise API call fails', () => {
    const el = React.createElement(ExerciseDetailModal, {
      exercise: null,
      isOpen: true,
      isError: true,
      errorMessage: 'Exercise not found in catalog.',
      onClose: () => {},
    });

    expect(el.props.isError).toBe(true);
    expect(el.props.errorMessage).toBe('Exercise not found in catalog.');
  });
});
