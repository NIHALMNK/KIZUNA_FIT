import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { availabilityUseCases } from '../../application/usecases/AvailabilityUseCases';
import { UpdateAvailabilityDTO } from '../../domain/types/profile.types';
import { TRAINER_PROFILE_QUERY_KEY } from './useTrainerProfile';

export const TRAINER_AVAILABILITY_QUERY_KEY = ['trainerAvailability'];

export function useGetTrainerAvailability(enabled = true) {
  return useQuery({
    queryKey: TRAINER_AVAILABILITY_QUERY_KEY,
    queryFn: () => availabilityUseCases.getAvailability(),
    enabled,
    retry: false,
  });
}

export function useUpdateTrainerAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: UpdateAvailabilityDTO) => availabilityUseCases.updateAvailability(dto),
    onSuccess: (data) => {
      queryClient.setQueryData(TRAINER_AVAILABILITY_QUERY_KEY, data);
      queryClient.invalidateQueries({ queryKey: TRAINER_PROFILE_QUERY_KEY });
      toast.success('Availability updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update availability');
    },
  });
}
