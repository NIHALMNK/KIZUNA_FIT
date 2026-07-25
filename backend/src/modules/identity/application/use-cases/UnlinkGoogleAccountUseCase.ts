import { Result } from '../../../../shared/result/Result';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IUnitOfWork } from '../ports/IUnitOfWork';
import { AuthProvider } from '../../domain/value-objects/AuthProvider';

interface Request {
  userId: string;
}

export class UnlinkGoogleAccountUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  public async execute(request: Request): Promise<Result<void>> {
    await this.unitOfWork.start();

    try {
      const user = await this.userRepository.findById(request.userId);
      if (!user) {
        await this.unitOfWork.rollback();
        return Result.fail<void>('User not found');
      }

      const unlinkResult = user.removeExternalIdentity(AuthProvider.GOOGLE);
      if (unlinkResult.isFailure) {
        await this.unitOfWork.rollback();
        return Result.fail<void>(unlinkResult.error);
      }

      await this.userRepository.save(user, this.unitOfWork.session);
      

      user.clearEvents();

      await this.unitOfWork.commit();
      
      return Result.ok<void>();
    } catch (error: unknown) {
      await this.unitOfWork.rollback();
      return Result.fail<void>(`Failed to unlink Google account: ${(error as Error).message}`);
    }
  }
}
