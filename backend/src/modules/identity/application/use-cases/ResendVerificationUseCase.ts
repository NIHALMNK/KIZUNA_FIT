import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IEmailVerificationRepository } from '../../domain/repositories/IEmailVerificationRepository';
import { IUnitOfWork } from '../ports/IUnitOfWork';
import { IEventBus } from '../ports/IEventBus';
import { IClock } from '../ports/IClock';
import { Result } from '../../../../shared/result/Result';
import { EmailAddress } from '../../domain/value-objects/EmailAddress';
import { EmailVerification } from '../../domain/entities/EmailVerification';
import { UserId } from '../../domain/value-objects/UserId';
import crypto from 'crypto';

export interface ResendVerificationCommand {
  email: string;
}

export class ResendVerificationUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailVerificationRepo: IEmailVerificationRepository,
    private readonly unitOfWork: IUnitOfWork,
    private readonly eventBus: IEventBus,
    private readonly clock: IClock
  ) {}

  public async execute(command: ResendVerificationCommand): Promise<Result<void>> {
    const emailResult = EmailAddress.create(command.email);
    if (emailResult.isFailure) return Result.fail<void>(emailResult.error);

    const email = emailResult.getValue();
    const user = await this.userRepository.findByEmail(email.value);

    if (!user) {
      // Idempotency / Anti-enumeration
      return Result.ok<void>();
    }

    if (user.emailVerified) {
      return Result.ok<void>();
    }

    if (user.status === 'DELETED') {
      return Result.ok<void>();
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(this.clock.now().getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const emailVerificationResult = EmailVerification.create(
      UserId.create(user.id).getValue(),
      email,
      verificationTokenHash,
      expiresAt
    );

    if (emailVerificationResult.isFailure) {
      return Result.fail<void>(emailVerificationResult.error);
    }
    
    const emailVerification = emailVerificationResult.getValue();

    await this.unitOfWork.start();
    try {
      await this.emailVerificationRepo.invalidateExistingByUserId(user.id, this.unitOfWork.session);
      await this.emailVerificationRepo.save(emailVerification, this.unitOfWork.session);
      
      const events = emailVerification.domainEvents;
      emailVerification.clearEvents();

      // IMPORTANT: In a real app we'd pass rawToken inside the event here
      // For now, the domain event is emitted.

      await this.unitOfWork.commit();
      
      await this.eventBus.publish(events);
      
      return Result.ok<void>();
    } catch (err) {
      await this.unitOfWork.rollback();
      throw err;
    }
  }
}
