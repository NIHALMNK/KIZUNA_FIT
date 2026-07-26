import { Request, Response } from 'express';
import { ApiResponse } from '../../../../shared/infrastructure/http/responses/ApiResponse';
import { ApiErrorCode } from '../../../../shared/infrastructure/http/responses/ApiErrorCode';
import {
  CreateClientProfileUseCase,
  GetClientProfileUseCase,
  UpdateClientProfileUseCase,
} from '../../application/use-cases/client/ClientProfileUseCases';
import {
  UploadClientAvatarUseCase,
  DeleteClientAvatarUseCase,
} from '../../application/use-cases/avatar/AvatarUseCases';

export class ClientProfileController {
  constructor(
    private readonly createClientProfileUseCase: CreateClientProfileUseCase,
    private readonly getClientProfileUseCase: GetClientProfileUseCase,
    private readonly updateClientProfileUseCase: UpdateClientProfileUseCase,
    private readonly uploadClientAvatarUseCase: UploadClientAvatarUseCase,
    private readonly deleteClientAvatarUseCase: DeleteClientAvatarUseCase,
  ) {}

  public async createProfile(req: Request, res: Response): Promise<void> {
    const userId = req.auth?.userId;
    if (!userId) {
      ApiResponse.error(res, 'Authentication required', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const result = await this.createClientProfileUseCase.execute({
      userId,
      fullName: req.body.fullName,
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

    const result = await this.getClientProfileUseCase.execute(userId);
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

    const result = await this.updateClientProfileUseCase.execute({
      userId,
      ...req.body,
    });

    if (result.isFailure) {
      if (result.error.includes('not found')) {
        ApiResponse.error(res, result.error, ApiErrorCode.NOT_FOUND, 404);
        return;
      }
      ApiResponse.error(res, result.error, ApiErrorCode.VALIDATION_ERROR, 400);
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

    const result = await this.uploadClientAvatarUseCase.execute(userId, file.buffer, file.mimetype);

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

    const result = await this.deleteClientAvatarUseCase.execute(userId);
    if (result.isFailure) {
      ApiResponse.error(res, result.error, ApiErrorCode.BAD_REQUEST, 400);
      return;
    }

    ApiResponse.ok(res, result.getValue(), 200);
  }
}
