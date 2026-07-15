import { Role } from '../../domain/enums/Role';

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role?: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface GoogleLoginRequest {
  idToken: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
