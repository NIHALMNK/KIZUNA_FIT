import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IRefreshTokenSessionRepository } from '../../domain/repositories/IRefreshTokenSessionRepository';
import { IPasswordHasher } from '../ports/IPasswordHasher';
import { ITokenProvider } from '../ports/ITokenProvider';
import { IUnitOfWork } from '../ports/IUnitOfWork';
import { IEventBus } from '../ports/IEventBus';
import { IClock } from '../ports/IClock';
import { LoginCommand } from '../commands/LoginCommand';
import { Result } from '../../../../shared/result/Result';
import { AuthTokensResult } from '../models/AuthTokensResult';
import { AuthenticationDomainService } from '../../domain/services/AuthenticationDomainService';
import { RefreshTokenSession } from '../../domain/entities/RefreshTokenSession';
import { UserId } from '../../domain/value-objects/UserId';
import { DeviceInfo } from '../../domain/value-objects/DeviceInfo';

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: IRefreshTokenSessionRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenProvider: ITokenProvider,
    private readonly unitOfWork: IUnitOfWork,
    private readonly eventBus: IEventBus,
    private readonly clock: IClock
  ) {}

  public async execute(command: LoginCommand): Promise<Result<AuthTokensResult>> {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user) {
      return Result.fail<AuthTokensResult>('Invalid email or password');
    }

    const preAuthResult = AuthenticationDomainService.validatePreAuthenticationChecks(user);
    if (preAuthResult.isFailure) {
      return Result.fail<AuthTokensResult>(preAuthResult.error);
    }

    let isValid = false;
    if (command.plaintextPassword && user.passwordHash) {
      isValid = await this.passwordHasher.compare(command.plaintextPassword, user.passwordHash.value);
    }

    if (!isValid) {
      return Result.fail<AuthTokensResult>('Invalid email or password');
    }

    const userId = UserId.create(user.id).getValue();
    const deviceInfoResult = DeviceInfo.create(command.deviceInfo);
    if (deviceInfoResult.isFailure) return Result.fail<AuthTokensResult>(deviceInfoResult.error);

    const { token: rawRefreshToken, hash: refreshTokenHash } = await this.tokenProvider.generateRefreshToken();
    const now = this.clock.now();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const sessionResult = RefreshTokenSession.create(
      userId,
      refreshTokenHash,
      deviceInfoResult.getValue(),
      expiresAt,
      now,
      command.ipAddress
    );

    if (sessionResult.isFailure) return Result.fail<AuthTokensResult>(sessionResult.error);

    const session = sessionResult.getValue();
    user.recordLogin(now);

    await this.unitOfWork.start();
    try {
      await this.userRepository.save(user, this.unitOfWork.session);
      await this.sessionRepository.save(session, this.unitOfWork.session);

      const events = [...user.domainEvents, ...session.domainEvents];
      user.clearEvents();
      session.clearEvents();

      await this.unitOfWork.commit();
      await this.eventBus.publish(events);

      const accessToken = await this.tokenProvider.generateAccessToken(user);

      return Result.ok<AuthTokensResult>({
        accessToken,
        refreshToken: rawRefreshToken,
        expiresAt: session.expiresAt
      });
    } catch (err) {
      await this.unitOfWork.rollback();
      throw err;
    }
  }
}
