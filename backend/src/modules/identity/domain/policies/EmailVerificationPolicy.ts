import { Result } from '../../../../shared/result/Result';
import { User } from '../entities/User';
import { UserStatus } from '../entities/UserStatus';

export class EmailVerificationPolicy {
  /**
   * Determines if a user is allowed to authenticate based on their verification status.
   */
  public static canAuthenticate(user: User): Result<void> {
    if (user.status === UserStatus.PendingVerification) {
      return Result.fail<void>('Please verify your email address before logging in');
    }
    
    return Result.ok<void>();
  }
}
