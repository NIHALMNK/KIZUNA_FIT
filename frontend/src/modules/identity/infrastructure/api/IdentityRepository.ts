import { httpClient } from '../../../../infrastructure/api/HttpClient';
import { IIdentityRepository } from '../../domain/repositories/IIdentityRepository';
import { RegisterRequest, LoginRequest, GoogleLoginRequest, VerifyEmailRequest, ResetPasswordRequest } from '../../application/dto/AuthDtos';
import { AuthResponse } from '../../domain/types/User';

class IdentityRepository implements IIdentityRepository {
  async register(data: RegisterRequest): Promise<void> {
    await httpClient.post('/identity/register', data);
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>('/identity/login', data);
  }

  async googleLogin(data: GoogleLoginRequest): Promise<AuthResponse> {
    console.log('6. repository called');
    return httpClient.post<AuthResponse>('/identity/google', data);
  }

  async logout(): Promise<void> {
    await httpClient.post('/identity/logout', {}, { withCredentials: true });
  }

  async checkEmail(email: string): Promise<{ exists: boolean }> {
    const res = await httpClient.post<{ available: boolean }>('/identity/check-email', { email });
    return { exists: !res.available };
  }

  async verifyEmail(token: string): Promise<void> {
    return httpClient.post('/identity/verify-email', { token });
  }

  async resendVerification(email: string): Promise<void> {
    await httpClient.post('/identity/resend-verification', { email });
  }

  async forgotPassword(email: string): Promise<void> {
    await httpClient.post('/identity/password/forgot', { email });
  }

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await httpClient.post('/identity/password/reset', data);
  }

  async linkGoogle(idToken: string): Promise<void> {
    await httpClient.post('/identity/providers/google/link', { idToken });
  }

  async unlinkGoogle(): Promise<void> {
    await httpClient.post('/identity/providers/google/unlink', {});
  }

  async getAuthProviders(): Promise<{ providers: any[] }> {
    return httpClient.get<{ providers: any[] }>('/identity/auth-providers');
  }

  async logoutAll(): Promise<void> {
    await httpClient.post('/identity/sessions/logout-all', {}, { withCredentials: true });
  }

  async getSessions(): Promise<{ sessions: any[] }> {
    return httpClient.get<{ sessions: any[] }>('/identity/sessions');
  }
}

export const identityRepository = new IdentityRepository();
