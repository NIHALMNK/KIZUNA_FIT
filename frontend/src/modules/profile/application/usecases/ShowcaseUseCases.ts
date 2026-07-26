import { IProfileRepository } from '../../domain/repositories/IProfileRepository';
import { profileRepository } from '../../infrastructure/repositories/ProfileRepositoryImpl';
import {
  TrainerShowcase,
  AddShowcaseItemDTO,
  UpdateShowcaseItemDTO,
} from '../../domain/types/profile.types';

export class ShowcaseUseCases {
  constructor(private readonly repo: IProfileRepository = profileRepository) {}

  public async addShowcaseItem(dto: AddShowcaseItemDTO): Promise<TrainerShowcase> {
    return this.repo.addShowcaseItem(dto);
  }

  public async getShowcaseItems(): Promise<TrainerShowcase[]> {
    return this.repo.getShowcaseItems();
  }

  public async updateShowcaseItem(itemId: string, dto: UpdateShowcaseItemDTO): Promise<void> {
    return this.repo.updateShowcaseItem(itemId, dto);
  }

  public async deleteShowcaseItem(itemId: string): Promise<void> {
    return this.repo.deleteShowcaseItem(itemId);
  }
}

export const showcaseUseCases = new ShowcaseUseCases();
