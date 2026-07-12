import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IPasswordResetRepository } from '../../domain/repositories/IPasswordResetRepository';
import { IUnitOfWork } from '../ports/IUnitOfWork';
import { IEventBus } from '../ports/IEventBus';
import { IClock } from '../ports/IClock';
import { ForgotPasswordCommand } from '../commands/ForgotPasswordCommand';
import { Result } from '../../../../shared/result/Result';
import { EmailAddress } from '../../domain/value-objects/EmailAddress';
import { PasswordReset } from '../../domain/entities/PasswordReset';
import { UserId } from '../../domain/value-objects/UserId';
import { PasswordResetRequestedEvent } from '../../domain/events/PasswordResetRequestedEvent';
import { VerificationToken } from '../../domain/value-objects/VerificationToken';
import crypto from 'crypto';

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordResetRepo: IPasswordResetRepository,
    private readonly unitOfWork: IUnitOfWork,
    private readonly eventBus: IEventBus,
    private readonly clock: IClock
  ) {}

  public async execute(command: ForgotPasswordCommand): Promise<Result<void>> {
    const emailResult = EmailAddress.create(command.email);
    if (emailResult.isFailure) return Result.fail<void>(emailResult.error);

    const email = emailResult.getValue();
    const user = await this.userRepository.findByEmail(email.value);

    if (!user) {
      // Idempotency: Anti-enumeration. If email doesn't exist, return success.
      return Result.ok<void>();
    }

    if (user.status === 'DELETED') {
      return Result.ok<void>();
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(this.clock.now().getTime() + 3600000); // 1 hour

    const resetResult = PasswordReset.create(
      UserId.create(user.id).getValue(),
      resetTokenHash,
      expiresAt
    );
    
    if (resetResult.isFailure) {
      return Result.fail<void>(resetResult.error);
    }

    const passwordReset = resetResult.getValue();
    const event = new PasswordResetRequestedEvent(
      { id: UserId.create(user.id).getValue(), email: email },
      VerificationToken.create(rawToken).getValue()
    );

    await this.unitOfWork.start();
    try {
      await this.passwordResetRepo.invalidateExistingByUserId(user.id, this.unitOfWork.session);
      await this.passwordResetRepo.save(passwordReset, this.unitOfWork.session);
      
      const events = passwordReset.domainEvents;
      passwordReset.clearEvents();

      await this.unitOfWork.commit();
      
      await this.eventBus.publish([...events, event]);
      
      return Result.ok<void>();
    } catch (err) {
      await this.unitOfWork.rollback();
      throw err;
    }
  }
}
