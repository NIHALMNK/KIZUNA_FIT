import { Result } from '../../../../shared/result/Result';
import { IGoogleIdentityProvider } from '../ports/IGoogleIdentityProvider';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IUnitOfWork } from '../ports/IUnitOfWork';
import { AuthProvider } from '../../domain/value-objects/AuthProvider';
import { EmailAddress } from '../../domain/value-objects/EmailAddress';

interface Request {
  userId: string;
  idToken: string;
}

export class LinkGoogleAccountUseCase {
  constructor(
    private readonly googleIdentityProvider: IGoogleIdentityProvider,
    private readonly userRepository: IUserRepository,
    private readonly unitOfWork: IUnitOfWork
  ) {}

  public async execute(request: Request): Promise<Result<void>> {
    const payloadResult = await this.googleIdentityProvider.verifyIdToken(request.idToken);
    
    if (payloadResult.isFailure) {
      return Result.fail<void>(payloadResult.error || 'Invalid Google Token');
    }

    const payload = payloadResult.getValue();

    await this.unitOfWork.start();

    try {
      const user = await this.userRepository.findById(request.userId);
      if (!user) {
        await this.unitOfWork.rollback();
        return Result.fail<void>('User not found');
      }

      const emailResult = EmailAddress.create(payload.email);
      if (emailResult.isFailure) {
        await this.unitOfWork.rollback();
        return Result.fail<void>(emailResult.error || 'Invalid email from Google');
      }

      const googleEmail = emailResult.getValue();
      if (user.email.value !== googleEmail.value) {
        await this.unitOfWork.rollback();
        return Result.fail<void>('Google account email does not match your registered email');
      }

      const linkResult = user.linkExternalIdentity(AuthProvider.GOOGLE);
      if (linkResult.isFailure) {
        await this.unitOfWork.rollback();
        return Result.fail<void>(linkResult.error);
      }

      await this.userRepository.save(user, this.unitOfWork.session);
      

      await this.unitOfWork.commit();
      
      return Result.ok<void>();
    } catch (error: unknown) {
      await this.unitOfWork.rollback();
      return Result.fail<void>(`Failed to link Google account: ${(error as Error).message}`);
    }
  }
}
