import { useMutation } from '@tanstack/react-query';
import { identityRepository } from '../../infrastructure/api/IdentityRepository';
import { ChangePasswordRequest } from '../dto/AuthDtos';

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => identityRepository.changePassword(data),
  });
};
