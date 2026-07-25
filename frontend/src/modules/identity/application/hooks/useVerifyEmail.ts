import { useMutation } from '@tanstack/react-query';
import { identityRepository } from '../../infrastructure/api/IdentityRepository';
import { VerifyEmailRequest } from '../dto/AuthDtos';

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => identityRepository.verifyEmail(token),
  });
};
