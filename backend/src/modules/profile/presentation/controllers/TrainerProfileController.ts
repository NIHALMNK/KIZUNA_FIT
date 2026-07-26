import { Request, Response } from 'express';
import { ApiResponse } from '../../../../shared/infrastructure/http/responses/ApiResponse';
import { ApiErrorCode } from '../../../../shared/infrastructure/http/responses/ApiErrorCode';
import {
  CreateTrainerProfileUseCase,
  GetTrainerProfileUseCase,
  UpdateTrainerProfileUseCase,
} from '../../application/use-cases/trainer/TrainerProfileUseCases';
import {
  UploadTrainerAvatarUseCase,
  DeleteTrainerAvatarUseCase,
} from '../../application/use-cases/avatar/AvatarUseCases';
import {
  GetTrainerAvailabilityUseCase,
  UpdateTrainerAvailabilityUseCase,
} from '../../application/use-cases/availability/AvailabilityUseCases';
import {
  AddTrainerCertificationUseCase,
  UpdateTrainerCertificationUseCase,
  DeleteTrainerCertificationUseCase,
} from '../../application/use-cases/certification/CertificationUseCases';
import {
  AddShowcaseItemUseCase,
  GetShowcaseItemsUseCase,
  UpdateShowcaseItemUseCase,
  DeleteShowcaseItemUseCase,
} from '../../application/use-cases/showcase/ShowcaseUseCases';
import {
  SearchTrainersUseCase,
  GetPublicTrainerProfileUseCase,
} from '../../application/use-cases/public/PublicProfileUseCases';
import { TrainerSpecialization } from '../../domain/enums/TrainerSpecialization';
import { TrainerAvailabilityStatus } from '../../domain/enums/TrainerAvailabilityStatus';

export class TrainerProfileController {
  constructor(
    private readonly createTrainerProfileUseCase: CreateTrainerProfileUseCase,
    private readonly getTrainerProfileUseCase: GetTrainerProfileUseCase,
    private readonly updateTrainerProfileUseCase: UpdateTrainerProfileUseCase,
    private readonly uploadTrainerAvatarUseCase: UploadTrainerAvatarUseCase,
    private readonly deleteTrainerAvatarUseCase: DeleteTrainerAvatarUseCase,
    private readonly getTrainerAvailabilityUseCase: GetTrainerAvailabilityUseCase,
    private readonly updateTrainerAvailabilityUseCase: UpdateTrainerAvailabilityUseCase,
    private readonly addTrainerCertificationUseCase: AddTrainerCertificationUseCase,
    private readonly updateTrainerCertificationUseCase: UpdateTrainerCertificationUseCase,
    private readonly deleteTrainerCertificationUseCase: DeleteTrainerCertificationUseCase,
    private readonly addShowcaseItemUseCase: AddShowcaseItemUseCase,
    private readonly getShowcaseItemsUseCase: GetShowcaseItemsUseCase,
    private readonly updateShowcaseItemUseCase: UpdateShowcaseItemUseCase,
    private readonly deleteShowcaseItemUseCase: DeleteShowcaseItemUseCase,
    private readonly searchTrainersUseCase: SearchTrainersUseCase,
    private readonly getPublicTrainerProfileUseCase: GetPublicTrainerProfileUseCase,
  ) {}

  public async createProfile(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const result = await this.createTrainerProfileUseCase.execute({
      userId,
      ...req.body,
    });

    if (result.isFailure) {
      if (result.error.includes('already exists')) {
        ApiResponse.error(res, result.error, ApiErrorCode.CONFLICT, 409);
        return;
      }
      ApiResponse.error(res, result.error, ApiErrorCode.VALIDATION_ERROR, 400);
      return;
    }

    ApiResponse.created(res, result.getValue());
  }

  public async getProfile(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const result = await this.getTrainerProfileUseCase.execute(userId);
    if (result.isFailure) {
      ApiResponse.error(res, result.error, ApiErrorCode.NOT_FOUND, 404);
      return;
    }

    ApiResponse.ok(res, result.getValue(), 200);
  }

  public async updateProfile(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const result = await this.updateTrainerProfileUseCase.execute({
      userId,
      ...req.body,
    });

    if (result.isFailure) {
      ApiResponse.error(res, result.error, ApiErrorCode.VALIDATION_ERROR, 400);
      return;
    }

    ApiResponse.ok(res, result.getValue(), 200);
  }

  public async searchTrainers(req: Request, res: Response): Promise<void> {
    const query = req.query as Record<string, unknown>;
    const result = await this.searchTrainersUseCase.execute({
      search: typeof query.search === 'string' ? query.search : undefined,
      specialization: query.specialization as TrainerSpecialization | undefined,
      experienceLevel:
        typeof query.experienceLevel === 'string' ? query.experienceLevel : undefined,
      minRating: query.minRating ? Number(query.minRating) : undefined,
      availability: query.availability as TrainerAvailabilityStatus | undefined,
      verifiedOnly: query.verifiedOnly === 'true' || query.verifiedOnly === true,
      sortBy: query.sortBy as 'rating' | 'experience' | 'newest' | undefined,
      sortOrder: query.sortOrder as 'asc' | 'desc' | undefined,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
    });

    if (result.isFailure) {
      ApiResponse.error(res, result.error, ApiErrorCode.BAD_REQUEST, 400);
      return;
    }

    ApiResponse.ok(res, result.getValue(), 200);
  }

  public async getPublicProfile(req: Request, res: Response): Promise<void> {
    const { trainerId } = req.params;
    const result = await this.getPublicTrainerProfileUseCase.execute(trainerId);

    if (result.isFailure) {
      ApiResponse.error(res, result.error, ApiErrorCode.NOT_FOUND, 404);
      return;
    }

    ApiResponse.ok(res, result.getValue(), 200);
  }

  public async uploadAvatar(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }
    const file = req.file;
    if (!file) {
      ApiResponse.error(res, 'No image file uploaded', ApiErrorCode.VALIDATION_ERROR, 400);
      return;
    }

    const result = await this.uploadTrainerAvatarUseCase.execute(
      userId,
      file.buffer,
      file.mimetype,
    );
    if (result.isFailure) {
      ApiResponse.error(res, result.error, ApiErrorCode.BAD_REQUEST, 400);
      return;
    }

    ApiResponse.ok(res, result.getValue(), 200);
  }

  public async deleteAvatar(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const result = await this.deleteTrainerAvatarUseCase.execute(userId);
    if (result.isFailure) {
      ApiResponse.error(res, result.error, ApiErrorCode.BAD_REQUEST, 400);
      return;
    }

    ApiResponse.ok(res, result.getValue(), 200);
  }

  public async getAvailability(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const result = await this.getTrainerAvailabilityUseCase.execute(userId);
    if (result.isFailure) {
      ApiResponse.error(res, result.error, ApiErrorCode.NOT_FOUND, 404);
      return;
    }

    ApiResponse.ok(res, result.getValue(), 200);
  }

  public async updateAvailability(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const result = await this.updateTrainerAvailabilityUseCase.execute({
      userId,
      ...req.body,
    });

    if (result.isFailure) {
      if (result.error.includes('Overlapping')) {
        ApiResponse.error(res, result.error, ApiErrorCode.CONFLICT, 409);
        return;
      }
      ApiResponse.error(res, result.error, ApiErrorCode.VALIDATION_ERROR, 400);
      return;
    }

    ApiResponse.ok(res, result.getValue(), 200);
  }

  public async addCertification(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const file = req.file;
    const result = await this.addTrainerCertificationUseCase.execute({
      userId,
      title: req.body.title,
      organization: req.body.organization,
      issuedAt: req.body.issuedAt,
      expiresAt: req.body.expiresAt,
      certificateUrl: req.body.certificateUrl,
      fileBuffer: file ? file.buffer : undefined,
      fileMimeType: file ? file.mimetype : undefined,
    });

    if (result.isFailure) {
      ApiResponse.error(res, result.error, ApiErrorCode.VALIDATION_ERROR, 400);
      return;
    }

    ApiResponse.created(res, result.getValue());
  }

  public async updateCertification(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }
    const { certificationId } = req.params;

    const result = await this.updateTrainerCertificationUseCase.execute({
      userId,
      certificationId,
      ...req.body,
    });

    if (result.isFailure) {
      if (result.error.includes('APPROVED')) {
        ApiResponse.error(res, result.error, ApiErrorCode.CONFLICT, 409);
        return;
      }
      ApiResponse.error(res, result.error, ApiErrorCode.VALIDATION_ERROR, 400);
      return;
    }

    ApiResponse.ok(res, { message: 'Certification updated successfully' }, 200);
  }

  public async deleteCertification(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }
    const { certificationId } = req.params;

    const result = await this.deleteTrainerCertificationUseCase.execute(userId, certificationId);
    if (result.isFailure) {
      if (result.error.includes('APPROVED')) {
        ApiResponse.error(res, result.error, ApiErrorCode.CONFLICT, 409);
        return;
      }
      ApiResponse.error(res, result.error, ApiErrorCode.NOT_FOUND, 404);
      return;
    }

    ApiResponse.ok(res, { message: 'Certification deleted successfully' }, 200);
  }

  public async addShowcaseItem(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const file = req.file;
    const result = await this.addShowcaseItemUseCase.execute({
      userId,
      type: req.body.type,
      title: req.body.title,
      description: req.body.description,
      issuedBy: req.body.issuedBy,
      achievedAt: req.body.achievedAt,
      mediaUrl: req.body.mediaUrl,
      fileBuffer: file ? file.buffer : undefined,
      fileMimeType: file ? file.mimetype : undefined,
    });

    if (result.isFailure) {
      ApiResponse.error(res, result.error, ApiErrorCode.VALIDATION_ERROR, 400);
      return;
    }

    ApiResponse.created(res, result.getValue());
  }

  public async getShowcaseItems(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const result = await this.getShowcaseItemsUseCase.execute(userId);
    if (result.isFailure) {
      ApiResponse.error(res, result.error, ApiErrorCode.NOT_FOUND, 404);
      return;
    }

    ApiResponse.ok(res, result.getValue(), 200);
  }

  public async updateShowcaseItem(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }
    const { itemId } = req.params;

    const result = await this.updateShowcaseItemUseCase.execute({
      userId,
      showcaseId: itemId,
      ...req.body,
    });

    if (result.isFailure) {
      ApiResponse.error(res, result.error, ApiErrorCode.VALIDATION_ERROR, 400);
      return;
    }

    ApiResponse.ok(res, { message: 'Showcase item updated successfully' }, 200);
  }

  public async deleteShowcaseItem(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }
    const { itemId } = req.params;

    const result = await this.deleteShowcaseItemUseCase.execute(userId, itemId);
    if (result.isFailure) {
      ApiResponse.error(res, result.error, ApiErrorCode.NOT_FOUND, 404);
      return;
    }

    ApiResponse.ok(res, { message: 'Showcase item deleted successfully' }, 200);
  }
}
