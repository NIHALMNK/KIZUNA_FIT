import { RegisterRequest, LoginRequest, GoogleLoginRequest, VerifyEmailRequest, ResetPasswordRequest, ChangePasswordRequest } from '../../application/dto/AuthDtos';
import { AuthResponse } from '../types/User';

export interface IIdentityRepository {
  register(data: RegisterRequest): Promise<void>;
  login(data: LoginRequest): Promise<AuthResponse>;
  googleLogin(data: GoogleLoginRequest): Promise<AuthResponse>;
  logout(): Promise<void>;
  checkEmail(email: string): Promise<{ exists: boolean }>;
  verifyEmail(token: string): Promise<void>;
  resendVerification(email: string): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(data: ResetPasswordRequest): Promise<void>;
  changePassword(data: ChangePasswordRequest): Promise<void>;
  linkGoogle(idToken: string): Promise<void>;
  unlinkGoogle(): Promise<void>;
  getAuthProviders(): Promise<{ providers: any[] }>;
  logoutAll(): Promise<void>;
  getSessions(): Promise<{ sessions: any[] }>;
}
