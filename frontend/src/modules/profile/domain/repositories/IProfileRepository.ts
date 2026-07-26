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
} from '../types/profile.types';

export interface IProfileRepository {
  // Client Profile
  createClientProfile(dto: CreateClientProfileDTO): Promise<ClientProfile>;
  getClientProfile(): Promise<ClientProfile>;
  updateClientProfile(dto: UpdateClientProfileDTO): Promise<ClientProfile>;
  uploadClientAvatar(file: File): Promise<ClientProfile>;
  deleteClientAvatar(): Promise<ClientProfile>;

  // Trainer Profile
  createTrainerProfile(dto: CreateTrainerProfileDTO): Promise<TrainerProfile>;
  getTrainerProfile(): Promise<TrainerProfile>;
  updateTrainerProfile(dto: UpdateTrainerProfileDTO): Promise<TrainerProfile>;
  uploadTrainerAvatar(file: File): Promise<TrainerProfile>;
  deleteTrainerAvatar(): Promise<TrainerProfile>;

  // Availability
  getTrainerAvailability(): Promise<TrainerAvailability>;
  updateTrainerAvailability(dto: UpdateAvailabilityDTO): Promise<TrainerAvailability>;

  // Certifications
  addCertification(dto: AddCertificationDTO): Promise<TrainerCertification>;
  updateCertification(certificationId: string, dto: UpdateCertificationDTO): Promise<void>;
  deleteCertification(certificationId: string): Promise<void>;

  // Showcase
  addShowcaseItem(dto: AddShowcaseItemDTO): Promise<TrainerShowcase>;
  getShowcaseItems(): Promise<TrainerShowcase[]>;
  updateShowcaseItem(itemId: string, dto: UpdateShowcaseItemDTO): Promise<void>;
  deleteShowcaseItem(itemId: string): Promise<void>;

  // Public & Search
  searchTrainers(params: SearchTrainerParams): Promise<PaginatedTrainersResponse>;
  getPublicTrainerProfile(trainerIdOrUserId: string): Promise<PublicTrainerProfile>;
}
