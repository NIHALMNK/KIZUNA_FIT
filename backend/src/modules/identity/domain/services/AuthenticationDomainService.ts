import { User } from '../entities/User';
import { Result } from '../../../../shared/result/Result';
import { AccountLockoutPolicy } from '../policies/AccountLockoutPolicy';
import { EmailVerificationPolicy } from '../policies/EmailVerificationPolicy';
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

    if (user.status === UserStatus.Locked) {
      return Result.fail<void>('Account is temporarily locked due to too many failed login attempts');
    }

    const verificationResult = EmailVerificationPolicy.canAuthenticate(user);
    if (verificationResult.isFailure) {
      return verificationResult;
    }

    return Result.ok<void>();
  }

  /**
   * Handles the post-authentication result.
   * Either resets failures on success, or increments failures and applies lockout on failure.
   */
  public static processAuthenticationAttempt(user: User, isValidCredential: boolean): void {
    if (isValidCredential) {
      user.resetFailedLogins();
    } else {
      user.recordFailedLogin();
      AccountLockoutPolicy.evaluate(user);
    }
  }
}
