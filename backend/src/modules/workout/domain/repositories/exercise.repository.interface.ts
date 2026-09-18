import { Exercise } from '../aggregates/exercise.aggregate';
import {
  DifficultyLevel,
  EquipmentType,
  ExerciseOrigin,
  ExerciseStatus,
  PrimaryMuscleGroup,
} from '../enums';

export interface ExerciseFilterOptions {
  category?: string;
  primaryMuscleGroup?: PrimaryMuscleGroup;
  equipment?: EquipmentType;
  difficulty?: DifficultyLevel;
  status?: ExerciseStatus;
  origin?: ExerciseOrigin;
  createdByTrainerId?: string;
  mine?: boolean;
  searchQuery?: string;
  limit?: number;
  skip?: number;
}

export interface IExerciseRepository {
  findById(id: string): Promise<Exercise | null>;
  findBySlug(slug: string): Promise<Exercise | null>;
  findByName(name: string): Promise<Exercise | null>;
  findMany(options?: ExerciseFilterOptions): Promise<Exercise[]>;
  count(options?: ExerciseFilterOptions): Promise<number>;
  save(exercise: Exercise): Promise<void>;
  saveMany(exercises: Exercise[]): Promise<void>;
}
