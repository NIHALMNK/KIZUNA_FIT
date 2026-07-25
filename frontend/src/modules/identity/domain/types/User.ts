import { Role } from '../enums/Role';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  accessToken: string;
}
