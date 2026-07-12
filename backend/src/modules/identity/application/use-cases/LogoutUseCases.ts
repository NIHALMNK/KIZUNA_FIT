import { IRefreshTokenSessionRepository } from '../../domain/repositories/IRefreshTokenSessionRepository';
import { IUnitOfWork } from '../ports/IUnitOfWork';
import { LogoutCommand, LogoutAllCommand } from '../commands/Commands';
import { Result } from '../../../../shared/result/Result';
import { UserId } from '../../domain/value-objects/UserId';
import crypto from 'crypto';
import { IClock } from '../ports/IClock';

export class LogoutUseCase {
  constructor(
    private readonly sessionRepository: IRefreshTokenSessionRepository,
    private readonly unitOfWork: IUnitOfWork,
    private readonly clock: IClock
  ) {}

  public async execute(command: LogoutCommand): Promise<Result<void>> {
    const hash = crypto.createHash('sha256').update(command.refreshToken).digest('hex');
    const session = await this.sessionRepository.findByTokenHash(hash);

    if (!session) {
      return Result.ok<void>(); // Idempotent
    }

    if (session.userId.value !== command.userId) {
      return Result.fail<void>('Unauthorized'); // Authorization block
    }

    session.revoke(this.clock.now());

    await this.unitOfWork.start();
    try {
      await this.sessionRepository.save(session, this.unitOfWork.session);
      await this.unitOfWork.commit();
      return Result.ok<void>();
    } catch (err) {
      await this.unitOfWork.rollback();
      throw err;
    }
  }
}

export class LogoutAllUseCase {
  constructor(
    private readonly sessionRepository: IRefreshTokenSessionRepository,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  public async execute(command: LogoutAllCommand): Promise<Result<void>> {
    const userIdResult = UserId.create(command.userId);
    if (userIdResult.isFailure) return Result.fail<void>(userIdResult.error);

    await this.unitOfWork.start();
    try {
      await this.sessionRepository.revokeAllForUser(userIdResult.getValue(), this.unitOfWork.session);
      await this.unitOfWork.commit();
      return Result.ok<void>();
    } catch (err) {
      await this.unitOfWork.rollback();
      throw err;
    }
  }
}
