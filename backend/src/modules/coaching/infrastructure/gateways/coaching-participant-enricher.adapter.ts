import { Types } from 'mongoose';
import {
  ICoachingParticipantEnricher,
  ParticipantSummaryDTO,
} from '../../application/ports/coaching-participant-enricher.port';
import {
  CoachingRelationshipDTO,
  CoachingRelationshipListItemDTO,
} from '../../application/dtos/coaching-relationship.dto';
import { UserModel } from '../../../identity/infrastructure/persistence/mongoose/models/UserModel';
import { TrainerProfileModel } from '../../../profile/infrastructure/persistence/mongoose/models/TrainerProfileModel';
import { ClientProfileModel } from '../../../profile/infrastructure/persistence/mongoose/models/ClientProfileModel';
import { CoachingOfferModel } from '../../../offer/infrastructure/persistence/mongoose/schemas/coaching-offer.schema';

export class CoachingParticipantEnricherAdapter implements ICoachingParticipantEnricher {
  private formatTrainerSummary(
    userId: string,
    userDoc?: any,
    trainerDoc?: any,
  ): ParticipantSummaryDTO {
    const fullName =
      userDoc?.fullName ||
      trainerDoc?.headline ||
      (userId ? `Trainer #${userId.slice(-6)}` : 'Fitness Trainer');

    const specialization =
      Array.isArray(trainerDoc?.specializations) && trainerDoc.specializations.length > 0
        ? trainerDoc.specializations[0]
        : 'Certified Trainer';

    return {
      id: userId,
      fullName,
      avatarUrl: trainerDoc?.avatarUrl || null,
      specialization,
      experienceYears: trainerDoc?.yearsOfExperience ?? null,
    };
  }

  private formatClientSummary(
    userId: string,
    userDoc?: any,
    clientDoc?: any,
  ): ParticipantSummaryDTO {
    const fullName =
      clientDoc?.fullName ||
      userDoc?.fullName ||
      (userId ? `Client #${userId.slice(-6)}` : 'Client');

    return {
      id: userId,
      fullName,
      avatarUrl: clientDoc?.avatarUrl || null,
    };
  }

  public async enrichRelationship(dto: CoachingRelationshipDTO): Promise<CoachingRelationshipDTO> {
    try {
      const userIds = [dto.trainerId, dto.clientId].filter(Boolean);
      const validObjectIds = userIds
        .filter((id) => Types.ObjectId.isValid(id))
        .map((id) => new Types.ObjectId(id));

      const [users, trainerProfiles, clientProfiles, offer] = await Promise.all([
        UserModel.find({ _id: { $in: validObjectIds } })
          .lean()
          .exec(),
        TrainerProfileModel.find({
          $or: [{ userId: { $in: userIds } }, { _id: { $in: userIds } }],
        })
          .lean()
          .exec(),
        ClientProfileModel.find({
          $or: [{ userId: { $in: userIds } }, { _id: { $in: userIds } }],
        })
          .lean()
          .exec(),
        dto.acquisitionPipelineId
          ? CoachingOfferModel.findOne({ acquisitionPipelineId: dto.acquisitionPipelineId })
              .lean()
              .exec()
          : null,
      ]);

      const userMap = new Map<string, any>();
      for (const u of users) {
        userMap.set(u._id.toString(), u);
      }

      const trainerMap = new Map<string, any>();
      for (const t of trainerProfiles) {
        if (t.userId) trainerMap.set(t.userId.toString(), t);
        if (t._id) trainerMap.set(t._id.toString(), t);
      }

      const clientMap = new Map<string, any>();
      for (const c of clientProfiles) {
        if (c.userId) clientMap.set(c.userId.toString(), c);
        if (c._id) clientMap.set(c._id.toString(), c);
      }

      const trainer = this.formatTrainerSummary(
        dto.trainerId,
        userMap.get(dto.trainerId),
        trainerMap.get(dto.trainerId),
      );

      const client = this.formatClientSummary(
        dto.clientId,
        userMap.get(dto.clientId),
        clientMap.get(dto.clientId),
      );

      const durationDays = offer?.scopeSnapshot?.durationDays ?? 30;
      const planType = offer?.scopeSnapshot?.planType ?? 'PRO';
      const startedAt = dto.timeline?.activatedAt || dto.createdAt;
      let endsAt: string | null = null;
      if (startedAt && durationDays) {
        const startMillis = new Date(startedAt).getTime();
        endsAt = new Date(startMillis + durationDays * 24 * 60 * 60 * 1000).toISOString();
      }

      return {
        ...dto,
        trainer,
        client,
        durationDays,
        planType,
        startedAt,
        endsAt,
      };
    } catch {
      // Fallback gracefully without breaking domain execution
      return {
        ...dto,
        trainer: { id: dto.trainerId, fullName: `Coach #${dto.trainerId.slice(-6)}` },
        client: { id: dto.clientId, fullName: `Client #${dto.clientId.slice(-6)}` },
        startedAt: dto.timeline?.activatedAt || dto.createdAt,
        durationDays: 30,
      };
    }
  }

  public async enrichRelationshipList(
    items: CoachingRelationshipListItemDTO[],
  ): Promise<CoachingRelationshipListItemDTO[]> {
    if (!items || items.length === 0) return [];

    try {
      const allUserIds = Array.from(
        new Set(items.flatMap((i) => [i.trainer?.id, i.client?.id]).filter(Boolean) as string[]),
      );

      const validObjectIds = allUserIds
        .filter((id) => Types.ObjectId.isValid(id))
        .map((id) => new Types.ObjectId(id));

      const pipelineIds = Array.from(
        new Set(items.map((i) => i.acquisitionPipelineId).filter(Boolean)),
      );

      const [users, trainerProfiles, clientProfiles, offers] = await Promise.all([
        UserModel.find({ _id: { $in: validObjectIds } })
          .lean()
          .exec(),
        TrainerProfileModel.find({
          $or: [{ userId: { $in: allUserIds } }, { _id: { $in: allUserIds } }],
        })
          .lean()
          .exec(),
        ClientProfileModel.find({
          $or: [{ userId: { $in: allUserIds } }, { _id: { $in: allUserIds } }],
        })
          .lean()
          .exec(),
        pipelineIds.length > 0
          ? CoachingOfferModel.find({ acquisitionPipelineId: { $in: pipelineIds } })
              .lean()
              .exec()
          : [],
      ]);

      const userMap = new Map<string, any>();
      for (const u of users) {
        userMap.set(u._id.toString(), u);
      }

      const trainerMap = new Map<string, any>();
      for (const t of trainerProfiles) {
        if (t.userId) trainerMap.set(t.userId.toString(), t);
        if (t._id) trainerMap.set(t._id.toString(), t);
      }

      const clientMap = new Map<string, any>();
      for (const c of clientProfiles) {
        if (c.userId) clientMap.set(c.userId.toString(), c);
        if (c._id) clientMap.set(c._id.toString(), c);
      }

      const offerMap = new Map<string, any>();
      for (const off of offers) {
        offerMap.set(off.acquisitionPipelineId, off);
      }

      return items.map((item) => {
        const trainerId = item.trainer?.id;
        const clientId = item.client?.id;
        const offer = offerMap.get(item.acquisitionPipelineId);

        const trainer = this.formatTrainerSummary(
          trainerId,
          userMap.get(trainerId),
          trainerMap.get(trainerId),
        );

        const client = this.formatClientSummary(
          clientId,
          userMap.get(clientId),
          clientMap.get(clientId),
        );

        const durationDays = offer?.scopeSnapshot?.durationDays ?? item.durationDays ?? 30;
        const planType = offer?.scopeSnapshot?.planType ?? item.planType ?? 'PRO';
        const startedAt = item.startedAt || item.createdAt;
        let endsAt: string | null = null;
        if (startedAt && durationDays) {
          const startMillis = new Date(startedAt).getTime();
          endsAt = new Date(startMillis + durationDays * 24 * 60 * 60 * 1000).toISOString();
        }

        return {
          ...item,
          trainer,
          client,
          durationDays,
          planType,
          startedAt,
          endsAt,
        };
      });
    } catch {
      return items;
    }
  }
}
