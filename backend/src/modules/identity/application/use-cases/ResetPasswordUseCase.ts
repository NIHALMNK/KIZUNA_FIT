import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../ports/IPasswordHasher';
import { IUnitOfWork } from '../ports/IUnitOfWork';
import { IEventBus } from '../ports/IEventBus';
import { ResetPasswordCommand } from '../commands/ResetPasswordCommand';
import { Result } from '../../../../shared/result/Result';
import { EmailAddress } from '../../domain/value-objects/EmailAddress';
import { VerificationToken } from '../../domain/value-objects/VerificationToken';
import { PasswordHash } from '../../domain/value-objects/PasswordHash';
import { PasswordStrengthPolicy } from '../../domain/policies/PasswordStrengthPolicy';

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly unitOfWork: IUnitOfWork,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: ResetPasswordCommand): Promise<Result<void>> {
    if (!command.newPlaintextPassword) {
      return Result.fail<void>('New password is required');
    }

    const emailResult = EmailAddress.create(command.email);
    if (emailResult.isFailure) return Result.fail<void>(emailResult.error);

    const tokenResult = VerificationToken.create(command.token);
    if (tokenResult.isFailure) return Result.fail<void>(tokenResult.error);

    const strengthResult = PasswordStrengthPolicy.validate(command.newPlaintextPassword);
    if (strengthResult.isFailure) return strengthResult;

    const email = emailResult.getValue();
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return Result.fail<void>('Account not found');
    }

    const hash = await this.passwordHasher.hash(command.newPlaintextPassword);
    const passwordHashVO = PasswordHash.create(hash).getValue();

    const resetResult = user.completePasswordReset(tokenResult.getValue(), passwordHashVO);
    if (resetResult.isFailure) {
      return resetResult;
    }

    await this.unitOfWork.start();
    try {
      await this.userRepository.save(user, this.unitOfWork.session);
      
      const events = user.getDomainEvents();
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
