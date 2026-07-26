import { Result } from '../../../../../shared/result/Result';
import { ITrainerProfileRepository } from '../../../domain/repositories/ITrainerProfileRepository';
import { SearchTrainerQuery } from '../../dto/public/search-trainer.query';
import { PublicTrainerProfileResponseDTO } from '../../dto/trainer/trainer-profile.dto';
import { TrainerProfileMapper } from '../../mappers/TrainerProfileMapper';
import { TrainerProfileNotFoundException } from '../../../domain/exceptions/ProfileNotFoundExceptions';
import { TrainerProfile } from '../../../domain/aggregates/TrainerProfile';

export interface PaginatedTrainersResponse {
  data: PublicTrainerProfileResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class SearchTrainersUseCase {
  constructor(private readonly trainerProfileRepo: ITrainerProfileRepository) {}

  public async execute(query: SearchTrainerQuery): Promise<Result<PaginatedTrainersResponse>> {
    const { profiles, total } = await this.trainerProfileRepo.searchTrainers(query);

    const publicDtos = profiles.map((p: TrainerProfile) => TrainerProfileMapper.toPublicDTO(p));
    const totalPages = Math.ceil(total / query.limit) || 1;

    return Result.ok<PaginatedTrainersResponse>({
      data: publicDtos,
      total,
      page: query.page,
      limit: query.limit,
      totalPages,
    });
  }
}

export class GetPublicTrainerProfileUseCase {
  constructor(private readonly trainerProfileRepo: ITrainerProfileRepository) {}

  public async execute(
    trainerIdOrUserId: string,
  ): Promise<Result<PublicTrainerProfileResponseDTO>> {
    let profile = await this.trainerProfileRepo.findById(trainerIdOrUserId);
    if (!profile) {
      profile = await this.trainerProfileRepo.findByUserId(trainerIdOrUserId);
    }

    if (!profile) {
      return Result.fail<PublicTrainerProfileResponseDTO>(
        new TrainerProfileNotFoundException(trainerIdOrUserId).message,
      );
    }

    return Result.ok<PublicTrainerProfileResponseDTO>(TrainerProfileMapper.toPublicDTO(profile));
  }
}
