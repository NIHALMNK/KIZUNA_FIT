import { Request, Response } from 'express';
import { ChangePasswordUseCase } from '../../application/use-cases/ChangePasswordUseCase';
import { DeleteAccountUseCase } from '../../application/use-cases/DeleteAccountUseCase';
import { ApiResponse } from '../../../../shared/infrastructure/http/responses/ApiResponse';
import { CookieHelper } from '../../../../shared/infrastructure/http/utils/CookieHelper';
import { ApiErrorCode } from '../../../../shared/infrastructure/http/responses/ApiErrorCode';

export class UserController {
  constructor(
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly deleteAccountUseCase: DeleteAccountUseCase
  ) {}



  private handleUseCaseError(res: Response, error: string, defaultCode: ApiErrorCode, defaultStatus: number): void {
    if (error === 'Invalid current password') {
      ApiResponse.error(res, error, ApiErrorCode.INVALID_CREDENTIALS, 401);
      return;
    }
    if (error === 'New password cannot be the same as your current password') {
      ApiResponse.error(res, error, ApiErrorCode.PASSWORD_MATCHES_CURRENT, 400);
      return;
    }
    if (error === 'User not found' || error === 'Account not found') {
      ApiResponse.error(res, error, ApiErrorCode.USER_NOT_FOUND, 404);
      return;
    }
    ApiResponse.error(res, error, defaultCode, defaultStatus);
  }

  public changePassword = async (req: Request, res: Response): Promise<void> => {
    if (!req.auth) {
      ApiResponse.error(res, 'Unauthorized', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const result = await this.changePasswordUseCase.execute({
      userId: req.auth.userId,
      currentPlaintextPassword: req.body.oldPassword,
      newPlaintextPassword: req.body.newPassword,
    });

    if (result.isFailure) {
      this.handleUseCaseError(res, result.error as string, ApiErrorCode.CHANGE_PASSWORD_FAILED, 400);
      return;
    }

    ApiResponse.noContent(res);
  };

  public deleteAccount = async (req: Request, res: Response): Promise<void> => {
    if (!req.auth) {
      ApiResponse.error(res, 'Unauthorized', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const result = await this.deleteAccountUseCase.execute({
      userId: req.auth.userId,
      confirmationPassword: req.body.password,
    });

    if (result.isFailure) {
      ApiResponse.error(res, result.error as string, ApiErrorCode.DELETE_ACCOUNT_FAILED, 400);
      return;
    }

    CookieHelper.clearRefreshToken(res);
    ApiResponse.noContent(res);
  };
}
