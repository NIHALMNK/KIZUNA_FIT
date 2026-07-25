import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IEmailVerificationRepository } from '../../domain/repositories/IEmailVerificationRepository';
import { IPasswordHasher } from '../ports/IPasswordHasher';
import { IUnitOfWork } from '../ports/IUnitOfWork';
import { IEventBus } from '../ports/IEventBus';
import { IClock } from '../ports/IClock';
import { RegisterUserCommand } from '../commands/RegisterUserCommand';
import { Result } from '../../../../shared/result/Result';
import { User, UserProps } from '../../domain/entities/User';
import { EmailAddress } from '../../domain/value-objects/EmailAddress';
import { PasswordHash } from '../../domain/value-objects/PasswordHash';
import { PasswordStrengthPolicy } from '../../domain/policies/PasswordStrengthPolicy';
import { UserStatus } from '../../domain/entities/UserStatus';
import { AuthProvider } from '../../domain/value-objects/AuthProvider';
import { EmailVerification } from '../../domain/entities/EmailVerification';
import { UserId } from '../../domain/value-objects/UserId';
import { EmailVerificationRequestedEvent } from '../events/EmailVerificationRequestedEvent';
import crypto from 'crypto';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailVerificationRepo: IEmailVerificationRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly unitOfWork: IUnitOfWork,
    private readonly eventBus: IEventBus,
    private readonly clock: IClock
  ) {}

  public async execute(command: RegisterUserCommand): Promise<Result<void>> {
    const emailResult = EmailAddress.create(command.email);
    if (emailResult.isFailure) return Result.fail<void>(emailResult.error);

    const email = emailResult.getValue();

    if (command.plaintextPassword) {
      const strengthResult = PasswordStrengthPolicy.validate(command.plaintextPassword);
      if (strengthResult.isFailure) return strengthResult;
    }

    const exists = await this.userRepository.existsByEmail(email.value);
    if (exists) {
      return Result.fail<void>('Email already in use');
    }

    let passwordHashVO: PasswordHash | undefined;
    if (command.plaintextPassword) {
      const hash = await this.passwordHasher.hash(command.plaintextPassword);
      passwordHashVO = PasswordHash.create(hash).getValue();
    }

    const userProps: UserProps = {
      fullName: command.fullName,
      email,
      role: command.role,
      status: UserStatus.Active,
      authProviders: [AuthProvider.LOCAL],
      emailVerified: false,
      passwordHash: passwordHashVO
    };

    const userResult = User.create(userProps);
    if (userResult.isFailure) return Result.fail<void>(userResult.error);

    const user = userResult.getValue();

    // Create Email Verification Entity
    const rawToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(this.clock.now().getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const emailVerificationResult = EmailVerification.create(
      UserId.create(user.id).getValue(),
      email,
      verificationTokenHash,
      expiresAt
    );

    if (emailVerificationResult.isFailure) return Result.fail<void>(emailVerificationResult.error);
    const emailVerification = emailVerificationResult.getValue();

    await this.unitOfWork.start();
    try {
      await this.userRepository.save(user, this.unitOfWork.session);
      await this.emailVerificationRepo.save(emailVerification, this.unitOfWork.session);
      
      const events = [...user.domainEvents, ...emailVerification.domainEvents];
      
      user.clearEvents();
      emailVerification.clearEvents();

      // Application Event
      const emailVerificationRequestedEvent = new EmailVerificationRequestedEvent(
        user.id,
        email.value,
        rawToken
      );

      await this.unitOfWork.commit();
      
      // Dispatch Domain Events + Application Events
      await this.eventBus.publish([...events, emailVerificationRequestedEvent]);
      
      return Result.ok<void>();
    } catch (err) {
      await this.unitOfWork.rollback();
      throw err;
    }
  }
}
