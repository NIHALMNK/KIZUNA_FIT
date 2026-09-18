import mongoose, { Schema, Document, Model } from 'mongoose';
import {
  DifficultyLevel,
  EquipmentType,
  ExerciseType,
  PrimaryMuscleGroup,
  WorkoutGoal,
  WorkoutProgramStatus,
} from '../../../../domain/enums';

export interface IExerciseSnapshotDocument {
  exerciseId: string;
  name: string;
  slug: string;
  category: string;
  primaryMuscleGroup: PrimaryMuscleGroup;
  equipment: EquipmentType;
  difficulty: DifficultyLevel;
}

export interface IExercisePrescriptionDocument {
  order: number;
  exercise: IExerciseSnapshotDocument;
  type: ExerciseType;
  sets: number;
  reps: string;
  durationSeconds?: number | null;
  restSeconds: number;
  tempo?: string | null;
  notes?: string | null;
}

export interface IWorkoutDayDocument {
  id: string;
  dayNumber: number;
  title: string;
  exercises: IExercisePrescriptionDocument[];
}

export interface IWorkoutWeekDocument {
  id: string;
  weekNumber: number;
  title: string;
  days: IWorkoutDayDocument[];
}

export interface IWorkoutScheduleDocument {
  weeks: number;
  sessionsPerWeek: number;
}

export interface IWorkoutProgramDocument extends Document<string> {
  _id: string;
  coachingRelationshipId: string;
  trainerId: string;
  clientId: string;
  version: number;
  title: string;
  description?: string | null;
  goal: WorkoutGoal;
  schedule: IWorkoutScheduleDocument;
  weeks: IWorkoutWeekDocument[];
  status: WorkoutProgramStatus;
  activatedAt?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const ExerciseSnapshotSchema = new Schema<IExerciseSnapshotDocument>(
  {
    exerciseId: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    category: { type: String, required: true },
    primaryMuscleGroup: {
      type: String,
      enum: Object.values(PrimaryMuscleGroup),
      required: true,
    },
    equipment: {
      type: String,
      enum: Object.values(EquipmentType),
      required: true,
    },
    difficulty: {
      type: String,
      enum: Object.values(DifficultyLevel),
      required: true,
    },
  },
  { _id: false },
);

const ExercisePrescriptionSchema = new Schema<IExercisePrescriptionDocument>(
  {
    order: { type: Number, required: true },
    exercise: { type: ExerciseSnapshotSchema, required: true },
    type: {
      type: String,
      enum: Object.values(ExerciseType),
      default: ExerciseType.MAIN,
    },
    sets: { type: Number, required: true },
    reps: { type: String, required: true },
    durationSeconds: { type: Number, default: null },
    restSeconds: { type: Number, default: 60 },
    tempo: { type: String, default: null },
    notes: { type: String, default: null },
  },
  { _id: false },
);

const WorkoutDaySchema = new Schema<IWorkoutDayDocument>(
  {
    id: { type: String, required: true },
    dayNumber: { type: Number, required: true },
    title: { type: String, required: true },
    exercises: { type: [ExercisePrescriptionSchema], default: [] },
  },
  { _id: false },
);

const WorkoutWeekSchema = new Schema<IWorkoutWeekDocument>(
  {
    id: { type: String, required: true },
    weekNumber: { type: Number, required: true },
    title: { type: String, required: true },
    days: { type: [WorkoutDaySchema], default: [] },
  },
  { _id: false },
);

const WorkoutScheduleSchema = new Schema<IWorkoutScheduleDocument>(
  {
    weeks: { type: Number, required: true, default: 4 },
    sessionsPerWeek: { type: Number, required: true, default: 3 },
  },
  { _id: false },
);

export const WorkoutProgramSchema = new Schema<IWorkoutProgramDocument>(
  {
    _id: { type: String, required: true },
    coachingRelationshipId: { type: String, required: true, index: true },
    trainerId: { type: String, required: true, index: true },
    clientId: { type: String, required: true, index: true },
    version: { type: Number, required: true, default: 1 },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    goal: {
      type: String,
      enum: Object.values(WorkoutGoal),
      required: true,
      default: WorkoutGoal.GENERAL_FITNESS,
    },
    schedule: { type: WorkoutScheduleSchema, required: true },
    weeks: { type: [WorkoutWeekSchema], default: [] },
    status: {
      type: String,
      enum: Object.values(WorkoutProgramStatus),
      default: WorkoutProgramStatus.DRAFT,
      required: true,
      index: true,
    },
    activatedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: 'workoutPrograms',
    timestamps: true,
  },
);

// Indexes
WorkoutProgramSchema.index({ coachingRelationshipId: 1, version: 1 }, { unique: true });
WorkoutProgramSchema.index({ coachingRelationshipId: 1, status: 1 });
WorkoutProgramSchema.index({ clientId: 1, status: 1 });
WorkoutProgramSchema.index({ trainerId: 1, status: 1 });

export const WorkoutProgramModel: Model<IWorkoutProgramDocument> =
  mongoose.models.WorkoutProgram ||
  mongoose.model<IWorkoutProgramDocument>('WorkoutProgram', WorkoutProgramSchema);
