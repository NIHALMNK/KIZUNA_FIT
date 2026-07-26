import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { publicTrainerUseCases } from '../../application/usecases/PublicTrainerUseCases';
import { SearchTrainerParams } from '../../domain/types/profile.types';

export const SEARCH_TRAINERS_QUERY_KEY = 'searchTrainers';
export const PUBLIC_TRAINER_PROFILE_QUERY_KEY = 'publicTrainerProfile';

export function useSearchTrainers(params: SearchTrainerParams) {
  return useQuery({
    queryKey: [SEARCH_TRAINERS_QUERY_KEY, params],
    queryFn: () => publicTrainerUseCases.searchTrainers(params),
    placeholderData: keepPreviousData,
  });
}

export function useGetPublicTrainerProfile(trainerIdOrUserId: string) {
  return useQuery({
    queryKey: [PUBLIC_TRAINER_PROFILE_QUERY_KEY, trainerIdOrUserId],
    queryFn: () => publicTrainerUseCases.getPublicProfile(trainerIdOrUserId),
    enabled: !!trainerIdOrUserId,
  });
}
