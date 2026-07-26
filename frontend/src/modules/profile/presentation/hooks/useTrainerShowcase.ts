import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { showcaseUseCases } from '../../application/usecases/ShowcaseUseCases';
import { AddShowcaseItemDTO, UpdateShowcaseItemDTO } from '../../domain/types/profile.types';
import { TRAINER_PROFILE_QUERY_KEY } from './useTrainerProfile';

export const TRAINER_SHOWCASE_QUERY_KEY = ['trainerShowcase'];

export function useGetShowcaseItems(enabled = true) {
  return useQuery({
    queryKey: TRAINER_SHOWCASE_QUERY_KEY,
    queryFn: () => showcaseUseCases.getShowcaseItems(),
    enabled,
    retry: false,
  });
}

export function useAddShowcaseItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: AddShowcaseItemDTO) => showcaseUseCases.addShowcaseItem(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINER_SHOWCASE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TRAINER_PROFILE_QUERY_KEY });
      toast.success('Showcase item added successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add showcase item');
    },
  });
}

export function useUpdateShowcaseItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateShowcaseItemDTO }) =>
      showcaseUseCases.updateShowcaseItem(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINER_SHOWCASE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TRAINER_PROFILE_QUERY_KEY });
      toast.success('Showcase item updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update showcase item');
    },
  });
}

export function useDeleteShowcaseItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => showcaseUseCases.deleteShowcaseItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINER_SHOWCASE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: TRAINER_PROFILE_QUERY_KEY });
      toast.success('Showcase item deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete showcase item');
    },
  });
}
