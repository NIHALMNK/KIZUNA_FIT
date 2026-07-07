import { Result } from '../../../../shared/result/Result';

export class PasswordStrengthPolicy {
  public static validate(plaintext: string): Result<void> {
    if (!plaintext || plaintext.length < 8) {
      return Result.fail<void>('Password must be at least 8 characters long');
    }

    const hasUpperCase = /[A-Z]/.test(plaintext);
    const hasLowerCase = /[a-z]/.test(plaintext);
    const hasNumbers = /\d/.test(plaintext);
    const hasNonAlphas = /\W/.test(plaintext);

    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasNonAlphas)) {
      return Result.fail<void>(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      );
    }

    return Result.ok<void>();
  }
}
