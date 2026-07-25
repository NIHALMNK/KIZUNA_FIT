import { useMutation } from '@tanstack/react-query';
import { identityRepository } from '../../infrastructure/api/IdentityRepository';

export const useResendVerification = () => {
  return useMutation({
    mutationFn: (email: string) => identityRepository.resendVerification(email),
  });
};
