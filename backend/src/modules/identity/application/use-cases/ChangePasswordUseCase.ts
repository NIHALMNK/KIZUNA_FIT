import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IRefreshTokenSessionRepository } from '../../domain/repositories/IRefreshTokenSessionRepository';
import { IPasswordHasher } from '../ports/IPasswordHasher';
import { IUnitOfWork } from '../ports/IUnitOfWork';
import { IEventBus } from '../ports/IEventBus';
import { ChangePasswordCommand } from '../commands/Commands';
import { Result } from '../../../../shared/result/Result';
import { PasswordStrengthPolicy } from '../../domain/policies/PasswordStrengthPolicy';
import { PasswordHash } from '../../domain/value-objects/PasswordHash';
import { UserId } from '../../domain/value-objects/UserId';

export class ChangePasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: IRefreshTokenSessionRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly unitOfWork: IUnitOfWork,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ChangePasswordCommand): Promise<Result<void>> {
    if (!command.currentPlaintextPassword || !command.newPlaintextPassword) {
      return Result.fail<void>('Passwords required');
    }

    const strengthResult = PasswordStrengthPolicy.validate(command.newPlaintextPassword);
    if (strengthResult.isFailure) return strengthResult;

    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      return Result.fail<void>('Account not found');
    }

    if (!user.passwordHash) {
      return Result.fail<void>('Account has no password (OAuth)');
    }

    const isValid = await this.passwordHasher.compare(command.currentPlaintextPassword, user.passwordHash.value);
    if (!isValid) {
      return Result.fail<void>('Invalid current password');
    }

    const newHashStr = await this.passwordHasher.hash(command.newPlaintextPassword);
    const newHashVO = PasswordHash.create(newHashStr).getValue();

    const changeResult = user.changePassword(newHashVO);
    if (changeResult.isFailure) return changeResult;

    const userId = UserId.create(command.userId).getValue();

    await this.unitOfWork.start();
    try {
      await this.userRepository.save(user, this.unitOfWork.session);
      await this.sessionRepository.revokeAllForUser(userId, this.unitOfWork.session);
      
      const events = user.domainEvents;
      user.clearEvents();

      await this.unitOfWork.commit();
      await this.eventBus.publish(events);
      
      return Result.ok<void>();
    } catch (err) {
      await this.unitOfWork.rollback();
      throw err;
    }
  }
}
