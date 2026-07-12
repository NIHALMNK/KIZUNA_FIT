import { User } from '../entities/User';
import { Result } from '../../../../shared/result/Result';
import { UserStatus } from '../entities/UserStatus';

/**
 * Domain Service that orchestrates the complex logic of authentication
 * across multiple policies and aggregate states.
 */
export class AuthenticationDomainService {
  /**
   * Validates if a user is allowed to authenticate BEFORE checking credentials.
   * This checks lockouts, suspensions, deletions, and verification policies.
   */
  public static validatePreAuthenticationChecks(user: User): Result<void> {
    if (user.status === UserStatus.Deleted) {
      return Result.fail<void>('Account not found');
    }

    if (user.status === UserStatus.Suspended) {
      return Result.fail<void>('Account has been suspended by an administrator');
    }

    if (user.status === UserStatus.Banned) {
      return Result.fail<void>('Account has been banned by an administrator');
    }

    if (!user.emailVerified) {
      return Result.fail<void>('Please verify your email address to log in.');
    }

    return Result.ok<void>();
  }

}
