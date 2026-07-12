import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IEmailVerificationRepository } from '../../domain/repositories/IEmailVerificationRepository';
import { IUnitOfWork } from '../ports/IUnitOfWork';
import { IEventBus } from '../ports/IEventBus';
import { IClock } from '../ports/IClock';
import { VerifyEmailCommand } from '../commands/VerifyEmailCommand';
import { Result } from '../../../../shared/result/Result';
import crypto from 'crypto';

export class VerifyEmailUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailVerificationRepo: IEmailVerificationRepository,
    private readonly unitOfWork: IUnitOfWork,
    private readonly eventBus: IEventBus,
    private readonly clock: IClock
  ) {}

  public async execute(command: VerifyEmailCommand): Promise<Result<void>> {
    const tokenHash = crypto.createHash('sha256').update(command.token).digest('hex');
    const verification = await this.emailVerificationRepo.findByTokenHash(tokenHash);
    
    if (!verification) {
      return Result.fail<void>('Invalid verification token');
    }

    const user = await this.userRepository.findById(verification.userId.value);

    if (!user) {
      return Result.fail<void>('Account not found');
    }

    const verifyTokenResult = verification.verify(this.clock.now());
    if (verifyTokenResult.isFailure) {
      return verifyTokenResult;
    }

    const userVerifyResult = user.markEmailAsVerified();
    if (userVerifyResult.isFailure) {
      return userVerifyResult;
    }

    await this.unitOfWork.start();
    try {
      await this.userRepository.save(user, this.unitOfWork.session);
      await this.emailVerificationRepo.delete(verification.id, this.unitOfWork.session);
      
      const events = [...user.domainEvents, ...verification.domainEvents];
      user.clearEvents();
      verification.clearEvents();

      await this.unitOfWork.commit();
      
      await this.eventBus.publish(events);
      
      return Result.ok<void>();
    } catch (err) {
      await this.unitOfWork.rollback();
      throw err;
    }
  }
}
