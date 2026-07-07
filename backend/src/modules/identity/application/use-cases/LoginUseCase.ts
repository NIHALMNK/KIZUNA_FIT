import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IRefreshTokenSessionRepository } from '../../domain/repositories/IRefreshTokenSessionRepository';
import { IPasswordHasher } from '../ports/IPasswordHasher';
import { ITokenProvider } from '../ports/ITokenProvider';
import { IUnitOfWork } from '../ports/IUnitOfWork';
import { IEventBus } from '../ports/IEventBus';
import { LoginCommand } from '../commands/LoginCommand';
import { Result } from '../../../../shared/result/Result';
import { AuthTokensResult } from '../models/AuthTokensResult';
import { EmailAddress } from '../../domain/value-objects/EmailAddress';
import { AuthenticationDomainService } from '../../domain/services/AuthenticationDomainService';
import { RefreshTokenSession } from '../../domain/entities/RefreshTokenSession';
import { UserId } from '../../domain/value-objects/UserId';

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: IRefreshTokenSessionRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly tokenProvider: ITokenProvider,
    private readonly unitOfWork: IUnitOfWork,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: LoginCommand): Promise<Result<AuthTokensResult>> {
    const emailResult = EmailAddress.create(command.email);
    if (emailResult.isFailure) return Result.fail<AuthTokensResult>(emailResult.error);

    const email = emailResult.getValue();
    const user = await this.userRepository.findByEmail(email);

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

    AuthenticationDomainService.processAuthenticationAttempt(user, isValid);

    if (!isValid) {
      await this.unitOfWork.start();
      try {
        await this.userRepository.save(user, this.unitOfWork.session);
        const events = user.getDomainEvents();
        user.clearEvents();
        await this.unitOfWork.commit();
        await this.eventBus.publish(events);
      } catch (err) {
        await this.unitOfWork.rollback();
        throw err;
      }
      return Result.fail<AuthTokensResult>('Invalid email or password');
    }

    const userId = UserId.create(user.id).getValue();
    const sessionResult = RefreshTokenSession.create(
      userId,
      command.deviceId,
      command.ipAddress
    );

    if (sessionResult.isFailure) return Result.fail<AuthTokensResult>(sessionResult.error);

    const session = sessionResult.getValue();

    await this.unitOfWork.start();
    try {
      await this.userRepository.save(user, this.unitOfWork.session);
      await this.sessionRepository.save(session, this.unitOfWork.session);

      const events = [...user.getDomainEvents(), ...session.getDomainEvents()];
      user.clearEvents();
      session.clearEvents();

      await this.unitOfWork.commit();
      await this.eventBus.publish(events);

      const accessToken = await this.tokenProvider.generateAccessToken(user);
      const refreshToken = await this.tokenProvider.generateRefreshToken(session);

      return Result.ok<AuthTokensResult>({
        accessToken,
        refreshToken,
        expiresAt: session.props.expiresAt
      });
    } catch (err) {
      await this.unitOfWork.rollback();
      throw err;
    }
  }
}
