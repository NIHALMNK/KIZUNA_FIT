import { Result } from '../../../../../shared/result/Result';
import { ITrainerProfileRepository } from '../../../domain/repositories/ITrainerProfileRepository';
import { UpdateAvailabilityDTO } from '../../dto/sub-dtos';
import { TrainerAvailability } from '../../../domain/value-objects/TrainerAvailability';
import { TrainerProfileNotFoundException } from '../../../domain/exceptions/ProfileNotFoundExceptions';
import { TrainerProfileResponseDTO } from '../../dto/trainer/trainer-profile.dto';
import { TrainerProfileMapper } from '../../mappers/TrainerProfileMapper';

export class GetTrainerAvailabilityUseCase {
  constructor(private readonly trainerProfileRepo: ITrainerProfileRepository) {}

  public async execute(userId: string): Promise<Result<TrainerProfileResponseDTO['availability']>> {
    const profile = await this.trainerProfileRepo.findByUserId(userId);
    if (!profile) {
      return Result.fail(new TrainerProfileNotFoundException(userId).message);
    }
    return Result.ok(TrainerProfileMapper.toDTO(profile).availability);
  }
}

export class UpdateTrainerAvailabilityUseCase {
  constructor(private readonly trainerProfileRepo: ITrainerProfileRepository) {}

  public async execute(
    dto: UpdateAvailabilityDTO,
  ): Promise<Result<TrainerProfileResponseDTO['availability']>> {
    const profile = await this.trainerProfileRepo.findByUserId(dto.userId);
    if (!profile) {
      return Result.fail(new TrainerProfileNotFoundException(dto.userId).message);
    }

    const availRes = TrainerAvailability.create(
      dto.status,
      dto.timezone || profile.availability.timezone,
      dto.weeklySchedule,
    );

    if (availRes.isFailure) {
      return Result.fail(availRes.error);
    }

    const updateRes = profile.updateAvailability(availRes.getValue());
    if (updateRes.isFailure) {
      return Result.fail(updateRes.error);
    }

    await this.trainerProfileRepo.save(profile);
    return Result.ok(TrainerProfileMapper.toDTO(profile).availability);
  }
}
