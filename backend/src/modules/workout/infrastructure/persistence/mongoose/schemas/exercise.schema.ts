import mongoose, { Schema, Document, Model } from 'mongoose';
import {
  DifficultyLevel,
  EquipmentType,
  ExerciseOrigin,
  ExerciseStatus,
  PrimaryMuscleGroup,
} from '../../../../domain/enums';

export interface IExerciseInstructionDocument {
  step: number;
  instruction: string;
}

export interface IExerciseMediaDocument {
  thumbnailUrl?: string | null;
  videoUrl?: string | null;
  imageUrls?: string[];
  images?: string[];
}

export interface IExerciseDocument extends Document<string> {
  _id: string;
  name: string;
  slug: string;
  category: string;
  primaryMuscleGroup: PrimaryMuscleGroup;
  secondaryMuscleGroups: PrimaryMuscleGroup[];
  equipment: EquipmentType;
  difficulty: DifficultyLevel;
  instructions: IExerciseInstructionDocument[];
  media: IExerciseMediaDocument;
  caloriesPerMinute: number;
  status: ExerciseStatus;
  origin: ExerciseOrigin;
  createdByTrainerId: string | null;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

const ExerciseInstructionSchema = new Schema<IExerciseInstructionDocument>(
  {
    step: { type: Number, required: true },
    instruction: { type: String, required: true },
  },
  { _id: false },
);

const ExerciseMediaSchema = new Schema<IExerciseMediaDocument>(
  {
    thumbnailUrl: { type: String, default: null },
    videoUrl: { type: String, default: null },
    imageUrls: { type: [String], default: [] },
    images: { type: [String], default: [] },
  },
  { _id: false },
);

export const ExerciseSchema = new Schema<IExerciseDocument>(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: { type: String, required: true, index: true },
    primaryMuscleGroup: {
      type: String,
      enum: Object.values(PrimaryMuscleGroup),
      required: true,
      index: true,
    },
    secondaryMuscleGroups: {
      type: [String],
      enum: Object.values(PrimaryMuscleGroup),
      default: [],
    },
    equipment: {
      type: String,
      enum: Object.values(EquipmentType),
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: Object.values(DifficultyLevel),
      required: true,
      index: true,
    },
    instructions: { type: [ExerciseInstructionSchema], default: [] },
    media: { type: ExerciseMediaSchema, default: () => ({ images: [] }) },
    caloriesPerMinute: { type: Number, default: 5 },
    status: {
      type: String,
      enum: Object.values(ExerciseStatus),
      default: ExerciseStatus.ACTIVE,
      required: true,
      index: true,
    },
    origin: {
      type: String,
      enum: Object.values(ExerciseOrigin),
      default: ExerciseOrigin.PLATFORM,
      required: true,
      index: true,
    },
    createdByTrainerId: {
      type: String,
      default: null,
      index: true,
    },
    createdAt: { type: Date, default: Date.now, index: true },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    collection: 'exercises',
    timestamps: true,
  },
);

// Compound indexes for catalog search & filtering
ExerciseSchema.index({ status: 1, primaryMuscleGroup: 1 });
ExerciseSchema.index({ status: 1, equipment: 1 });
ExerciseSchema.index({ status: 1, difficulty: 1 });
ExerciseSchema.index({ status: 1, createdByTrainerId: 1 });
ExerciseSchema.index({ status: 1, origin: 1 });

export const ExerciseModel: Model<IExerciseDocument> =
  mongoose.models.Exercise || mongoose.model<IExerciseDocument>('Exercise', ExerciseSchema);
