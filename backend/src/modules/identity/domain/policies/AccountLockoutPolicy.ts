
import { User } from '../entities/User';
import { UserStatus } from '../entities/UserStatus';

export class AccountLockoutPolicy {
  private static readonly MAX_FAILED_ATTEMPTS = 5;

  /**
   * Evaluates a user's failed attempts and locks the account if necessary.
   * Returns true if the account was just locked, false otherwise.
   */
  public static evaluate(user: User): boolean {
    if (user.status === UserStatus.Locked || user.status === UserStatus.Deleted) {
      return false; // Already locked or deleted
    }

    if (user.failedLoginAttempts >= this.MAX_FAILED_ATTEMPTS) {
      user.lockAccount();
      return true;
    }

    return false;
  }
}
