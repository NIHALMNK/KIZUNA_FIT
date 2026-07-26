import { IProfileRepository } from '../../domain/repositories/IProfileRepository';
import { profileRepository } from '../../infrastructure/repositories/ProfileRepositoryImpl';
import {
  ClientProfile,
  CreateClientProfileDTO,
  UpdateClientProfileDTO,
} from '../../domain/types/profile.types';

export class ClientProfileUseCases {
  constructor(private readonly repo: IProfileRepository = profileRepository) {}

  public async createProfile(dto: CreateClientProfileDTO): Promise<ClientProfile> {
    return this.repo.createClientProfile(dto);
  }

  public async getProfile(): Promise<ClientProfile> {
    return this.repo.getClientProfile();
  }

  public async updateProfile(dto: UpdateClientProfileDTO): Promise<ClientProfile> {
    return this.repo.updateClientProfile(dto);
  }

  public async uploadAvatar(file: File): Promise<ClientProfile> {
    return this.repo.uploadClientAvatar(file);
  }

  public async deleteAvatar(): Promise<ClientProfile> {
    return this.repo.deleteClientAvatar();
  }
}

export const clientProfileUseCases = new ClientProfileUseCases();
