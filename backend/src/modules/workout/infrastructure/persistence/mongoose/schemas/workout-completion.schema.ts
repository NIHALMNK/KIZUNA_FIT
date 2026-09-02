import mongoose, { Schema, Document, Model } from 'mongoose';
import {
  CompletionSource,
  WorkoutCompletionStatus,
  WorkoutDifficulty,
} from '../../../../domain/enums';

export interface IWorkoutDaySnapshotDocument {
  weekNumber: number;
  dayNumber: number;
  title: string;
  plannedExercisesCount: number;
}

export interface ICompletedSetDocument {
  setNumber: number;
  plannedReps: string;
  completedReps: number;
  weight: number;
  completed: boolean;
  notes?: string | null;
}

export interface ICompletedExerciseDocument {
  id: string;
  exerciseId: string;
  exerciseName: string;
  completedSets: ICompletedSetDocument[];
  notes?: string | null;
}

export interface IWorkoutFeedbackDocument {
  difficulty: WorkoutDifficulty;
  energyLevel: number;
  notes?: string | null;
}

export interface IWorkoutCompletionDocument extends Document<string> {
  _id: string;
  coachingRelationshipId: string;
  workoutProgramId: string;
  clientId: string;
  trainerId: string;
  workoutDay: number;
  workoutDaySnapshot: IWorkoutDaySnapshotDocument;
  completedExercises: ICompletedExerciseDocument[];
  feedback?: IWorkoutFeedbackDocument | null;
  status: WorkoutCompletionStatus;
  startedAt: Date;
  completedAt?: Date | null;
  completedBy: CompletionSource;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const WorkoutDaySnapshotSchema = new Schema<IWorkoutDaySnapshotDocument>(
  {
    weekNumber: { type: Number, required: true },
    dayNumber: { type: Number, required: true },
    title: { type: String, required: true },
    plannedExercisesCount: { type: Number, required: true },
  },
  { _id: false },
);

const CompletedSetSchema = new Schema<ICompletedSetDocument>(
  {
    setNumber: { type: Number, required: true },
    plannedReps: { type: String, required: true },
    completedReps: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    notes: { type: String, default: null },
  },
  { _id: false },
);

const CompletedExerciseSchema = new Schema<ICompletedExerciseDocument>(
  {
    id: { type: String, required: true },
    exerciseId: { type: String, required: true },
    exerciseName: { type: String, required: true },
    completedSets: { type: [CompletedSetSchema], default: [] },
    notes: { type: String, default: null },
  },
  { _id: false },
);

const WorkoutFeedbackSchema = new Schema<IWorkoutFeedbackDocument>(
  {
    difficulty: {
      type: String,
      enum: Object.values(WorkoutDifficulty),
      required: true,
    },
    energyLevel: { type: Number, min: 1, max: 10, required: true },
    notes: { type: String, default: null },
  },
  { _id: false },
);

export const WorkoutCompletionSchema = new Schema<IWorkoutCompletionDocument>(
  {
    _id: { type: String, required: true },
    coachingRelationshipId: { type: String, required: true, index: true },
    workoutProgramId: { type: String, required: true, index: true },
    clientId: { type: String, required: true, index: true },
    trainerId: { type: String, required: true, index: true },
    workoutDay: { type: Number, required: true, index: true },
    workoutDaySnapshot: { type: WorkoutDaySnapshotSchema, required: true },
    completedExercises: { type: [CompletedExerciseSchema], default: [] },
    feedback: { type: WorkoutFeedbackSchema, default: null },
    status: {
      type: String,
      enum: Object.values(WorkoutCompletionStatus),
      default: WorkoutCompletionStatus.IN_PROGRESS,
      required: true,
      index: true,
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
    completedBy: {
      type: String,
      enum: Object.values(CompletionSource),
      default: CompletionSource.CLIENT,
      required: true,
    },
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: 'workoutCompletions',
    timestamps: true,
  },
);

// Indexes
WorkoutCompletionSchema.index({ clientId: 1, completedAt: -1 });
WorkoutCompletionSchema.index({ coachingRelationshipId: 1, completedAt: -1 });
WorkoutCompletionSchema.index({ workoutProgramId: 1, workoutDay: 1 });
WorkoutCompletionSchema.index({ clientId: 1, workoutProgramId: 1, workoutDay: 1, status: 1 });

export const WorkoutCompletionModel: Model<IWorkoutCompletionDocument> =
  mongoose.models.WorkoutCompletion ||
  mongoose.model<IWorkoutCompletionDocument>('WorkoutCompletion', WorkoutCompletionSchema);
