import { User, UserProps } from '../../../../domain/entities/User';

import { EmailAddress } from '../../../../domain/value-objects/EmailAddress';
import { PasswordHash } from '../../../../domain/value-objects/PasswordHash';
import { VerificationToken } from '../../../../domain/value-objects/VerificationToken';
import { UserStatus } from '../../../../domain/entities/UserStatus';
import { EmailVerification, EmailVerificationProps } from '../../../../domain/entities/EmailVerification';
import { PasswordReset, PasswordResetProps } from '../../../../domain/entities/PasswordReset';
import { UserDocument } from '../models/UserModel';

export class UserMapper {
  public static toDomain(raw: UserDocument): User {
    let emailVerification: EmailVerification | undefined;
    if (raw.emailVerification) {
      // Reconstruct using private constructor pattern by bypassing creation validation
      // Any logic in factory is bypassed since data is trusted
      const props: EmailVerificationProps = {
        token: VerificationToken.create(raw.emailVerification.token).getValue(),
        expiresAt: raw.emailVerification.expiresAt,
        verifiedAt: raw.emailVerification.verifiedAt
      };
      // We rely on the public create or private constructor. 
      // Using public create here since we designed it to accept the props and id directly without complex logic.
      emailVerification = EmailVerification.create(props);
    }

    let passwordReset: PasswordReset | undefined;
    if (raw.passwordReset) {
      const props: PasswordResetProps = {
        token: VerificationToken.create(raw.passwordReset.token).getValue(),
        expiresAt: raw.passwordReset.expiresAt,
        usedAt: raw.passwordReset.usedAt
      };
      passwordReset = PasswordReset.create(props);
    }

    const userProps: UserProps = {
      email: EmailAddress.create(raw.email).getValue(),
      status: raw.status as UserStatus,
      passwordHash: raw.passwordHash ? PasswordHash.create(raw.passwordHash).getValue() : undefined,
      emailVerification,
      passwordReset,
      failedLoginAttempts: raw.failedLoginAttempts
    };

    // Use reflection/prototype or the public factory if it allows passing ID and doesn't trigger initial events
    // Wait, User.create() will trigger UserRegisteredEvent if ID is not provided. 
    // We provide ID, so it skips the event generation according to our Domain logic.
    return User.create(userProps, raw._id).getValue();
  }

  public static toPersistence(user: User): Partial<UserDocument> {
    const raw: Partial<UserDocument> = {
      _id: user.id,
      email: user.email.value,
      status: user.status,
      failedLoginAttempts: user.failedLoginAttempts
    };

    if (user.passwordHash) {
      raw.passwordHash = user.passwordHash.value;
    }

    if (user.props.emailVerification) {
      raw.emailVerification = {
        token: user.props.emailVerification.token.value,
        expiresAt: user.props.emailVerification.expiresAt,
        verifiedAt: user.props.emailVerification.verifiedAt
      };
    }

    if (user.props.passwordReset) {
      raw.passwordReset = {
        token: user.props.passwordReset.token.value,
        expiresAt: user.props.passwordReset.expiresAt,
        usedAt: user.props.passwordReset.usedAt
      };
    }

    return raw;
  }
}
