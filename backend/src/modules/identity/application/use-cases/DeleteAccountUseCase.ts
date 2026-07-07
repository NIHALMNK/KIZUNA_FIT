import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IRefreshTokenSessionRepository } from '../../domain/repositories/IRefreshTokenSessionRepository';
import { IPasswordHasher } from '../ports/IPasswordHasher';
import { IUnitOfWork } from '../ports/IUnitOfWork';
import { IEventBus } from '../ports/IEventBus';
import { DeleteAccountCommand } from '../commands/Commands';
import { Result } from '../../../../shared/result/Result';
import { UserId } from '../../domain/value-objects/UserId';

export class DeleteAccountUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly sessionRepository: IRefreshTokenSessionRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly unitOfWork: IUnitOfWork,
    private readonly eventBus: IEventBus
  ) {}

  public async execute(command: DeleteAccountCommand): Promise<Result<void>> {
    const user = await this.userRepository.findById(command.userId);
    
    if (!user) {
      return Result.ok<void>(); // Idempotent
    }

    if (command.confirmationPassword && user.passwordHash) {
      const isValid = await this.passwordHasher.compare(command.confirmationPassword, user.passwordHash.value);
      if (!isValid) return Result.fail<void>('Invalid confirmation password');
    }

    user.deleteAccount();
    const userId = UserId.create(command.userId).getValue();

    await this.unitOfWork.start();
    try {
      await this.userRepository.save(user, this.unitOfWork.session);
      await this.sessionRepository.revokeAllForUser(userId, this.unitOfWork.session);
      
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
