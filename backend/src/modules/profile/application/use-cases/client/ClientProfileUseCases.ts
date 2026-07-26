import { Result } from '../../../../../shared/result/Result';
import { IClientProfileRepository } from '../../../domain/repositories/IClientProfileRepository';
import { IIdentityGateway } from '../../ports/IIdentityGateway';
import { ClientProfileFactory } from '../../../domain/factories/ClientProfileFactory';
import { CanCreateClientProfileSpecification } from '../../../domain/specifications/ProfileSpecifications';
import {
  CreateClientProfileDTO,
  UpdateClientProfileDTO,
  ClientProfileResponseDTO,
} from '../../dto/client/client-profile.dto';
import { ClientProfileMapper } from '../../mappers/ClientProfileMapper';
import {
  ClientProfileAlreadyExistsException,
  ClientProfileNotFoundException,
} from '../../../domain/exceptions/ProfileNotFoundExceptions';
import { Weight } from '../../../domain/value-objects/Weight';
import { Height } from '../../../domain/value-objects/Height';

export class CreateClientProfileUseCase {
  constructor(
    private readonly clientProfileRepo: IClientProfileRepository,
    private readonly identityGateway: IIdentityGateway,
  ) {}

  public async execute(dto: CreateClientProfileDTO): Promise<Result<ClientProfileResponseDTO>> {
    const userInfo = await this.identityGateway.getUserAccountInfo(dto.userId);
    if (!userInfo) {
      return Result.fail<ClientProfileResponseDTO>('User account not found');
    }

    const alreadyExists = await this.clientProfileRepo.existsByUserId(dto.userId);
    const specResult = CanCreateClientProfileSpecification.isSatisfiedBy(
      userInfo.role,
      alreadyExists,
    );
    if (specResult.isFailure) {
      if (alreadyExists) {
        return Result.fail<ClientProfileResponseDTO>(
          new ClientProfileAlreadyExistsException(dto.userId).message,
        );
      }
      return Result.fail<ClientProfileResponseDTO>(specResult.error);
    }

    const factoryResult = ClientProfileFactory.createNew({
      userId: dto.userId,
      fullName: dto.fullName,
    });
    if (factoryResult.isFailure) {
      return Result.fail<ClientProfileResponseDTO>(factoryResult.error);
    }

    const profile = factoryResult.getValue();
    await this.clientProfileRepo.save(profile);

    return Result.ok<ClientProfileResponseDTO>(ClientProfileMapper.toDTO(profile));
  }
}

export class GetClientProfileUseCase {
  constructor(private readonly clientProfileRepo: IClientProfileRepository) {}

  public async execute(userId: string): Promise<Result<ClientProfileResponseDTO>> {
    const profile = await this.clientProfileRepo.findByUserId(userId);
    if (!profile) {
      return Result.fail<ClientProfileResponseDTO>(
        new ClientProfileNotFoundException(userId).message,
      );
    }
    return Result.ok<ClientProfileResponseDTO>(ClientProfileMapper.toDTO(profile));
  }
}

export class UpdateClientProfileUseCase {
  constructor(private readonly clientProfileRepo: IClientProfileRepository) {}

  public async execute(dto: UpdateClientProfileDTO): Promise<Result<ClientProfileResponseDTO>> {
    const profile = await this.clientProfileRepo.findByUserId(dto.userId);
    if (!profile) {
      return Result.fail<ClientProfileResponseDTO>(
        new ClientProfileNotFoundException(dto.userId).message,
      );
    }

    let weightObj: Weight | undefined = undefined;
    if (dto.weight) {
      const weightRes = Weight.create(dto.weight.value, dto.weight.unit);
      if (weightRes.isFailure) return Result.fail<ClientProfileResponseDTO>(weightRes.error);
      weightObj = weightRes.getValue();
    }

    let heightObj: Height | undefined = undefined;
    if (dto.height) {
      const heightRes = Height.create(dto.height.value, dto.height.unit);
      if (heightRes.isFailure) return Result.fail<ClientProfileResponseDTO>(heightRes.error);
      heightObj = heightRes.getValue();
    }

    const updateResult = profile.updateDetails({
      fullName: dto.fullName,
      gender: dto.gender,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      phoneNumber: dto.phoneNumber,
      country: dto.country,
      state: dto.state,
      city: dto.city,
      timezone: dto.timezone,
      weight: weightObj,
      height: heightObj,
      medicalNotes: dto.medicalNotes,
      dietaryPreferences: dto.dietaryPreferences,
      fitnessGoals: dto.fitnessGoals,
      experienceLevel: dto.experienceLevel,
      activityLevel: dto.activityLevel,
    });

    if (updateResult.isFailure) {
      return Result.fail<ClientProfileResponseDTO>(updateResult.error);
    }

    await this.clientProfileRepo.save(profile);
    return Result.ok<ClientProfileResponseDTO>(ClientProfileMapper.toDTO(profile));
  }
}
