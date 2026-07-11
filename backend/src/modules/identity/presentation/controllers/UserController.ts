import { Request, Response } from 'express';
import { VerifyEmailUseCase } from '../../application/use-cases/VerifyEmailUseCase';
import { ForgotPasswordUseCase } from '../../application/use-cases/ForgotPasswordUseCase';
import { ResetPasswordUseCase } from '../../application/use-cases/ResetPasswordUseCase';
import { ChangePasswordUseCase } from '../../application/use-cases/ChangePasswordUseCase';
import { DeleteAccountUseCase } from '../../application/use-cases/DeleteAccountUseCase';
import { ApiResponse } from '../../../../shared/infrastructure/http/responses/ApiResponse';
import { CookieHelper } from '../../../../shared/infrastructure/http/utils/CookieHelper';
import { ApiErrorCode } from '../../../../shared/infrastructure/http/responses/ApiErrorCode';


export class UserController {
  constructor(
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly deleteAccountUseCase: DeleteAccountUseCase
  ) {}

  public verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const result = await this.verifyEmailUseCase.execute({
      email: req.body.email,
      token: req.body.token,
    });

    if (result.isFailure) {
      ApiResponse.error(res, result.error as string, ApiErrorCode.VERIFICATION_FAILED, 400);
      return;
    }

    ApiResponse.noContent(res);
  };

  public forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const result = await this.forgotPasswordUseCase.execute({
      email: req.body.email,
    });

    if (result.isFailure) {
      ApiResponse.error(res, result.error as string, ApiErrorCode.FORGOT_PASSWORD_FAILED, 400);
      return;
    }

    ApiResponse.noContent(res);
  };

  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    const result = await this.resetPasswordUseCase.execute({
      email: req.body.email,
      token: req.body.token,
      newPlaintextPassword: req.body.newPassword,
    });

    if (result.isFailure) {
      ApiResponse.error(res, result.error as string, ApiErrorCode.RESET_PASSWORD_FAILED, 400);
      return;
    }

    ApiResponse.noContent(res);
  };

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
      ApiResponse.error(res, result.error as string, ApiErrorCode.CHANGE_PASSWORD_FAILED, 400);
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
