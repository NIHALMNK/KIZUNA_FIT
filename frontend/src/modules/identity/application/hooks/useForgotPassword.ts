import { useMutation } from '@tanstack/react-query';
import { identityRepository } from '../../infrastructure/api/IdentityRepository';

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => identityRepository.forgotPassword(email),
  });
};
