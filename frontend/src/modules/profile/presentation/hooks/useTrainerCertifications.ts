import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { certificationUseCases } from '../../application/usecases/CertificationUseCases';
import { AddCertificationDTO, UpdateCertificationDTO } from '../../domain/types/profile.types';
import { TRAINER_PROFILE_QUERY_KEY } from './useTrainerProfile';

export function useAddCertification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: AddCertificationDTO) => certificationUseCases.addCertification(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINER_PROFILE_QUERY_KEY });
      toast.success('Certification added successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add certification');
    },
  });
}

export function useUpdateCertification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCertificationDTO }) =>
      certificationUseCases.updateCertification(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINER_PROFILE_QUERY_KEY });
      toast.success('Certification updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update certification');
    },
  });
}

export function useDeleteCertification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => certificationUseCases.deleteCertification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINER_PROFILE_QUERY_KEY });
      toast.success('Certification deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete certification');
    },
  });
}
