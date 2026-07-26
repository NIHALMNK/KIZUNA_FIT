import { Result } from '../../../../../shared/result/Result';
import { ITrainerProfileRepository } from '../../../domain/repositories/ITrainerProfileRepository';
import { IStorageGateway } from '../../ports/IStorageGateway';
import { AddCertificationDTO, UpdateCertificationDTO } from '../../dto/sub-dtos';
import { TrainerCertification } from '../../../domain/entities/TrainerCertification';
import { CertificationStatus } from '../../../domain/enums/TrainerEnums';
import { TrainerProfileNotFoundException } from '../../../domain/exceptions/ProfileNotFoundExceptions';
import { TrainerCertificationResponseDTO } from '../../dto/trainer/trainer-profile.dto';

export class AddTrainerCertificationUseCase {
  constructor(
    private readonly trainerProfileRepo: ITrainerProfileRepository,
    private readonly storageGateway: IStorageGateway,
  ) {}

  public async execute(dto: AddCertificationDTO): Promise<Result<TrainerCertificationResponseDTO>> {
    const profile = await this.trainerProfileRepo.findByUserId(dto.userId);
    if (!profile) {
      return Result.fail<TrainerCertificationResponseDTO>(
        new TrainerProfileNotFoundException(dto.userId).message,
      );
    }

    let certificateUrl = dto.certificateUrl;
    if (dto.fileBuffer && dto.fileMimeType) {
      certificateUrl = await this.storageGateway.uploadFile(dto.fileBuffer, dto.fileMimeType, {
        folder: 'certifications/trainers',
      });
    }

    if (!certificateUrl) {
      return Result.fail<TrainerCertificationResponseDTO>('Certificate URL or file is required');
    }

    const certRes = TrainerCertification.create({
      title: dto.title,
      organization: dto.organization,
      issuedAt: new Date(dto.issuedAt),
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      certificateUrl,
      status: CertificationStatus.PENDING,
    });

    if (certRes.isFailure) {
      return Result.fail<TrainerCertificationResponseDTO>(certRes.error);
    }

    const cert = certRes.getValue();
    const addRes = profile.addCertification(cert);
    if (addRes.isFailure) return Result.fail<TrainerCertificationResponseDTO>(addRes.error);

    await this.trainerProfileRepo.save(profile);

    return Result.ok<TrainerCertificationResponseDTO>({
      certificationId: cert.certificationId,
      title: cert.title,
      organization: cert.organization,
      issuedAt: cert.issuedAt.toISOString(),
      expiresAt: cert.expiresAt ? cert.expiresAt.toISOString() : null,
      certificateUrl: cert.certificateUrl,
      status: cert.status,
      rejectionReason: cert.rejectionReason || null,
      verifiedAt: cert.verifiedAt ? cert.verifiedAt.toISOString() : null,
    });
  }
}

export class UpdateTrainerCertificationUseCase {
  constructor(private readonly trainerProfileRepo: ITrainerProfileRepository) {}

  public async execute(dto: UpdateCertificationDTO): Promise<Result<void>> {
    const profile = await this.trainerProfileRepo.findByUserId(dto.userId);
    if (!profile) {
      return Result.fail<void>(new TrainerProfileNotFoundException(dto.userId).message);
    }

    const updateRes = profile.updateCertification(dto.certificationId, {
      title: dto.title,
      organization: dto.organization,
      issuedAt: dto.issuedAt ? new Date(dto.issuedAt) : undefined,
      expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
      certificateUrl: dto.certificateUrl,
    });

    if (updateRes.isFailure) return Result.fail<void>(updateRes.error);

    await this.trainerProfileRepo.save(profile);
    return Result.ok<void>();
  }
}

export class DeleteTrainerCertificationUseCase {
  constructor(
    private readonly trainerProfileRepo: ITrainerProfileRepository,
    private readonly storageGateway: IStorageGateway,
  ) {}

  public async execute(userId: string, certificationId: string): Promise<Result<void>> {
    const profile = await this.trainerProfileRepo.findByUserId(userId);
    if (!profile) {
      return Result.fail<void>(new TrainerProfileNotFoundException(userId).message);
    }

    const cert = profile.certifications.find(
      (c: TrainerCertification) => c.certificationId === certificationId,
    );
    if (cert && cert.certificateUrl) {
      await this.storageGateway.deleteFile(cert.certificateUrl);
    }

    const deleteRes = profile.deleteCertification(certificationId);
    if (deleteRes.isFailure) return Result.fail<void>(deleteRes.error);

    await this.trainerProfileRepo.save(profile);
    return Result.ok<void>();
  }
}
