import { useMutation } from '@tanstack/react-query';
import { identityRepository } from '../../infrastructure/api/IdentityRepository';
import { RegisterRequest } from '../dto/AuthDtos';

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => identityRepository.register(data),
  });
};
