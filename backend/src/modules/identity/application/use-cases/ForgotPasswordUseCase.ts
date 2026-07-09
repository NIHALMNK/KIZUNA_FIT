import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IUnitOfWork } from '../ports/IUnitOfWork';
import { IEventBus } from '../ports/IEventBus';
import { IClock } from '../ports/IClock';
import { ForgotPasswordCommand } from '../commands/ForgotPasswordCommand';
import { Result } from '../../../../shared/result/Result';
import { EmailAddress } from '../../domain/value-objects/EmailAddress';
import { VerificationToken } from '../../domain/value-objects/VerificationToken';

export class ForgotPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly unitOfWork: IUnitOfWork,
    private readonly eventBus: IEventBus,
    private readonly clock: IClock
  ) {}

  public async execute(command: ForgotPasswordCommand): Promise<Result<void>> {
    const emailResult = EmailAddress.create(command.email);
    if (emailResult.isFailure) return Result.fail<void>(emailResult.error);

    const email = emailResult.getValue();
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      // Idempotency: Anti-enumeration. If email doesn't exist, return success.
      return Result.ok<void>();
    }

    const token = VerificationToken.create(crypto.randomUUID()).getValue();
    const requestResult = user.requestPasswordReset(token, new Date(this.clock.now().getTime() + 3600000));
    
    if (requestResult.isFailure) {
      // Could be deleted user, return success to anti-enumerate
      return Result.ok<void>();
    }

    await this.unitOfWork.start();
    try {
      await this.userRepository.save(user, this.unitOfWork.session);
      
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
