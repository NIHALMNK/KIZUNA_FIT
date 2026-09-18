/**
 * KIZUNAFIT - Workout Domain Types & Contracts
 * Authoritative frontend domain definitions (SM-08, Domain 8).
 */

export enum ExerciseStatus {
  ACTIVE = 'ACTIVE',
  DEPRECATED = 'DEPRECATED',
}

export enum ExerciseOrigin {
  PLATFORM = 'PLATFORM',
  TRAINER = 'TRAINER',
}

export enum WorkoutProgramStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
}

export enum WorkoutCompletionStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  MISSED = 'MISSED',
}

export enum WorkoutGoal {
  MUSCLE_GAIN = 'MUSCLE_GAIN',
  FAT_LOSS = 'FAT_LOSS',
  STRENGTH = 'STRENGTH',
  ENDURANCE = 'ENDURANCE',
  GENERAL_FITNESS = 'GENERAL_FITNESS',
  MOBILITY = 'MOBILITY',
}

export enum ExerciseType {
  MAIN = 'MAIN',
  ACCESSORY = 'ACCESSORY',
  WARM_UP = 'WARM_UP',
  COOL_DOWN = 'COOL_DOWN',
  CARDIO = 'CARDIO',
}

export enum EquipmentType {
  BODYWEIGHT = 'BODYWEIGHT',
  BARBELL = 'BARBELL',
  DUMBBELL = 'DUMBBELL',
  KETTLEBELL = 'KETTLEBELL',
  MACHINE = 'MACHINE',
  CABLE = 'CABLE',
  RESISTANCE_BAND = 'RESISTANCE_BAND',
  MEDICINE_BALL = 'MEDICINE_BALL',
  OTHER = 'OTHER',
}

export enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum PrimaryMuscleGroup {
  CHEST = 'CHEST',
  BACK = 'BACK',
  SHOULDERS = 'SHOULDERS',
  BICEPS = 'BICEPS',
  TRICEPS = 'TRICEPS',
  LEGS = 'LEGS',
  GLUTES = 'GLUTES',
  CORE = 'CORE',
  FULL_BODY = 'FULL_BODY',
}

export enum CompletionSource {
  CLIENT = 'CLIENT',
  TRAINER = 'TRAINER',
  SYSTEM = 'SYSTEM',
}

export enum WorkoutDifficulty {
  VERY_EASY = 'VERY_EASY',
  EASY = 'EASY',
  MODERATE = 'MODERATE',
  HARD = 'HARD',
  VERY_HARD = 'VERY_HARD',
}

export interface ExerciseInstruction {
  readonly step: number;
  readonly instruction: string;
}

export interface ExerciseMedia {
  readonly thumbnailUrl?: string | null;
  readonly videoUrl?: string | null;
  readonly imageUrls?: string[];
  readonly images?: string[];
}

export interface CreateExerciseDTO {
  readonly name: string;
  readonly category: string;
  readonly primaryMuscleGroup: PrimaryMuscleGroup;
  readonly secondaryMuscleGroups?: PrimaryMuscleGroup[];
  readonly equipment: EquipmentType;
  readonly difficulty: DifficultyLevel;
  readonly instructions?: ExerciseInstruction[];
  readonly media?: ExerciseMedia;
  readonly caloriesPerMinute?: number;
  readonly status?: ExerciseStatus;
}

export interface UpdateExerciseDTO {
  readonly name?: string;
  readonly category?: string;
  readonly primaryMuscleGroup?: PrimaryMuscleGroup;
  readonly secondaryMuscleGroups?: PrimaryMuscleGroup[];
  readonly equipment?: EquipmentType;
  readonly difficulty?: DifficultyLevel;
  readonly instructions?: ExerciseInstruction[];
  readonly media?: ExerciseMedia;
  readonly caloriesPerMinute?: number;
}

export interface ExerciseMediaUploadResponse {
  readonly url: string;
  readonly resourceType: 'image' | 'video';
  readonly mimeType: string;
  readonly sizeBytes: number;
}

export interface Exercise {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly category: string;
  readonly primaryMuscleGroup: PrimaryMuscleGroup;
  readonly secondaryMuscleGroups: PrimaryMuscleGroup[];
  readonly equipment: EquipmentType;
  readonly difficulty: DifficultyLevel;
  readonly instructions: ExerciseInstruction[];
  readonly media: ExerciseMedia;
  readonly caloriesPerMinute: number;
  readonly status: ExerciseStatus;
  readonly origin?: ExerciseOrigin;
  readonly createdByTrainerId?: string | null;
  readonly creatorName?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface ExerciseSnapshot {
  readonly exerciseId: string;
  readonly name: string;
  readonly slug: string;
  readonly category: string;
  readonly primaryMuscleGroup: PrimaryMuscleGroup;
  readonly equipment: EquipmentType;
  readonly difficulty: DifficultyLevel;
}

export interface ExercisePrescription {
  readonly order: number;
  readonly exercise: ExerciseSnapshot;
  readonly type: ExerciseType;
  readonly sets: number;
  readonly reps: string;
  readonly durationSeconds?: number | null;
  readonly restSeconds: number;
  readonly tempo?: string | null;
  readonly notes?: string | null;
}

export interface WorkoutDay {
  readonly id: string;
  readonly dayNumber: number;
  readonly title: string;
  readonly exercises: ExercisePrescription[];
}

export interface WorkoutWeek {
  readonly id: string;
  readonly weekNumber: number;
  readonly title: string;
  readonly days: WorkoutDay[];
}

export interface WorkoutSchedule {
  readonly weeks: number;
  readonly sessionsPerWeek: number;
}

export interface WorkoutProgram {
  readonly id: string;
  readonly coachingRelationshipId: string;
  readonly trainerId: string;
  readonly clientId: string;
  readonly version: number;
  readonly title: string;
  readonly description?: string | null;
  readonly goal: WorkoutGoal;
  readonly schedule: WorkoutSchedule;
  readonly weeks: WorkoutWeek[];
  readonly status: WorkoutProgramStatus;
  readonly activatedAt?: string | null;
  readonly completedAt?: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface WorkoutDaySnapshot {
  readonly weekNumber: number;
  readonly dayNumber: number;
  readonly title: string;
  readonly plannedExercisesCount: number;
}

export interface CompletedSet {
  readonly setNumber: number;
  readonly plannedReps: string;
  readonly completedReps: number;
  readonly weight: number;
  readonly completed: boolean;
  readonly notes?: string | null;
}

export interface CompletedExercise {
  readonly id: string;
  readonly exerciseId: string;
  readonly exerciseName: string;
  readonly completedSets: CompletedSet[];
  readonly notes?: string | null;
}

export interface WorkoutFeedback {
  readonly difficulty: WorkoutDifficulty;
  readonly energyLevel: number;
  readonly notes?: string | null;
}

export interface WorkoutCompletion {
  readonly id: string;
  readonly coachingRelationshipId: string;
  readonly workoutProgramId: string;
  readonly clientId: string;
  readonly trainerId: string;
  readonly workoutDay: number;
  readonly workoutDaySnapshot: WorkoutDaySnapshot;
  readonly completedExercises: CompletedExercise[];
  readonly feedback?: WorkoutFeedback | null;
  readonly status: WorkoutCompletionStatus;
  readonly startedAt: string;
  readonly completedAt?: string | null;
  readonly completedBy: CompletionSource;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface WorkoutHistoryStats {
  readonly totalCompletedSessions: number;
  readonly totalSetsCompleted: number;
  readonly totalVolumeLiftedKg: number;
  readonly recentSessions: WorkoutCompletion[];
}
