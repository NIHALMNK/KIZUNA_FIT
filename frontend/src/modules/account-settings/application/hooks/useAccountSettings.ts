import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { accountSettingsApi } from '../../infrastructure/api/accountSettingsApi';
import { identityRepository } from '../../../identity/infrastructure/api/IdentityRepository';
import {
  UpdateAccountDTO,
  DeleteAccountDTO,
  AuthProviderStatus,
} from '../../domain/types/accountSettings.types';
import { useAuthStore } from '../../../identity/application/store/authStore';

export const ACCOUNT_SETTINGS_KEYS = {
  account: ['account-settings', 'user-account'] as const,
  sessions: ['account-settings', 'user-sessions'] as const,
  authProviders: ['identity', 'auth-providers'] as const,
  profile: ['client-profile', 'me'] as const,
};

export const useGetUserAccount = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ACCOUNT_SETTINGS_KEYS.account,
    queryFn: async () => {
      const details = await accountSettingsApi.getUserAccount();
      return {
        ...details,
        id: details.id || user?.id || '',
        email: details.email || user?.email || '',
        fullName: details.fullName || user?.email?.split('@')[0] || 'Client User',
        role: (details.role || user?.role || 'CLIENT') as 'CLIENT' | 'TRAINER' | 'ADMIN',
      };
    },
    staleTime: 1000 * 60 * 2,
  });
};

export const useUpdateUserAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateAccountDTO) => accountSettingsApi.updateUserAccount(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_SETTINGS_KEYS.account });
      queryClient.invalidateQueries({ queryKey: ACCOUNT_SETTINGS_KEYS.profile });
      queryClient.invalidateQueries({ queryKey: ['trainer-profile', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['publicTrainerProfile'] });
      toast.success('Account information updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update account information.');
    },
  });
};

export const useGetUserSessions = () => {
  return useQuery({
    queryKey: ACCOUNT_SETTINGS_KEYS.sessions,
    queryFn: async () => {
      return accountSettingsApi.getSessions();
    },
    staleTime: 1000 * 30,
    retry: 1,
  });
};

export const useLogoutAllSessions = () => {
  const queryClient = useQueryClient();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => accountSettingsApi.logoutAllSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_SETTINGS_KEYS.sessions });
      toast.success('Signed out of all other devices.');
      logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to sign out of all devices.');
    },
  });
};

export const useDeleteAccount = () => {
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: (dto: DeleteAccountDTO) => accountSettingsApi.deleteAccount(dto),
    onSuccess: () => {
      toast.success('Your KIZUNAFIT account has been deleted.');
      logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/?message=account_deleted';
      }
    },
    onError: (error: any) => {
      const msg = error.message || '';
      if (msg.includes('ACTIVE_COACHING_EXISTS')) {
        toast.error('Cannot delete account while an active coaching relationship exists.');
      } else if (msg.includes('PENDING_PAYMENT_EXISTS')) {
        toast.error('Cannot delete account while pending payments exist.');
      } else if (
        msg.includes('Invalid confirmation password') ||
        msg.includes('INVALID_PASSWORD')
      ) {
        toast.error('Incorrect password entered.');
      } else {
        toast.error(msg || 'Failed to delete account.');
      }
    },
  });
};

export const useGetAuthProviders = () => {
  return useQuery({
    queryKey: ACCOUNT_SETTINGS_KEYS.authProviders,
    queryFn: async () => {
      const res = await identityRepository.getAuthProviders();
      return (res?.providers || []) as AuthProviderStatus[];
    },
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });
};

export const useUnlinkGoogle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => identityRepository.unlinkGoogle(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_SETTINGS_KEYS.authProviders });
      toast.success('Google account unlinked successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to unlink Google account.');
    },
  });
};

export const useLinkGoogle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (idToken: string) => identityRepository.linkGoogle(idToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ACCOUNT_SETTINGS_KEYS.authProviders });
      toast.success('Google account linked successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to link Google account.');
    },
  });
};
