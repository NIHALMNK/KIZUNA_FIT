import { Result } from '../../../../../shared/result/Result';
import { ITrainerProfileRepository } from '../../../domain/repositories/ITrainerProfileRepository';
import { IIdentityGateway } from '../../ports/IIdentityGateway';
import { TrainerProfileFactory } from '../../../domain/factories/TrainerProfileFactory';
import { CanCreateTrainerProfileSpecification } from '../../../domain/specifications/ProfileSpecifications';
import {
  CreateTrainerProfileDTO,
  UpdateTrainerProfileDTO,
  TrainerProfileResponseDTO,
} from '../../dto/trainer/trainer-profile.dto';
import { TrainerProfileMapper } from '../../mappers/TrainerProfileMapper';
import {
  TrainerProfileAlreadyExistsException,
  TrainerProfileNotFoundException,
} from '../../../domain/exceptions/ProfileNotFoundExceptions';
import { TrainerLocation } from '../../../domain/value-objects/TrainerLocation';

export class CreateTrainerProfileUseCase {
  constructor(
    private readonly trainerProfileRepo: ITrainerProfileRepository,
    private readonly identityGateway: IIdentityGateway,
  ) {}

  public async execute(dto: CreateTrainerProfileDTO): Promise<Result<TrainerProfileResponseDTO>> {
    const userInfo = await this.identityGateway.getUserAccountInfo(dto.userId);
    if (!userInfo) {
      return Result.fail<TrainerProfileResponseDTO>('User account not found');
    }

    const alreadyExists = await this.trainerProfileRepo.existsByUserId(dto.userId);
    const specResult = CanCreateTrainerProfileSpecification.isSatisfiedBy(
      userInfo.role,
      alreadyExists,
    );
    if (specResult.isFailure) {
      if (alreadyExists) {
        return Result.fail<TrainerProfileResponseDTO>(
          new TrainerProfileAlreadyExistsException(dto.userId).message,
        );
      }
      return Result.fail<TrainerProfileResponseDTO>(specResult.error);
    }

    const factoryResult = TrainerProfileFactory.createNew({
      userId: dto.userId,
      headline: dto.headline,
      bio: dto.bio,
      yearsOfExperience: dto.yearsOfExperience,
      languages: dto.languages,
      specializations: dto.specializations,
      city: dto.city,
      state: dto.state,
      country: dto.country,
      timezone: dto.timezone,
    });
    if (factoryResult.isFailure) {
      return Result.fail<TrainerProfileResponseDTO>(factoryResult.error);
    }

    const profile = factoryResult.getValue();
    await this.trainerProfileRepo.save(profile);

    return Result.ok<TrainerProfileResponseDTO>(TrainerProfileMapper.toDTO(profile));
  }
}

export class GetTrainerProfileUseCase {
  constructor(private readonly trainerProfileRepo: ITrainerProfileRepository) {}

  public async execute(userId: string): Promise<Result<TrainerProfileResponseDTO>> {
    const profile = await this.trainerProfileRepo.findByUserId(userId);
    if (!profile) {
      return Result.fail<TrainerProfileResponseDTO>(
        new TrainerProfileNotFoundException(userId).message,
      );
    }
    return Result.ok<TrainerProfileResponseDTO>(TrainerProfileMapper.toDTO(profile));
  }
}

export class UpdateTrainerProfileUseCase {
  constructor(private readonly trainerProfileRepo: ITrainerProfileRepository) {}

  public async execute(dto: UpdateTrainerProfileDTO): Promise<Result<TrainerProfileResponseDTO>> {
    const profile = await this.trainerProfileRepo.findByUserId(dto.userId);
    if (!profile) {
      return Result.fail<TrainerProfileResponseDTO>(
        new TrainerProfileNotFoundException(dto.userId).message,
      );
    }

    let locationObj: TrainerLocation | undefined = undefined;
    if (dto.city && dto.state && dto.country) {
      const locRes = TrainerLocation.create(dto.city, dto.state, dto.country);
      if (locRes.isFailure) return Result.fail<TrainerProfileResponseDTO>(locRes.error);
      locationObj = locRes.getValue();
    }

    const updateResult = profile.updateDetails({
      headline: dto.headline,
      bio: dto.bio,
      yearsOfExperience: dto.yearsOfExperience,
      languages: dto.languages,
      specializations: dto.specializations,
      location: locationObj,
    });

    if (updateResult.isFailure) {
      return Result.fail<TrainerProfileResponseDTO>(updateResult.error);
    }

    await this.trainerProfileRepo.save(profile);
    return Result.ok<TrainerProfileResponseDTO>(TrainerProfileMapper.toDTO(profile));
  }
}
