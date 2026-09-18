import { User } from '../../domain/entities/User';
import { UserApplicationModel } from './UserApplicationModel';

export class UserApplicationMapper {
  public static toModel(user: User): UserApplicationModel {
    return {
      id: user.id,
      email: user.email.value,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber || null,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
    };
  }
}
