import { useMutation } from '@tanstack/react-query';
import { identityRepository } from '../../infrastructure/api/IdentityRepository';
import { useAuthStore } from '../store/authStore';
import { tokenStorage } from '../../../../infrastructure/storage/TokenStorage';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => identityRepository.logout(),
    onSettled: () => {
      tokenStorage.removeAccessToken();
      logout();
      queryClient.clear();
      localStorage.setItem('kizuna_logout', Date.now().toString());
      router.push('/');
    },
  });
};
