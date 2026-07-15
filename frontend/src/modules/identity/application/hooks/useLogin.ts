import { useMutation } from '@tanstack/react-query';
import { identityRepository } from '../../infrastructure/api/IdentityRepository';
import { LoginRequest } from '../dto/AuthDtos';
import { useAuthStore } from '../store/authStore';
import { tokenStorage } from '../../../../infrastructure/storage/TokenStorage';

export const useLogin = () => {
  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  return useMutation({
    mutationFn: (data: LoginRequest) => identityRepository.login(data),
    onSuccess: (data) => {
      tokenStorage.setAccessToken(data.accessToken);
      setAuthenticated(data.accessToken);
    },
  });
};
