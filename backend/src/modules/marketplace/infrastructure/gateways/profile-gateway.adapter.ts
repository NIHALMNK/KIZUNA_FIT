import { Types } from 'mongoose';
import {
  ProfileGateway,
  TrainerEligibilityAndSnapshotInfo,
} from '../../application/ports/profile-gateway.port';
import { TrainerProfileModel } from '../../../profile/infrastructure/persistence/mongoose/models/TrainerProfileModel';

export class ProfileGatewayAdapter implements ProfileGateway {
  public async getTrainerEligibilityAndSnapshot(
    trainerId: string,
  ): Promise<TrainerEligibilityAndSnapshotInfo | null> {
    const query = Types.ObjectId.isValid(trainerId)
      ? { $or: [{ userId: trainerId }, { _id: new Types.ObjectId(trainerId) }] }
      : { userId: trainerId };

    const doc = await TrainerProfileModel.findOne(query).exec();
    if (!doc) {
      return null;
    }

    const docRecord = doc as unknown as Record<string, unknown>;
    const verificationStatus =
      (docRecord.verificationStatus as string) || (doc.profileCompleted ? 'APPROVED' : 'PENDING');
    const availabilityStatus = doc.availability?.status || 'AVAILABLE';

    return {
      eligibility: {
        verificationStatus,
        availabilityStatus,
      },
      snapshot: {
        trainerId: doc.userId || doc._id.toString(),
        fullName: doc.headline || 'Fitness Trainer',
        headline: doc.headline || '',
        profileImage: doc.avatarUrl || '',
        specializations: Array.isArray(doc.specializations)
          ? doc.specializations.map((s) => String(s))
          : [],
        yearsOfExperience: doc.yearsOfExperience || 0,
        averageRating: doc.averageRating || 0,
        totalReviews: doc.totalReviews || 0,
      },
    };
  }
}
