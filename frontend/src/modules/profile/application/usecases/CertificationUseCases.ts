import { IProfileRepository } from '../../domain/repositories/IProfileRepository';
import { profileRepository } from '../../infrastructure/repositories/ProfileRepositoryImpl';
import {
  TrainerCertification,
  AddCertificationDTO,
  UpdateCertificationDTO,
} from '../../domain/types/profile.types';

export class CertificationUseCases {
  constructor(private readonly repo: IProfileRepository = profileRepository) {}

  public async addCertification(dto: AddCertificationDTO): Promise<TrainerCertification> {
    return this.repo.addCertification(dto);
  }

  public async updateCertification(certificationId: string, dto: UpdateCertificationDTO): Promise<void> {
    return this.repo.updateCertification(certificationId, dto);
  }

  public async deleteCertification(certificationId: string): Promise<void> {
    return this.repo.deleteCertification(certificationId);
  }
}

export const certificationUseCases = new CertificationUseCases();
