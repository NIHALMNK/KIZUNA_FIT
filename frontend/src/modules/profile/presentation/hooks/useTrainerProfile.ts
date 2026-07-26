import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { trainerProfileUseCases } from '../../application/usecases/TrainerProfileUseCases';
import { CreateTrainerProfileDTO, UpdateTrainerProfileDTO } from '../../domain/types/profile.types';

export const TRAINER_PROFILE_QUERY_KEY = ['trainerProfile'];

export function useGetTrainerProfile(enabled = true) {
  return useQuery({
    queryKey: TRAINER_PROFILE_QUERY_KEY,
    queryFn: () => trainerProfileUseCases.getProfile(),
    enabled,
    retry: false,
  });
}

export function useCreateTrainerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateTrainerProfileDTO) => trainerProfileUseCases.createProfile(dto),
    onSuccess: (data) => {
      queryClient.setQueryData(TRAINER_PROFILE_QUERY_KEY, data);
      toast.success('Trainer profile created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create trainer profile');
    },
  });
}

export function useUpdateTrainerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateTrainerProfileDTO) => trainerProfileUseCases.updateProfile(dto),
    onSuccess: (data) => {
      queryClient.setQueryData(TRAINER_PROFILE_QUERY_KEY, data);
      toast.success('Trainer profile updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update trainer profile');
    },
  });
}

export function useUploadTrainerAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => trainerProfileUseCases.uploadAvatar(file),
    onSuccess: (data) => {
      queryClient.setQueryData(TRAINER_PROFILE_QUERY_KEY, data);
      toast.success('Avatar uploaded successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload avatar');
    },
  });
}

export function useDeleteTrainerAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => trainerProfileUseCases.deleteAvatar(),
    onSuccess: (data) => {
      queryClient.setQueryData(TRAINER_PROFILE_QUERY_KEY, data);
      toast.success('Avatar removed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove avatar');
    },
  });
}
