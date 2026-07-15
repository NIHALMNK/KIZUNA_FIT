import { useMutation } from '@tanstack/react-query';
import { identityRepository } from '../../infrastructure/api/IdentityRepository';
import { tokenStorage } from '../../../../infrastructure/storage/TokenStorage';
import { useAuthStore } from '../store/authStore';
import { parseJwt } from '../../../../shared/utils/jwt';
import { AuthResponse } from '../../domain/types/User';
import { Role } from '../../domain/enums/Role';

export const useGoogleLogin = () => {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  return useMutation({
    mutationFn: (idToken: string) => identityRepository.googleLogin({ idToken }),
    onSuccess: (data: AuthResponse) => {
      tokenStorage.setAccessToken(data.accessToken);
      
      const decoded = parseJwt(data.accessToken);
      const role = (decoded?.role as Role) || Role.CLIENT;
      const id = decoded?.userId || '';
      setAuthenticated(data.accessToken);
    },
  });
};
