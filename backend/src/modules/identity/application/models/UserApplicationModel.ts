import { UserStatus } from '../../domain/entities/UserStatus';

export interface UserApplicationModel {
  id: string;
  email: string;
  status: UserStatus;
  failedLoginAttempts: number;
}
