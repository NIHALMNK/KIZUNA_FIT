import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { LoginUseCase } from '../../application/use-cases/LoginUseCase';
import { GoogleLoginUseCase } from '../../application/use-cases/GoogleLoginUseCase';
import { RefreshTokenUseCase } from '../../application/use-cases/RefreshTokenUseCase';
import { LogoutUseCase } from '../../application/use-cases/LogoutUseCases';
import { CheckEmailUseCase } from '../../application/use-cases/CheckEmailUseCase';
import { VerifyEmailUseCase } from '../../application/use-cases/VerifyEmailUseCase';
import { ResendVerificationUseCase } from '../../application/use-cases/ResendVerificationUseCase';
import { ForgotPasswordUseCase } from '../../application/use-cases/ForgotPasswordUseCase';
import { ResetPasswordUseCase } from '../../application/use-cases/ResetPasswordUseCase';
import { ApiResponse } from '../../../../shared/infrastructure/http/responses/ApiResponse';
import { CookieHelper } from '../../../../shared/infrastructure/http/utils/CookieHelper';
import { ApiErrorCode } from '../../../../shared/infrastructure/http/responses/ApiErrorCode';

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly googleLoginUseCase: GoogleLoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly checkEmailUseCase: CheckEmailUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly resendVerificationUseCase: ResendVerificationUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase
  ) {}

  private getDeviceInfo(req: Request) {
    const ua = req.headers['user-agent'] || 'unknown';
    // Very basic parsing for illustration. In prod use ua-parser-js
    return {
      userAgent: ua,
      browser: ua.includes('Chrome') ? 'Chrome' : 'Unknown',
      operatingSystem: ua.includes('Windows') ? 'Windows' : 'Unknown',
      platform: 'Web'
    };
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    const result = await this.registerUserUseCase.execute({
      fullName: req.body.fullName,
      email: req.body.email,
      plaintextPassword: req.body.password,
      role: req.body.role || 'CLIENT'
    });

    if (result.isFailure) {
      ApiResponse.error(res, result.error as string, ApiErrorCode.REGISTRATION_FAILED, 400);
      return;
    }

    ApiResponse.created(res, { success: true, message: 'Registration successful. Please verify email.' });
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.loginUseCase.execute({
      email: req.body.email,
      plaintextPassword: req.body.password,
      deviceInfo: this.getDeviceInfo(req),
      ipAddress: req.ip || '0.0.0.0',
    });

    if (result.isFailure) {
      ApiResponse.error(res, result.error as string, ApiErrorCode.INVALID_CREDENTIALS, 401);
      return;
    }

    const { accessToken, refreshToken } = result.getValue();
    CookieHelper.setRefreshToken(res, refreshToken);

    ApiResponse.ok(res, {
      accessToken,
    });
  };

  public googleLogin = async (req: Request, res: Response): Promise<void> => {
    const { idToken } = req.body;

    if (!idToken) {
      ApiResponse.error(res, 'idToken is required', ApiErrorCode.BAD_REQUEST, 400);
      return;
    }

    const result = await this.googleLoginUseCase.execute({
      idToken,
      ipAddress: req.ip || '0.0.0.0',
      deviceInfo: this.getDeviceInfo(req)
    });

    if (result.isFailure) {
      ApiResponse.error(res, result.error as string, ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const { accessToken, refreshToken } = result.getValue();
    CookieHelper.setRefreshToken(res, refreshToken);

    ApiResponse.ok(res, {
      accessToken,
    });
  };

  public refresh = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies?.refreshToken;
    if (!token) {
      ApiResponse.error(res, 'Refresh token missing', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const result = await this.refreshTokenUseCase.execute({
      refreshToken: token,
      ipAddress: req.ip || '0.0.0.0',
    });

    if (result.isFailure) {
      CookieHelper.clearRefreshToken(res);
      ApiResponse.error(res, result.error as string, ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const { accessToken, refreshToken } = result.getValue();
    CookieHelper.setRefreshToken(res, refreshToken);

    ApiResponse.ok(res, {
      accessToken,
    });
  };

  public logout = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies?.refreshToken;
    if (token) {
      // Decode user from access token would be better, but assuming middleware puts it on req.user
      const userId = (req as unknown as { user?: { id: string } }).user?.id || 'unknown'; 
      await this.logoutUseCase.execute({
        userId,
        refreshToken: token
      });
    }

    CookieHelper.clearRefreshToken(res);
    ApiResponse.noContent(res);
  };

  public checkEmail = async (req: Request, res: Response): Promise<void> => {
    const result = await this.checkEmailUseCase.execute(req.body.email);
    if (result.isFailure) {
      ApiResponse.error(res, result.error as string, ApiErrorCode.BAD_REQUEST, 400);
      return;
    }
    ApiResponse.ok(res, result.getValue());
  };

  public verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const result = await this.verifyEmailUseCase.execute({ token: req.body.token });
    if (result.isFailure) {
      ApiResponse.error(res, result.error as string, ApiErrorCode.BAD_REQUEST, 400);
      return;
    }
    ApiResponse.ok(res, { success: true, message: 'Email verified successfully' });
  };

  public resendVerification = async (req: Request, res: Response): Promise<void> => {
    const result = await this.resendVerificationUseCase.execute({ email: req.body.email });
    if (result.isFailure) {
      ApiResponse.error(res, result.error as string, ApiErrorCode.BAD_REQUEST, 400);
      return;
    }
    ApiResponse.ok(res, { success: true, message: 'Verification email resent if account exists' });
  };

  public forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const result = await this.forgotPasswordUseCase.execute({ email: req.body.email });
    if (result.isFailure) {
      ApiResponse.error(res, result.error as string, ApiErrorCode.BAD_REQUEST, 400);
      return;
    }
    ApiResponse.ok(res, { success: true, message: 'Password reset link sent if account exists' });
  };

  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    const result = await this.resetPasswordUseCase.execute({
      token: req.body.token,
      newPlaintextPassword: req.body.newPassword
    });
    if (result.isFailure) {
      ApiResponse.error(res, result.error as string, ApiErrorCode.BAD_REQUEST, 400);
      return;
    }
    ApiResponse.ok(res, { success: true, message: 'Password reset successfully' });
  };
}
