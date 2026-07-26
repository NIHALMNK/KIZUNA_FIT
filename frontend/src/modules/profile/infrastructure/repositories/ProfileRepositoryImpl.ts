import { IProfileRepository } from '../../domain/repositories/IProfileRepository';
import { ProfileApi, profileApi } from '../api/profileApi';
import {
  ClientProfile,
  CreateClientProfileDTO,
  UpdateClientProfileDTO,
  TrainerProfile,
  CreateTrainerProfileDTO,
  UpdateTrainerProfileDTO,
  TrainerAvailability,
  UpdateAvailabilityDTO,
  TrainerCertification,
  AddCertificationDTO,
  UpdateCertificationDTO,
  TrainerShowcase,
  AddShowcaseItemDTO,
  UpdateShowcaseItemDTO,
  PublicTrainerProfile,
  SearchTrainerParams,
  PaginatedTrainersResponse,
} from '../../domain/types/profile.types';

export class ProfileRepositoryImpl implements IProfileRepository {
  constructor(private readonly api: ProfileApi = profileApi) {}

  public async createClientProfile(dto: CreateClientProfileDTO): Promise<ClientProfile> {
    return this.api.createClientProfile(dto);
  }

  public async getClientProfile(): Promise<ClientProfile> {
    return this.api.getClientProfile();
  }

  public async updateClientProfile(dto: UpdateClientProfileDTO): Promise<ClientProfile> {
    return this.api.updateClientProfile(dto);
  }

  public async uploadClientAvatar(file: File): Promise<ClientProfile> {
    return this.api.uploadClientAvatar(file);
  }

  public async deleteClientAvatar(): Promise<ClientProfile> {
    return this.api.deleteClientAvatar();
  }

  public async createTrainerProfile(dto: CreateTrainerProfileDTO): Promise<TrainerProfile> {
    return this.api.createTrainerProfile(dto);
  }

  public async getTrainerProfile(): Promise<TrainerProfile> {
    return this.api.getTrainerProfile();
  }

  public async updateTrainerProfile(dto: UpdateTrainerProfileDTO): Promise<TrainerProfile> {
    return this.api.updateTrainerProfile(dto);
  }

  public async uploadTrainerAvatar(file: File): Promise<TrainerProfile> {
    return this.api.uploadTrainerAvatar(file);
  }

  public async deleteTrainerAvatar(): Promise<TrainerProfile> {
    return this.api.deleteTrainerAvatar();
  }

  public async getTrainerAvailability(): Promise<TrainerAvailability> {
    return this.api.getTrainerAvailability();
  }

  public async updateTrainerAvailability(dto: UpdateAvailabilityDTO): Promise<TrainerAvailability> {
    return this.api.updateTrainerAvailability(dto);
  }

  public async addCertification(dto: AddCertificationDTO): Promise<TrainerCertification> {
    return this.api.addCertification(dto);
  }

  public async updateCertification(certificationId: string, dto: UpdateCertificationDTO): Promise<void> {
    return this.api.updateCertification(certificationId, dto);
  }

  public async deleteCertification(certificationId: string): Promise<void> {
    return this.api.deleteCertification(certificationId);
  }

  public async addShowcaseItem(dto: AddShowcaseItemDTO): Promise<TrainerShowcase> {
    return this.api.addShowcaseItem(dto);
  }

  public async getShowcaseItems(): Promise<TrainerShowcase[]> {
    return this.api.getShowcaseItems();
  }

  public async updateShowcaseItem(itemId: string, dto: UpdateShowcaseItemDTO): Promise<void> {
    return this.api.updateShowcaseItem(itemId, dto);
  }

  public async deleteShowcaseItem(itemId: string): Promise<void> {
    return this.api.deleteShowcaseItem(itemId);
  }

  public async searchTrainers(params: SearchTrainerParams): Promise<PaginatedTrainersResponse> {
    return this.api.searchTrainers(params);
  }

  public async getPublicTrainerProfile(trainerIdOrUserId: string): Promise<PublicTrainerProfile> {
    return this.api.getPublicTrainerProfile(trainerIdOrUserId);
  }
}

export const profileRepository = new ProfileRepositoryImpl();
