import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { clientProfileUseCases } from '../../application/usecases/ClientProfileUseCases';
import { CreateClientProfileDTO, UpdateClientProfileDTO } from '../../domain/types/profile.types';

export const CLIENT_PROFILE_QUERY_KEY = ['clientProfile'];

export function useGetClientProfile(enabled = true) {
  return useQuery({
    queryKey: CLIENT_PROFILE_QUERY_KEY,
    queryFn: () => clientProfileUseCases.getProfile(),
    enabled,
    retry: false,
  });
}

export function useCreateClientProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateClientProfileDTO) => clientProfileUseCases.createProfile(dto),
    onSuccess: (data) => {
      queryClient.setQueryData(CLIENT_PROFILE_QUERY_KEY, data);
      queryClient.invalidateQueries({ queryKey: CLIENT_PROFILE_QUERY_KEY });
      toast.success('Client profile created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create client profile');
    },
  });
}

export function useUpdateClientProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateClientProfileDTO) => clientProfileUseCases.updateProfile(dto),
    onSuccess: (data) => {
      queryClient.setQueryData(CLIENT_PROFILE_QUERY_KEY, data);
      toast.success('Client profile updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update client profile');
    },
  });
}

export function useUploadClientAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => clientProfileUseCases.uploadAvatar(file),
    onSuccess: (data) => {
      queryClient.setQueryData(CLIENT_PROFILE_QUERY_KEY, data);
      toast.success('Avatar uploaded successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to upload avatar');
    },
  });
}

export function useDeleteClientAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => clientProfileUseCases.deleteAvatar(),
    onSuccess: (data) => {
      queryClient.setQueryData(CLIENT_PROFILE_QUERY_KEY, data);
      toast.success('Avatar removed successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to remove avatar');
    },
  });
}
