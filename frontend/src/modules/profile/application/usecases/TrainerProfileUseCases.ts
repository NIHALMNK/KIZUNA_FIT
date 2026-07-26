import { IProfileRepository } from '../../domain/repositories/IProfileRepository';
import { profileRepository } from '../../infrastructure/repositories/ProfileRepositoryImpl';
import {
  TrainerProfile,
  CreateTrainerProfileDTO,
  UpdateTrainerProfileDTO,
} from '../../domain/types/profile.types';

export class TrainerProfileUseCases {
  constructor(private readonly repo: IProfileRepository = profileRepository) {}

  public async createProfile(dto: CreateTrainerProfileDTO): Promise<TrainerProfile> {
    return this.repo.createTrainerProfile(dto);
  }

  public async getProfile(): Promise<TrainerProfile> {
    return this.repo.getTrainerProfile();
  }

  public async updateProfile(dto: UpdateTrainerProfileDTO): Promise<TrainerProfile> {
    return this.repo.updateTrainerProfile(dto);
  }

  public async uploadAvatar(file: File): Promise<TrainerProfile> {
    return this.repo.uploadTrainerAvatar(file);
  }

  public async deleteAvatar(): Promise<TrainerProfile> {
    return this.repo.deleteTrainerAvatar();
  }
}

export const trainerProfileUseCases = new TrainerProfileUseCases();
