import { httpClient } from '../../../../infrastructure/api/HttpClient';
import { profileApi } from '../../../profile/infrastructure/api/profileApi';
import { useAuthStore } from '../../../identity/application/store/authStore';
import {
  UserAccountDetails,
  UpdateAccountDTO,
  UserSession,
  DeleteAccountDTO,
} from '../../domain/types/accountSettings.types';

export class AccountSettingsApi {
  public async getUserAccount(): Promise<UserAccountDetails> {
    const user = useAuthStore.getState().user;
    try {
      const userRes = await httpClient.get<{
        id: string;
        email: string;
        fullName?: string;
        phoneNumber?: string | null;
        role?: string;
        status?: string;
        emailVerified?: boolean;
      }>('/users/me');

      if (userRes && userRes.id) {
        return {
          id: userRes.id,
          email: userRes.email || user?.email || '',
          fullName: userRes.fullName || user?.email?.split('@')[0] || 'User',
          phoneNumber: userRes.phoneNumber || null,
          role: (userRes.role || user?.role || 'CLIENT') as 'CLIENT' | 'TRAINER' | 'ADMIN',
          emailVerified: userRes.emailVerified ?? true,
          accountStatus: (userRes.status as any) || 'ACTIVE',
          createdAt: new Date().toISOString(),
        };
      }
    } catch {
      // Fallback to profile API if /users/me fails
    }

    try {
      if (user?.role === 'TRAINER') {
        const profile = await profileApi.getTrainerProfile();
        return {
          id: profile.id,
          email: user?.email || '',
          fullName: user?.email?.split('@')[0] || 'Trainer',
          phoneNumber: null,
          role: 'TRAINER',
          emailVerified: true,
          accountStatus: 'ACTIVE',
          createdAt: profile.createdAt || new Date().toISOString(),
          updatedAt: profile.updatedAt,
        };
      }
      const profile = await profileApi.getClientProfile();
      return {
        id: profile.id,
        email: user?.email || '',
        fullName: profile.fullName || '',
        phoneNumber: profile.phoneNumber || null,
        role: 'CLIENT',
        emailVerified: true,
        accountStatus: 'ACTIVE',
        createdAt: profile.createdAt || new Date().toISOString(),
        updatedAt: profile.updatedAt,
      };
    } catch {
      return {
        id: user?.id || '',
        email: user?.email || '',
        fullName:
          user?.email?.split('@')[0] || (user?.role === 'TRAINER' ? 'Trainer' : 'Client User'),
        phoneNumber: null,
        role: (user?.role || 'CLIENT') as 'CLIENT' | 'TRAINER' | 'ADMIN',
        emailVerified: true,
        accountStatus: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };
    }
  }

  public async updateUserAccount(dto: UpdateAccountDTO): Promise<UserAccountDetails> {
    const user = useAuthStore.getState().user;
    const payload: Record<string, unknown> = {};
    if (dto.fullName !== undefined) payload.fullName = dto.fullName.trim();
    if (dto.phoneNumber !== undefined) payload.phoneNumber = dto.phoneNumber.trim() || null;

    // Call PATCH /api/v1/users/me for account-level fields (fullName, phoneNumber)
    const updatedUser = await httpClient.patch<{
      id: string;
      email: string;
      fullName: string;
      phoneNumber?: string | null;
      role: string;
      status: string;
      emailVerified: boolean;
    }>('/users/me', payload);

    // If client role, also keep ClientProfile synchronized if present
    if (user?.role === 'CLIENT') {
      try {
        await profileApi.updateClientProfile(dto);
      } catch {
        // Ignored if client profile not created yet
      }
    }

    return {
      id: updatedUser.id || user?.id || '',
      email: updatedUser.email || user?.email || '',
      fullName: updatedUser.fullName || user?.email?.split('@')[0] || 'User',
      phoneNumber: updatedUser.phoneNumber || null,
      role: (updatedUser.role || user?.role || 'CLIENT') as 'CLIENT' | 'TRAINER' | 'ADMIN',
      emailVerified: updatedUser.emailVerified ?? true,
      accountStatus: (updatedUser.status as any) || 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
  }

  public async getSessions(): Promise<UserSession[]> {
    const res = await httpClient.get<{ sessions: any[] }>('/identity/sessions');
    return (res?.sessions || []).map((s: any) => ({
      sessionId: s.id || s.sessionId || '',
      deviceName: s.deviceName || s.browser || 'Unknown Device',
      deviceType: (s.deviceType || 'desktop') as 'desktop' | 'mobile' | 'tablet',
      browser: s.browser || 'Unknown',
      operatingSystem: s.operatingSystem || 'Unknown OS',
      ipAddress: s.ipAddress || s.ip || '127.0.0.1',
      location: s.location || 'Unknown',
      currentSession: Boolean(s.currentSession || s.isCurrent),
      lastActiveAt: s.lastActiveAt || s.createdAt || new Date().toISOString(),
      createdAt: s.createdAt,
    }));
  }

  public async logoutAllSessions(): Promise<void> {
    await httpClient.post('/identity/sessions/logout-all', {});
  }

  public async deleteAccount(dto: DeleteAccountDTO): Promise<void> {
    await httpClient.delete('/identity/account', { data: dto });
  }
}

export const accountSettingsApi = new AccountSettingsApi();
