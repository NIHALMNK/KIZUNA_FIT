import { Result } from '../../../../shared/result/Result';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { AuthProvider } from '../../domain/value-objects/AuthProvider';

interface Request {
  userId: string;
}

interface ProviderStatus {
  provider: AuthProvider | string;
  linked: boolean;
  canUnlink: boolean;
}

interface Response {
  providers: ProviderStatus[];
}

export class GetAuthProvidersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  public async execute(request: Request): Promise<Result<Response>> {
    const user = await this.userRepository.findById(request.userId);
    
    if (!user) {
      return Result.fail<Response>('User not found');
    }

    const hasLocal = user.hasLocalCredentials();
    const hasGoogle = user.hasExternalIdentity(AuthProvider.GOOGLE);
    
    // According to business rules, LOCAL is always required and can never be unlinked.
    // If we have LOCAL, then Google can be unlinked if it is linked.
    
    const providers: ProviderStatus[] = [
      {
        provider: AuthProvider.LOCAL,
        linked: hasLocal,
        canUnlink: false // LOCAL can never be unlinked
      },
      {
        provider: AuthProvider.GOOGLE,
        linked: hasGoogle,
        canUnlink: hasGoogle && hasLocal // Can only unlink Google if it's currently linked and we have a local password (which we always should)
      }
    ];

    return Result.ok<Response>({ providers });
  }
}
