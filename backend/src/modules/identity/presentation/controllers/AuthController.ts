import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../application/use-cases/RegisterUserUseCase';
import { LoginUseCase } from '../../application/use-cases/LoginUseCase';
import { RefreshTokenUseCase } from '../../application/use-cases/RefreshTokenUseCase';
import { ApiResponse } from '../../../../shared/infrastructure/http/responses/ApiResponse';
import { CookieHelper } from '../../../../shared/infrastructure/http/utils/CookieHelper';

export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  public register = async (req: Request, res: Response): Promise<void> => {
    const result = await this.registerUserUseCase.execute({
      email: req.body.email,
      plaintextPassword: req.body.password,
    });

    if (result.isFailure) {
      ApiResponse.error(res, result.error as string, 'REGISTRATION_FAILED', 400);
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
      ApiResponse.error(res, result.error as string, 'INVALID_CREDENTIALS', 401);
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
      ApiResponse.error(res, 'Refresh token missing', 'UNAUTHORIZED', 401);
      return;
    }

    const [family, id] = token.split(':');
    
    const result = await this.refreshTokenUseCase.execute({
      tokenFamily: family || 'default',
      refreshTokenId: id || token,
      deviceId: req.headers['user-agent'] || 'unknown',
      ipAddress: req.ip || '0.0.0.0',
    });

    if (result.isFailure) {
      CookieHelper.clearRefreshToken(res);
      ApiResponse.error(res, result.error as string, 'UNAUTHORIZED', 401);
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
