import { IProfileRepository } from '../../domain/repositories/IProfileRepository';
import { profileRepository } from '../../infrastructure/repositories/ProfileRepositoryImpl';
import {
  PublicTrainerProfile,
  SearchTrainerParams,
  PaginatedTrainersResponse,
} from '../../domain/types/profile.types';

export class PublicTrainerUseCases {
  constructor(private readonly repo: IProfileRepository = profileRepository) {}

  public async searchTrainers(params: SearchTrainerParams): Promise<PaginatedTrainersResponse> {
    return this.repo.searchTrainers(params);
  }

  public async getPublicProfile(trainerIdOrUserId: string): Promise<PublicTrainerProfile> {
    return this.repo.getPublicTrainerProfile(trainerIdOrUserId);
  }
}

export const publicTrainerUseCases = new PublicTrainerUseCases();
