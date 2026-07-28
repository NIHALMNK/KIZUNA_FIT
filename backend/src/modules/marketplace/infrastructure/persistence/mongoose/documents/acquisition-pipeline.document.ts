import { Document, Types } from 'mongoose';
import { AcquisitionPipelineStatus } from '../../../../domain/enums/acquisition-pipeline-status.enum';
import { TrainerRequestStatus } from '../../../../domain/enums/trainer-request-status.enum';

export interface ITrainerRequestDocument {
  requestId: string;
  clientGoal: string;
  clientMessage?: string;
  status: TrainerRequestStatus;
  submittedAt: Date;
  respondedAt?: Date | null;
  responseReason?: string | null;
}

export interface ITrainerSnapshotDocument {
  trainerId: string;
  fullName: string;
  headline: string;
  profileImage: string;
  specializations: string[];
  yearsOfExperience: number;
  averageRating: number;
  totalReviews: number;
}

export interface IAcquisitionPipelineDocument extends Document {
  _id: Types.ObjectId;
  clientId: Types.ObjectId;
  trainerId: Types.ObjectId;
  trainerRequest: ITrainerRequestDocument;
  trainerSnapshot: ITrainerSnapshotDocument;
  status: AcquisitionPipelineStatus;
  createdAt: Date;
  updatedAt: Date;
}
