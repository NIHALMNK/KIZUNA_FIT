import { UserRole } from '../../domain/value-objects/UserRole';

export interface RegisterUserCommand {
  fullName: string;
  email: string;
  plaintextPassword?: string;
  role: UserRole;
}
