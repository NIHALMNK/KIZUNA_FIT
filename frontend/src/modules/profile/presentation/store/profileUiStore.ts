import { create } from 'zustand';
import { TrainerCertification, TrainerShowcase, SearchTrainerParams } from '../../domain/types/profile.types';

interface ProfileUiState {
  // Modal & Dialog state
  activeCertificationModal: { open: boolean; certification?: TrainerCertification | null };
  activeShowcaseModal: { open: boolean; showcase?: TrainerShowcase | null };
  activeDeleteModal: { open: boolean; id?: string | null; type?: 'certification' | 'showcase' | 'avatar' | null };
  
  // Search & Filter local state
  searchFilters: SearchTrainerParams;

  // Actions
  openCertificationModal: (certification?: TrainerCertification | null) => void;
  closeCertificationModal: () => void;
  openShowcaseModal: (showcase?: TrainerShowcase | null) => void;
  closeShowcaseModal: () => void;
  openDeleteModal: (id: string, type: 'certification' | 'showcase' | 'avatar') => void;
  closeDeleteModal: () => void;
  setSearchFilters: (filters: Partial<SearchTrainerParams>) => void;
  resetSearchFilters: () => void;
}

const initialFilters: SearchTrainerParams = {
  search: '',
  specialization: undefined,
  experienceLevel: undefined,
  minRating: undefined,
  availability: undefined,
  verifiedOnly: false,
  sortBy: 'rating',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
};

export const useProfileUiStore = create<ProfileUiState>((set) => ({
  activeCertificationModal: { open: false, certification: null },
  activeShowcaseModal: { open: false, showcase: null },
  activeDeleteModal: { open: false, id: null, type: null },
  searchFilters: initialFilters,

  openCertificationModal: (certification = null) =>
    set({ activeCertificationModal: { open: true, certification } }),
  closeCertificationModal: () =>
    set({ activeCertificationModal: { open: false, certification: null } }),

  openShowcaseModal: (showcase = null) =>
    set({ activeShowcaseModal: { open: true, showcase } }),
  closeShowcaseModal: () =>
    set({ activeShowcaseModal: { open: false, showcase: null } }),

  openDeleteModal: (id, type) =>
    set({ activeDeleteModal: { open: true, id, type } }),
  closeDeleteModal: () =>
    set({ activeDeleteModal: { open: false, id: null, type: null } }),

  setSearchFilters: (filters) =>
    set((state) => ({
      searchFilters: { ...state.searchFilters, ...filters, page: filters.page ?? 1 },
    })),
  resetSearchFilters: () => set({ searchFilters: initialFilters }),
}));
