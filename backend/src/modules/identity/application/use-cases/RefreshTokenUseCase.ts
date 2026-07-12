import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IRefreshTokenSessionRepository } from '../../domain/repositories/IRefreshTokenSessionRepository';
import { ITokenProvider } from '../ports/ITokenProvider';
import { IUnitOfWork } from '../ports/IUnitOfWork';
import { IEventBus } from '../ports/IEventBus';
import { IClock } from '../ports/IClock';
import { UserStatus } from '../../domain/entities/UserStatus';
import { RefreshTokenCommand } from '../commands/RefreshTokenCommand';
import { Result } from '../../../../shared/result/Result';
import { AuthTokensResult } from '../models/AuthTokensResult';
import crypto from 'crypto';
import { UserId } from '../../domain/value-objects/UserId';

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: IRefreshTokenSessionRepository,
    private readonly tokenProvider: ITokenProvider,
    private readonly unitOfWork: IUnitOfWork,
    private readonly eventBus: IEventBus,
    private readonly clock: IClock
  ) {}

  public async execute(command: RefreshTokenCommand): Promise<Result<AuthTokensResult>> {
    const providedHash = crypto.createHash('sha256').update(command.refreshToken).digest('hex');
    const session = await this.sessionRepository.findByTokenHash(providedHash);

    if (!session) {
      return Result.fail<AuthTokensResult>('Invalid refresh token');
    }

    const user = await this.userRepository.findById(session.userId.value);
    if (!user) {
      return Result.fail<AuthTokensResult>('User not found');
    }

    if (user.status === UserStatus.Suspended || user.status === UserStatus.Banned) {
      return Result.fail<AuthTokensResult>('Account is suspended or banned');
    }

    const { token: newRawRefreshToken, hash: newRefreshTokenHash } = await this.tokenProvider.generateRefreshToken();
    
    const now = this.clock.now();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const rotationResult = session.rotate(
      newRefreshTokenHash, 
      now,
      expiresAt,
      command.ipAddress
    );
    
    if (rotationResult.isFailure) {
      // Reuse detected, revoke all sessions for user
      await this.unitOfWork.start();
      try {
        await this.sessionRepository.revokeAllForUser(UserId.create(session.userId.value).getValue(), this.unitOfWork.session);
        const events = session.domainEvents;
        session.clearEvents();
        await this.unitOfWork.commit();
        await this.eventBus.publish(events);
      } catch (err) {
        await this.unitOfWork.rollback();
      }
      return Result.fail<AuthTokensResult>('Invalid refresh token. Session revoked due to suspected compromise.');
    }

    await this.unitOfWork.start();
    try {
      await this.sessionRepository.save(session, this.unitOfWork.session);
      
      const events = session.domainEvents;
      session.clearEvents();

      await this.unitOfWork.commit();
      await this.eventBus.publish(events);

      const accessToken = await this.tokenProvider.generateAccessToken(user);
      
      return Result.ok<AuthTokensResult>({
        accessToken, 
        refreshToken: newRawRefreshToken,
        expiresAt: session.expiresAt
      });
    } catch (err) {
      await this.unitOfWork.rollback();
      throw err;
    }
  }
}
