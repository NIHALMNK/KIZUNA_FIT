import { IProfileRepository } from '../../domain/repositories/IProfileRepository';
import { profileRepository } from '../../infrastructure/repositories/ProfileRepositoryImpl';
import {
  TrainerAvailability,
  UpdateAvailabilityDTO,
} from '../../domain/types/profile.types';

export class AvailabilityUseCases {
  constructor(private readonly repo: IProfileRepository = profileRepository) {}

  public async getAvailability(): Promise<TrainerAvailability> {
    return this.repo.getTrainerAvailability();
  }

  public async updateAvailability(dto: UpdateAvailabilityDTO): Promise<TrainerAvailability> {
    return this.repo.updateTrainerAvailability(dto);
  }
}

export const availabilityUseCases = new AvailabilityUseCases();
