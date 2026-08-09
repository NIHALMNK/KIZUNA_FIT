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
    try {
      const profile = await profileApi.getClientProfile();
      const user = useAuthStore.getState().user;
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
      const user = useAuthStore.getState().user;
      return {
        id: user?.id || '',
        email: user?.email || '',
        fullName: 'Client User',
        phoneNumber: null,
        role: 'CLIENT',
        emailVerified: true,
        accountStatus: 'ACTIVE',
        createdAt: new Date().toISOString(),
      };
    }
  }

  public async updateUserAccount(dto: UpdateAccountDTO): Promise<UserAccountDetails> {
    const profile = await profileApi.updateClientProfile(dto);
    const user = useAuthStore.getState().user;
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
