import { useMutation } from '@tanstack/react-query';
import { identityRepository } from '../../infrastructure/api/IdentityRepository';
import { ResetPasswordRequest } from '../dto/AuthDtos';

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: ResetPasswordRequest) => identityRepository.resetPassword(data),
  });
};
