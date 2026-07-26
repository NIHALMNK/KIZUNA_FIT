import { Result } from '../../../../../shared/result/Result';
import { ITrainerProfileRepository } from '../../../domain/repositories/ITrainerProfileRepository';
import { IStorageGateway } from '../../ports/IStorageGateway';
import { AddShowcaseItemDTO, UpdateShowcaseItemDTO } from '../../dto/sub-dtos';
import { TrainerShowcase } from '../../../domain/entities/TrainerShowcase';
import { ShowcaseType } from '../../../domain/enums/TrainerEnums';
import { TrainerProfileNotFoundException } from '../../../domain/exceptions/ProfileNotFoundExceptions';
import { TrainerShowcaseResponseDTO } from '../../dto/trainer/trainer-profile.dto';

export class AddShowcaseItemUseCase {
  constructor(
    private readonly trainerProfileRepo: ITrainerProfileRepository,
    private readonly storageGateway: IStorageGateway,
  ) {}

  public async execute(dto: AddShowcaseItemDTO): Promise<Result<TrainerShowcaseResponseDTO>> {
    const profile = await this.trainerProfileRepo.findByUserId(dto.userId);
    if (!profile) {
      return Result.fail<TrainerShowcaseResponseDTO>(
        new TrainerProfileNotFoundException(dto.userId).message,
      );
    }

    let mediaUrl = dto.mediaUrl;
    if (dto.fileBuffer && dto.fileMimeType) {
      mediaUrl = await this.storageGateway.uploadFile(dto.fileBuffer, dto.fileMimeType, {
        folder: 'showcase/trainers',
      });
    }

    const showRes = TrainerShowcase.create({
      type: (dto.type as ShowcaseType) || ShowcaseType.CERTIFICATE,
      title: dto.title,
      description: dto.description,
      mediaUrl,
      issuedBy: dto.issuedBy,
      achievedAt: dto.achievedAt ? new Date(dto.achievedAt) : undefined,
    });

    if (showRes.isFailure) return Result.fail<TrainerShowcaseResponseDTO>(showRes.error);

    const showcaseItem = showRes.getValue();
    const addRes = profile.addShowcaseItem(showcaseItem);
    if (addRes.isFailure) return Result.fail<TrainerShowcaseResponseDTO>(addRes.error);

    await this.trainerProfileRepo.save(profile);

    return Result.ok<TrainerShowcaseResponseDTO>({
      showcaseId: showcaseItem.showcaseId,
      type: showcaseItem.type,
      title: showcaseItem.title,
      description: showcaseItem.description,
      mediaUrl: showcaseItem.mediaUrl || null,
      issuedBy: showcaseItem.issuedBy || null,
      achievedAt: showcaseItem.achievedAt ? showcaseItem.achievedAt.toISOString() : null,
    });
  }
}

export class GetShowcaseItemsUseCase {
  constructor(private readonly trainerProfileRepo: ITrainerProfileRepository) {}

  public async execute(userId: string): Promise<Result<TrainerShowcaseResponseDTO[]>> {
    const profile = await this.trainerProfileRepo.findByUserId(userId);
    if (!profile) {
      return Result.fail<TrainerShowcaseResponseDTO[]>(
        new TrainerProfileNotFoundException(userId).message,
      );
    }

    const dtos = profile.showcase.map((s: TrainerShowcase) => ({
      showcaseId: s.showcaseId,
      type: s.type,
      title: s.title,
      description: s.description,
      mediaUrl: s.mediaUrl || null,
      issuedBy: s.issuedBy || null,
      achievedAt: s.achievedAt ? s.achievedAt.toISOString() : null,
    }));

    return Result.ok<TrainerShowcaseResponseDTO[]>(dtos);
  }
}

export class UpdateShowcaseItemUseCase {
  constructor(private readonly trainerProfileRepo: ITrainerProfileRepository) {}

  public async execute(dto: UpdateShowcaseItemDTO): Promise<Result<void>> {
    const profile = await this.trainerProfileRepo.findByUserId(dto.userId);
    if (!profile) {
      return Result.fail<void>(new TrainerProfileNotFoundException(dto.userId).message);
    }

    const updateRes = profile.updateShowcaseItem(dto.showcaseId, {
      type: dto.type ? (dto.type as ShowcaseType) : undefined,
      title: dto.title,
      description: dto.description,
      issuedBy: dto.issuedBy,
      achievedAt: dto.achievedAt ? new Date(dto.achievedAt) : undefined,
      mediaUrl: dto.mediaUrl,
    });

    if (updateRes.isFailure) return Result.fail<void>(updateRes.error);

    await this.trainerProfileRepo.save(profile);
    return Result.ok<void>();
  }
}

export class DeleteShowcaseItemUseCase {
  constructor(
    private readonly trainerProfileRepo: ITrainerProfileRepository,
    private readonly storageGateway: IStorageGateway,
  ) {}

  public async execute(userId: string, showcaseId: string): Promise<Result<void>> {
    const profile = await this.trainerProfileRepo.findByUserId(userId);
    if (!profile) {
      return Result.fail<void>(new TrainerProfileNotFoundException(userId).message);
    }

    const item = profile.showcase.find((s: TrainerShowcase) => s.showcaseId === showcaseId);
    if (item && item.mediaUrl) {
      await this.storageGateway.deleteFile(item.mediaUrl);
    }

    const deleteRes = profile.deleteShowcaseItem(showcaseId);
    if (deleteRes.isFailure) return Result.fail<void>(deleteRes.error);

    await this.trainerProfileRepo.save(profile);
    return Result.ok<void>();
  }
}
