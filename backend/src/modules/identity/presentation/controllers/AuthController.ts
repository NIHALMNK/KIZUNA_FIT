import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { LoginUseCase } from '../../application/use-cases/LoginUseCase';
import { GoogleLoginUseCase } from '../../application/use-cases/GoogleLoginUseCase';
import { RefreshTokenUseCase } from '../../application/use-cases/RefreshTokenUseCase';
import { ApiResponse } from '../../../../shared/infrastructure/http/responses/ApiResponse';
import { CookieHelper } from '../../../../shared/infrastructure/http/utils/CookieHelper';
import { ApiErrorCode } from '../../../../shared/infrastructure/http/responses/ApiErrorCode';
import jwt from 'jsonwebtoken';


export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly googleLoginUseCase: GoogleLoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  public register = async (req: Request, res: Response): Promise<void> => {
    const result = await this.registerUserUseCase.execute({
      email: req.body.email,
      plaintextPassword: req.body.password,
    });

    if (result.isFailure) {
      ApiResponse.error(res, result.error as string, ApiErrorCode.REGISTRATION_FAILED, 400);
      return;
    }

    ApiResponse.created(res, { success: true });
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.loginUseCase.execute({
      email: req.body.email,
      plaintextPassword: req.body.password,
      deviceId: req.headers['user-agent'] || 'unknown',
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

    const ipAddress = req.ip || '0.0.0.0';
    const userAgent = req.headers['user-agent'] || 'unknown';

    const result = await this.googleLoginUseCase.execute({
      idToken,
      ipAddress,
      userAgent
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

    const decoded = jwt.decode(token) as jwt.JwtPayload | null;
    if (!decoded || !decoded.jti) {
      ApiResponse.error(res, 'Invalid refresh token format', ApiErrorCode.UNAUTHORIZED, 401);
      return;
    }
    
    const id = decoded.jti;
    
    const result = await this.refreshTokenUseCase.execute({
      tokenFamily: 'default',
      refreshTokenId: id,
      deviceId: req.headers['user-agent'] || 'unknown',
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
    CookieHelper.clearRefreshToken(res);
    ApiResponse.noContent(res);
  };
}
