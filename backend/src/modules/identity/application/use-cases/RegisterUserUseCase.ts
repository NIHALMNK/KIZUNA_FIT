import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IPasswordHasher } from '../ports/IPasswordHasher';
import { IUnitOfWork } from '../ports/IUnitOfWork';
import { IEventBus } from '../ports/IEventBus';
import { IClock } from '../ports/IClock';
import { RegisterUserCommand } from '../commands/RegisterUserCommand';
import { Result } from '../../../../shared/result/Result';
import { User, UserProps } from '../../domain/entities/User';
import { EmailAddress } from '../../domain/value-objects/EmailAddress';
import { PasswordHash } from '../../domain/value-objects/PasswordHash';
import { VerificationToken } from '../../domain/value-objects/VerificationToken';
import { PasswordStrengthPolicy } from '../../domain/policies/PasswordStrengthPolicy';
import { UserStatus } from '../../domain/entities/UserStatus';
import { EmailVerification } from '../../domain/entities/EmailVerification';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
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

    const exists = await this.userRepository.exists(email);
    if (exists) {
      return Result.fail<void>('Email already in use');
    }

    let passwordHashVO: PasswordHash | undefined;
    if (command.plaintextPassword) {
      const hash = await this.passwordHasher.hash(command.plaintextPassword);
      passwordHashVO = PasswordHash.create(hash).getValue();
    }

    const verificationTokenVO = VerificationToken.create(crypto.randomUUID()).getValue();
    const emailVerification = EmailVerification.create({
      token: verificationTokenVO,
      expiresAt: new Date(this.clock.now().getTime() + 24 * 60 * 60 * 1000) // 24 hours
    });

    const userProps: UserProps = {
      email,
      status: UserStatus.PendingVerification,
      passwordHash: passwordHashVO,
      emailVerification,
      failedLoginAttempts: 0
    };

    const userResult = User.create(userProps);
    if (userResult.isFailure) return Result.fail<void>(userResult.error);

    const user = userResult.getValue();

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
