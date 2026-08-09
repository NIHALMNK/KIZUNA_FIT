import { UserStatus } from '../../domain/entities/UserStatus';

export interface UserApplicationModel {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string | null;
  role: string;
  status: UserStatus;
  emailVerified: boolean;
}
