import { httpClient } from '../../../../infrastructure/api/HttpClient';
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

export class ProfileApi {
  // --- Client Profile ---
  public async createClientProfile(dto: CreateClientProfileDTO): Promise<ClientProfile> {
    return httpClient.post<ClientProfile>('/client-profiles', dto);
  }

  public async getClientProfile(): Promise<ClientProfile> {
    return httpClient.get<ClientProfile>('/client-profiles/me');
  }

  public async updateClientProfile(dto: UpdateClientProfileDTO): Promise<ClientProfile> {
    return httpClient.patch<ClientProfile>('/client-profiles/me', dto);
  }

  public async uploadClientAvatar(file: File): Promise<ClientProfile> {
    const formData = new FormData();
    formData.append('avatar', file);
    return httpClient.post<ClientProfile>('/client-profiles/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  public async deleteClientAvatar(): Promise<ClientProfile> {
    return httpClient.delete<ClientProfile>('/client-profiles/me/avatar');
  }

  // --- Trainer Profile ---
  public async createTrainerProfile(dto: CreateTrainerProfileDTO): Promise<TrainerProfile> {
    return httpClient.post<TrainerProfile>('/trainer-profiles', dto);
  }

  public async getTrainerProfile(): Promise<TrainerProfile> {
    return httpClient.get<TrainerProfile>('/trainer-profiles/me');
  }

  public async updateTrainerProfile(dto: UpdateTrainerProfileDTO): Promise<TrainerProfile> {
    return httpClient.patch<TrainerProfile>('/trainer-profiles/me', dto);
  }

  public async uploadTrainerAvatar(file: File): Promise<TrainerProfile> {
    const formData = new FormData();
    formData.append('avatar', file);
    return httpClient.post<TrainerProfile>('/trainer-profiles/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  public async deleteTrainerAvatar(): Promise<TrainerProfile> {
    return httpClient.delete<TrainerProfile>('/trainer-profiles/me/avatar');
  }

  // --- Availability ---
  public async getTrainerAvailability(): Promise<TrainerAvailability> {
    return httpClient.get<TrainerAvailability>('/trainer-profiles/me/availability');
  }

  public async updateTrainerAvailability(dto: UpdateAvailabilityDTO): Promise<TrainerAvailability> {
    return httpClient.patch<TrainerAvailability>('/trainer-profiles/me/availability', dto);
  }

  // --- Certifications ---
  public async addCertification(dto: AddCertificationDTO): Promise<TrainerCertification> {
    if (dto.file) {
      const formData = new FormData();
      formData.append('file', dto.file);
      formData.append('title', dto.title);
      formData.append('organization', dto.organization);
      formData.append('issuedAt', dto.issuedAt);
      if (dto.expiresAt) formData.append('expiresAt', dto.expiresAt);
      if (dto.certificateUrl) formData.append('certificateUrl', dto.certificateUrl);

      return httpClient.post<TrainerCertification>('/trainer-profiles/me/certifications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    return httpClient.post<TrainerCertification>('/trainer-profiles/me/certifications', dto);
  }

  public async updateCertification(certificationId: string, dto: UpdateCertificationDTO): Promise<void> {
    return httpClient.patch<void>(`/trainer-profiles/me/certifications/${certificationId}`, dto);
  }

  public async deleteCertification(certificationId: string): Promise<void> {
    return httpClient.delete<void>(`/trainer-profiles/me/certifications/${certificationId}`);
  }

  // --- Showcase ---
  public async addShowcaseItem(dto: AddShowcaseItemDTO): Promise<TrainerShowcase> {
    if (dto.file) {
      const formData = new FormData();
      formData.append('file', dto.file);
      formData.append('type', dto.type);
      formData.append('title', dto.title);
      formData.append('description', dto.description);
      if (dto.issuedBy) formData.append('issuedBy', dto.issuedBy);
      if (dto.achievedAt) formData.append('achievedAt', dto.achievedAt);
      if (dto.mediaUrl) formData.append('mediaUrl', dto.mediaUrl);

      return httpClient.post<TrainerShowcase>('/trainer-profiles/me/showcase', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    return httpClient.post<TrainerShowcase>('/trainer-profiles/me/showcase', dto);
  }

  public async getShowcaseItems(): Promise<TrainerShowcase[]> {
    return httpClient.get<TrainerShowcase[]>('/trainer-profiles/me/showcase');
  }

  public async updateShowcaseItem(itemId: string, dto: UpdateShowcaseItemDTO): Promise<void> {
    return httpClient.patch<void>(`/trainer-profiles/me/showcase/${itemId}`, dto);
  }

  public async deleteShowcaseItem(itemId: string): Promise<void> {
    return httpClient.delete<void>(`/trainer-profiles/me/showcase/${itemId}`);
  }

  // --- Public & Search ---
  public async searchTrainers(params: SearchTrainerParams): Promise<PaginatedTrainersResponse> {
    return httpClient.get<PaginatedTrainersResponse>('/trainer-profiles', { params });
  }

  public async getPublicTrainerProfile(trainerIdOrUserId: string): Promise<PublicTrainerProfile> {
    return httpClient.get<PublicTrainerProfile>(`/trainer-profiles/${trainerIdOrUserId}`);
  }
}

export const profileApi = new ProfileApi();
