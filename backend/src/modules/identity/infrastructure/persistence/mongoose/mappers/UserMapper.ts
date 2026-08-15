import { User, UserProps } from '../../../../domain/entities/User';
import { EmailAddress } from '../../../../domain/value-objects/EmailAddress';
import { PasswordHash } from '../../../../domain/value-objects/PasswordHash';
import { UserStatus } from '../../../../domain/entities/UserStatus';
import { UserRole } from '../../../../domain/value-objects/UserRole';
import { AuthProvider } from '../../../../domain/value-objects/AuthProvider';
import { UserDocument } from '../models/UserModel';
import mongoose from 'mongoose';

export class UserMapper {
  public static toDomain(raw: UserDocument): User {
    const userProps: UserProps = {
      fullName: raw.fullName,
      email: EmailAddress.create(raw.email).getValue(),
      status: raw.status as UserStatus,
      role: raw.role as UserRole,
      passwordHash: raw.passwordHash ? PasswordHash.create(raw.passwordHash).getValue() : undefined,
      authProviders: raw.authProviders.map((p) => p as AuthProvider),
      emailVerified: raw.emailVerified,
      phoneNumber: raw.phoneNumber || null,
      lastLoginAt: raw.lastLoginAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };

    return User.create(userProps, raw._id.toString()).getValue();
  }

  public static toPersistence(user: User): Partial<UserDocument> {
    const raw: Partial<UserDocument> = {
      _id: new mongoose.Types.ObjectId(user.id),
      fullName: user.fullName,
      email: user.email.value,
      role: user.role,
      status: user.status,
      authProviders: user.authProviders,
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber || null,
      lastLoginAt: user.lastLoginAt,
    };

    if (user.passwordHash) {
      raw.passwordHash = user.passwordHash.value;
    }

    return raw;
  }
}
