import { Result } from '../../../../../shared/result/Result';
import { IClientProfileRepository } from '../../../domain/repositories/IClientProfileRepository';
import { ITrainerProfileRepository } from '../../../domain/repositories/ITrainerProfileRepository';
import { IStorageGateway } from '../../ports/IStorageGateway';
import {
  ClientProfileNotFoundException,
  TrainerProfileNotFoundException,
} from '../../../domain/exceptions/ProfileNotFoundExceptions';
import { ClientProfileResponseDTO } from '../../dto/client/client-profile.dto';
import { TrainerProfileResponseDTO } from '../../dto/trainer/trainer-profile.dto';
import { ClientProfileMapper } from '../../mappers/ClientProfileMapper';
import { TrainerProfileMapper } from '../../mappers/TrainerProfileMapper';

export class UploadClientAvatarUseCase {
  constructor(
    private readonly clientProfileRepo: IClientProfileRepository,
    private readonly storageGateway: IStorageGateway,
  ) {}

  public async execute(
    userId: string,
    fileBuffer: Buffer,
    mimeType: string,
  ): Promise<Result<ClientProfileResponseDTO>> {
    const profile = await this.clientProfileRepo.findByUserId(userId);
    if (!profile) {
      return Result.fail<ClientProfileResponseDTO>(
        new ClientProfileNotFoundException(userId).message,
      );
    }

    const avatarUrl = await this.storageGateway.uploadFile(fileBuffer, mimeType, {
      folder: 'avatars/clients',
    });

    const updateRes = profile.updateAvatar(avatarUrl);
    if (updateRes.isFailure) return Result.fail<ClientProfileResponseDTO>(updateRes.error);

    await this.clientProfileRepo.save(profile);
    return Result.ok<ClientProfileResponseDTO>(ClientProfileMapper.toDTO(profile));
  }
}

export class DeleteClientAvatarUseCase {
  constructor(
    private readonly clientProfileRepo: IClientProfileRepository,
    private readonly storageGateway: IStorageGateway,
  ) {}

  public async execute(userId: string): Promise<Result<ClientProfileResponseDTO>> {
    const profile = await this.clientProfileRepo.findByUserId(userId);
    if (!profile) {
      return Result.fail<ClientProfileResponseDTO>(
        new ClientProfileNotFoundException(userId).message,
      );
    }

    if (profile.avatarUrl) {
      await this.storageGateway.deleteFile(profile.avatarUrl);
    }

    const deleteRes = profile.deleteAvatar();
    if (deleteRes.isFailure) return Result.fail<ClientProfileResponseDTO>(deleteRes.error);

    await this.clientProfileRepo.save(profile);
    return Result.ok<ClientProfileResponseDTO>(ClientProfileMapper.toDTO(profile));
  }
}

export class UploadTrainerAvatarUseCase {
  constructor(
    private readonly trainerProfileRepo: ITrainerProfileRepository,
    private readonly storageGateway: IStorageGateway,
  ) {}

  public async execute(
    userId: string,
    fileBuffer: Buffer,
    mimeType: string,
  ): Promise<Result<TrainerProfileResponseDTO>> {
    const profile = await this.trainerProfileRepo.findByUserId(userId);
    if (!profile) {
      return Result.fail<TrainerProfileResponseDTO>(
        new TrainerProfileNotFoundException(userId).message,
      );
    }

    const avatarUrl = await this.storageGateway.uploadFile(fileBuffer, mimeType, {
      folder: 'avatars/trainers',
    });

    const updateRes = profile.updateAvatar(avatarUrl);
    if (updateRes.isFailure) return Result.fail<TrainerProfileResponseDTO>(updateRes.error);

    await this.trainerProfileRepo.save(profile);
    return Result.ok<TrainerProfileResponseDTO>(TrainerProfileMapper.toDTO(profile));
  }
}

export class DeleteTrainerAvatarUseCase {
  constructor(
    private readonly trainerProfileRepo: ITrainerProfileRepository,
    private readonly storageGateway: IStorageGateway,
  ) {}

  public async execute(userId: string): Promise<Result<TrainerProfileResponseDTO>> {
    const profile = await this.trainerProfileRepo.findByUserId(userId);
    if (!profile) {
      return Result.fail<TrainerProfileResponseDTO>(
        new TrainerProfileNotFoundException(userId).message,
      );
    }

    if (profile.avatarUrl) {
      await this.storageGateway.deleteFile(profile.avatarUrl);
    }

    const deleteRes = profile.deleteAvatar();
    if (deleteRes.isFailure) return Result.fail<TrainerProfileResponseDTO>(deleteRes.error);

    await this.trainerProfileRepo.save(profile);
    return Result.ok<TrainerProfileResponseDTO>(TrainerProfileMapper.toDTO(profile));
  }
}
