import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IPasswordResetRepository } from '../../domain/repositories/IPasswordResetRepository';
import { IPasswordHasher } from '../ports/IPasswordHasher';
import { IUnitOfWork } from '../ports/IUnitOfWork';
import { IEventBus } from '../ports/IEventBus';
import { IClock } from '../ports/IClock';
import { ResetPasswordCommand } from '../commands/ResetPasswordCommand';
import { Result } from '../../../../shared/result/Result';
import { PasswordHash } from '../../domain/value-objects/PasswordHash';
import crypto from 'crypto';
import { PasswordStrengthPolicy } from '../../domain/policies/PasswordStrengthPolicy';

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordResetRepo: IPasswordResetRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly unitOfWork: IUnitOfWork,
    private readonly eventBus: IEventBus,
    private readonly clock: IClock
  ) {}

  public async execute(command: ResetPasswordCommand): Promise<Result<void>> {
    if (!command.newPlaintextPassword) {
      return Result.fail<void>('New password is required');
    }

    const tokenHash = crypto.createHash('sha256').update(command.token).digest('hex');
    const passwordReset = await this.passwordResetRepo.findByTokenHash(tokenHash);
    
    if (!passwordReset) {
      return Result.fail<void>('Invalid reset token');
    }

    const user = await this.userRepository.findById(passwordReset.userId.value);

    if (!user) {
      return Result.fail<void>('Account not found');
    }
    
    const strengthResult = PasswordStrengthPolicy.validate(command.newPlaintextPassword);
    if (strengthResult.isFailure) return strengthResult;

    const useTokenResult = passwordReset.markAsUsed(this.clock.now());
    if (useTokenResult.isFailure) {
      return useTokenResult;
    }

    const hash = await this.passwordHasher.hash(command.newPlaintextPassword);
    const passwordHashVO = PasswordHash.create(hash).getValue();

    const changeResult = user.changePassword(passwordHashVO);
    if (changeResult.isFailure) {
      return changeResult;
    }

    await this.unitOfWork.start();
    try {
      await this.userRepository.save(user, this.unitOfWork.session);
      await this.passwordResetRepo.save(passwordReset, this.unitOfWork.session);
      
      const events = [...user.domainEvents, ...passwordReset.domainEvents];
      user.clearEvents();
      passwordReset.clearEvents();

      await this.unitOfWork.commit();
      
      await this.eventBus.publish(events);
      
      return Result.ok<void>();
    } catch (err) {
      await this.unitOfWork.rollback();
      throw err;
    }
  }
}
