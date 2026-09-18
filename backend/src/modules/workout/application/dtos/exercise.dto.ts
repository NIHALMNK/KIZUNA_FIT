import {
  DifficultyLevel,
  EquipmentType,
  ExerciseOrigin,
  ExerciseStatus,
  PrimaryMuscleGroup,
} from '../../domain/enums';
import { ExerciseInstruction, ExerciseMedia } from '../../domain/aggregates/exercise.aggregate';

export interface CreateExerciseDto {
  name: string;
  category: string;
  primaryMuscleGroup: PrimaryMuscleGroup;
  secondaryMuscleGroups?: PrimaryMuscleGroup[];
  equipment: EquipmentType;
  difficulty: DifficultyLevel;
  instructions?: ExerciseInstruction[];
  media?: ExerciseMedia;
  caloriesPerMinute?: number;
}

export interface UpdateExerciseDto {
  name?: string;
  category?: string;
  primaryMuscleGroup?: PrimaryMuscleGroup;
  secondaryMuscleGroups?: PrimaryMuscleGroup[];
  equipment?: EquipmentType;
  difficulty?: DifficultyLevel;
  instructions?: ExerciseInstruction[];
  media?: ExerciseMedia;
  caloriesPerMinute?: number;
}

export interface ExerciseResponseDto {
  id: string;
  name: string;
  slug: string;
  category: string;
  primaryMuscleGroup: PrimaryMuscleGroup;
  secondaryMuscleGroups: PrimaryMuscleGroup[];
  equipment: EquipmentType;
  difficulty: DifficultyLevel;
  instructions: ExerciseInstruction[];
  media: ExerciseMedia;
  caloriesPerMinute: number;
  status: ExerciseStatus;
  origin: ExerciseOrigin;
  createdByTrainerId: string | null;
  creatorName?: string | null;
  createdAt: string;
  updatedAt: string;
}
