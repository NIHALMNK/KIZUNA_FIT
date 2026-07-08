import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IUnitOfWork } from '../ports/IUnitOfWork';
import { IEventBus } from '../ports/IEventBus';
import { VerifyEmailCommand } from '../commands/VerifyEmailCommand';
import { Result } from '../../../../shared/result/Result';
import { EmailAddress } from '../../domain/value-objects/EmailAddress';
import { VerificationToken } from '../../domain/value-objects/VerificationToken';

export class VerifyEmailUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly unitOfWork: IUnitOfWork,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: VerifyEmailCommand): Promise<Result<void>> {
    const emailResult = EmailAddress.create(command.email);
    if (emailResult.isFailure) return Result.fail<void>(emailResult.error);

    const tokenResult = VerificationToken.create(command.token);
    if (tokenResult.isFailure) return Result.fail<void>(tokenResult.error);

    const email = emailResult.getValue();
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return Result.fail<void>('Account not found');
    }

    const verificationResult = user.verifyEmail(tokenResult.getValue());
    if (verificationResult.isFailure) {
      return verificationResult;
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
