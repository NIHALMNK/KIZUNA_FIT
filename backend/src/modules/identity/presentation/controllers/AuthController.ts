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
import { LinkGoogleAccountUseCase } from '../../application/use-cases/LinkGoogleAccountUseCase';
import { UnlinkGoogleAccountUseCase } from '../../application/use-cases/UnlinkGoogleAccountUseCase';
import { GetAuthProvidersUseCase } from '../../application/use-cases/GetAuthProvidersUseCase';
import { LogoutAllUseCase } from '../../application/use-cases/LogoutUseCases';
import { GetSessionsUseCase } from '../../application/use-cases/QueryUseCases';
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
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly linkGoogleAccountUseCase: LinkGoogleAccountUseCase,
    private readonly unlinkGoogleAccountUseCase: UnlinkGoogleAccountUseCase,
    private readonly getAuthProvidersUseCase: GetAuthProvidersUseCase,
    private readonly logoutAllUseCase: LogoutAllUseCase,
    private readonly getSessionsUseCase: GetSessionsUseCase
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

  private getAuthenticatedUserId(req: Request): string | null {
    return req.auth?.userId || null;
  }

  private handleUseCaseError(res: Response, error: string, defaultCode: ApiErrorCode, defaultStatus: number): void {
    // 404 NOT_FOUND
    if (error === 'User not found' || error === 'Account not found') {
      ApiResponse.error(res, error, ApiErrorCode.USER_NOT_FOUND, 404);
      return;
    }
    if (error === 'GOOGLE_ACCOUNT_NOT_FOUND' || error.includes('No account associated')) {
      ApiResponse.error(res, error, ApiErrorCode.GOOGLE_ACCOUNT_NOT_FOUND, 404);
      return;
    }

    // 401 UNAUTHORIZED / INVALID_CREDENTIALS
    if (error === 'Invalid email or password' || error === 'Invalid current password' || error === 'Invalid confirmation password') {
      ApiResponse.error(res, error, ApiErrorCode.INVALID_CREDENTIALS, 401);
      return;
    }
    if (error === 'Invalid Google Token' || error === 'Unauthorized' || error.includes('Session revoked') || error.includes('Google token verification failed')) {
      ApiResponse.error(res, error, ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }
    if (error === 'Invalid refresh token') {
      ApiResponse.error(res, error, ApiErrorCode.INVALID_TOKEN, 401);
      return;
    }

    // 403 FORBIDDEN / ACCOUNT_DISABLED / ACCOUNT_BANNED / ETC
    if (
      error.includes('Account has been suspended') ||
      error === 'Account is suspended.' ||
      error === 'Cannot link identity to deleted, suspended, or banned account' ||
      error === 'Cannot modify deleted account'
    ) {
      ApiResponse.error(res, error, ApiErrorCode.ACCOUNT_DISABLED, 403);
      return;
    }
    if (error.includes('Account has been banned') || error === 'Account is banned.') {
      ApiResponse.error(res, error, ApiErrorCode.ACCOUNT_BANNED, 403);
      return;
    }
    if (error === 'Account is deleted.') {
      ApiResponse.error(res, error, ApiErrorCode.ACCOUNT_DELETED, 403);
      return;
    }
    if (error === 'Please verify your email address to log in.') {
      ApiResponse.error(res, error, ApiErrorCode.EMAIL_NOT_VERIFIED, 403);
      return;
    }
    if (error === 'GOOGLE_ACCOUNT_NOT_LINKED') {
      ApiResponse.error(res, error, ApiErrorCode.GOOGLE_ACCOUNT_NOT_LINKED, 403);
      return;
    }

    // 409 CONFLICT
    if (error === 'Email already in use') {
      ApiResponse.error(res, error, ApiErrorCode.EMAIL_ALREADY_EXISTS, 409);
      return;
    }
    if (
      error === 'Google account email does not match your registered email' ||
      error === 'Provider already linked to this account'
    ) {
      ApiResponse.error(res, error, ApiErrorCode.CONFLICT, 409);
      return;
    }

    // 400 BAD_REQUEST / PASSWORD RESET ERRORS
    if (error === 'Invalid reset token') {
      ApiResponse.error(res, error, ApiErrorCode.INVALID_RESET_TOKEN, 400);
      return;
    }
    if (error === 'Reset token expired') {
      ApiResponse.error(res, error, ApiErrorCode.RESET_TOKEN_EXPIRED, 400);
      return;
    }
    if (error === 'Reset token is already used') {
      ApiResponse.error(res, error, ApiErrorCode.RESET_TOKEN_ALREADY_USED, 400);
      return;
    }
    if (error === 'New password cannot be the same as your current password') {
      ApiResponse.error(res, error, ApiErrorCode.PASSWORD_MATCHES_CURRENT, 400);
      return;
    }
    if (error === 'Invalid verification token') {
      ApiResponse.error(res, error, ApiErrorCode.VERIFICATION_FAILED, 400);
      return;
    }
    if (
      error === 'Invalid email from Google' ||
      error === 'New password is required' ||
      error === 'Passwords required' ||
      error === 'Account has no password (OAuth)' ||
      error === 'Invalid email' ||
      error === 'Cannot remove LOCAL authentication provider' ||
      error === 'Cannot remove the final authentication method'
    ) {
      ApiResponse.error(res, error, ApiErrorCode.BAD_REQUEST, 400);
      return;
    }

    // Default Fallback
    ApiResponse.error(res, error, defaultCode, defaultStatus);
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    const result = await this.registerUserUseCase.execute({
      fullName: req.body.fullName,
      email: req.body.email,
      plaintextPassword: req.body.password,
      role: req.body.role || 'CLIENT'
    });

    if (result.isFailure) {
      this.handleUseCaseError(res, result.error as string, ApiErrorCode.REGISTRATION_FAILED, 400);
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
      this.handleUseCaseError(res, result.error as string, ApiErrorCode.INVALID_CREDENTIALS, 401);
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
      this.handleUseCaseError(res, result.error as string, ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const { accessToken, refreshToken } = result.getValue();
    CookieHelper.setRefreshToken(res, refreshToken);

    ApiResponse.ok(res, {
      accessToken,
    });
  };

  public refresh = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      ApiResponse.error(res, 'Refresh token missing', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const result = await this.refreshTokenUseCase.execute({
      refreshToken,
      ipAddress: req.ip || '0.0.0.0'
    });

    if (result.isFailure) {
      CookieHelper.clearRefreshToken(res);
      this.handleUseCaseError(res, result.error as string, ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } = result.getValue();
    CookieHelper.setRefreshToken(res, newRefreshToken);

    ApiResponse.ok(res, {
      accessToken,
    });
  };

  public logout = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies?.refreshToken;
    if (token) {
      const userId = this.getAuthenticatedUserId(req) || 'unknown'; 
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
      this.handleUseCaseError(res, result.error as string, ApiErrorCode.BAD_REQUEST, 400);
      return;
    }
    ApiResponse.ok(res, result.getValue());
  };

  public verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const result = await this.verifyEmailUseCase.execute({ token: req.body.token });
    if (result.isFailure) {
      this.handleUseCaseError(res, result.error as string, ApiErrorCode.BAD_REQUEST, 400);
      return;
    }
    ApiResponse.ok(res, { success: true, message: 'Email verified successfully' });
  };

  public resendVerification = async (req: Request, res: Response): Promise<void> => {
    const result = await this.resendVerificationUseCase.execute({ email: req.body.email });
    if (result.isFailure) {
      this.handleUseCaseError(res, result.error as string, ApiErrorCode.BAD_REQUEST, 400);
      return;
    }
    ApiResponse.ok(res, { success: true, message: 'Verification email resent if account exists' });
  };

  public forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const result = await this.forgotPasswordUseCase.execute({ email: req.body.email });
    if (result.isFailure) {
      this.handleUseCaseError(res, result.error as string, ApiErrorCode.BAD_REQUEST, 400);
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
      this.handleUseCaseError(res, result.error as string, ApiErrorCode.BAD_REQUEST, 400);
      return;
    }
    ApiResponse.ok(res, { success: true, message: 'Password reset successfully' });
  };

  public linkGoogle = async (req: Request, res: Response): Promise<void> => {
    const userId = this.getAuthenticatedUserId(req);
    if (!userId) {
      ApiResponse.error(res, 'Unauthorized', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const result = await this.linkGoogleAccountUseCase.execute({
      userId,
      idToken: req.body.idToken
    });

    if (result.isFailure) {
      this.handleUseCaseError(res, result.error as string, ApiErrorCode.BAD_REQUEST, 400);
      return;
    }

    ApiResponse.ok(res, { success: true, message: 'Google account linked successfully' });
  };

  public unlinkGoogle = async (req: Request, res: Response): Promise<void> => {
    const userId = this.getAuthenticatedUserId(req);
    if (!userId) {
      ApiResponse.error(res, 'Unauthorized', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const result = await this.unlinkGoogleAccountUseCase.execute({ userId });

    if (result.isFailure) {
      this.handleUseCaseError(res, result.error as string, ApiErrorCode.BAD_REQUEST, 400);
      return;
    }

    ApiResponse.ok(res, { success: true, message: 'Google account unlinked successfully' });
  };

  public getAuthProviders = async (req: Request, res: Response): Promise<void> => {
    const userId = this.getAuthenticatedUserId(req);
    if (!userId) {
      ApiResponse.error(res, 'Unauthorized', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const result = await this.getAuthProvidersUseCase.execute({ userId });

    if (result.isFailure) {
      this.handleUseCaseError(res, result.error as string, ApiErrorCode.BAD_REQUEST, 400);
      return;
    }

    ApiResponse.ok(res, result.getValue());
  };

  public logoutAll = async (req: Request, res: Response): Promise<void> => {
    const userId = this.getAuthenticatedUserId(req);
    if (!userId) {
      ApiResponse.error(res, 'Unauthorized', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const result = await this.logoutAllUseCase.execute({ userId });

    if (result.isFailure) {
      this.handleUseCaseError(res, result.error as string, ApiErrorCode.BAD_REQUEST, 400);
      return;
    }

    CookieHelper.clearRefreshToken(res);
    ApiResponse.noContent(res);
  };

  public getSessions = async (req: Request, res: Response): Promise<void> => {
    const userId = this.getAuthenticatedUserId(req);
    if (!userId) {
      ApiResponse.error(res, 'Unauthorized', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }

    const result = await this.getSessionsUseCase.execute({ userId });

    if (result.isFailure) {
      this.handleUseCaseError(res, result.error as string, ApiErrorCode.BAD_REQUEST, 400);
      return;
    }

    ApiResponse.ok(res, result.getValue());
  };
}
