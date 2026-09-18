import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { useClientAcquisitionJourney } from '../application/hooks/useClientAcquisitionJourney';
import { JourneyStage, SelectedTrainerInfo } from '../domain/types/journey.types';
import { CoachingRelationshipStatus } from '../../coaching/domain/types/coaching.types';
import { CoachingOfferStatus } from '../../offer/domain/types/offer.types';
import { ConsultationStatus } from '../../consultation/domain/types/consultation.types';
import { TrainerRequestStatus } from '../../marketplace/domain/types';

// Mock dependencies
const mockUseActiveCoachingRelationship = vi.fn();
const mockUseReceivedOffers = vi.fn();
const mockUseUpcomingConsultations = vi.fn();
const mockUseGetTrainerRequests = vi.fn();

vi.mock('../../coaching/application/queries/useActiveCoachingRelationship', () => ({
  useActiveCoachingRelationship: () => mockUseActiveCoachingRelationship(),
}));

vi.mock('../../offer/application/hooks/useOffers', () => ({
  useReceivedOffers: () => mockUseReceivedOffers(),
}));

vi.mock('../../consultation/application/hooks/useConsultationQueries', () => ({
  useUpcomingConsultations: () => mockUseUpcomingConsultations(),
}));

vi.mock('../../marketplace/application/useMarketplace', () => ({
  useGetTrainerRequests: () => mockUseGetTrainerRequests(),
}));

function renderTestHook(initialSelectedTrainer: SelectedTrainerInfo | null = null) {
  let stateIndex = 0;
  const states: any[] = [];
  const stateSetters: any[] = [];

  const result = { current: null as any };

  function rerender() {
    stateIndex = 0;

    const mockDispatcher = {
      useState: (initialValue: any) => {
        const idx = stateIndex++;
        if (states.length <= idx) {
          states[idx] = typeof initialValue === 'function' ? initialValue() : initialValue;
          stateSetters[idx] = (newValue: any) => {
            const nextVal = typeof newValue === 'function' ? newValue(states[idx]) : newValue;
            states[idx] = nextVal;
            rerender();
          };
        }
        return [states[idx], stateSetters[idx]];
      },
      useMemo: (fn: any) => fn(),
      useCallback: (fn: any) => fn,
      useEffect: () => {},
      useRef: (initial: any) => ({ current: initial }),
      useLayoutEffect: () => {},
      useContext: () => {},
      useReducer: (reducer: any, initial: any) => [initial, () => {}],
    };

    const dispatcherObj = (React as any).__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
      ?.ReactCurrentDispatcher;

    const prevDispatcher = dispatcherObj ? dispatcherObj.current : null;
    if (dispatcherObj) {
      dispatcherObj.current = mockDispatcher;
    }

    try {
      result.current = useClientAcquisitionJourney(initialSelectedTrainer);
    } finally {
      if (dispatcherObj) {
        dispatcherObj.current = prevDispatcher;
      }
    }
  }

  rerender();

  return {
    result,
    rerender,
  };
}

describe('useClientAcquisitionJourney', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default: Empty idle responses
    mockUseActiveCoachingRelationship.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseReceivedOffers.mockReturnValue({
      data: { offers: [] },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseUpcomingConsultations.mockReturnValue({
      data: { consultations: [] },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    mockUseGetTrainerRequests.mockReturnValue({
      data: { requests: [] },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });
  });

  it('resolves to Stage 1 (Discovery) when client has no active lifecycle state', () => {
    const { result } = renderTestHook();

    expect(result.current.currentStage).toBe(JourneyStage.STAGE_1_DISCOVERY);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.activeCoaching).toBeNull();
    expect(result.current.activeOffer).toBeNull();
    expect(result.current.activeConsultation).toBeNull();
    expect(result.current.activeRequest).toBeNull();
  });

  it('resolves to Stage 2 (Trainer Selected) when trainer is selected locally', () => {
    const { result } = renderTestHook();

    result.current.setSelectedTrainer({
      id: 'trainer-1',
      fullName: 'Coach John Doe',
      headline: 'Elite Strength Coach',
    });

    expect(result.current.currentStage).toBe(JourneyStage.STAGE_2_TRAINER_SELECTED);
    expect(result.current.selectedTrainer?.id).toBe('trainer-1');
  });

  it('resolves to Stage 3 (Request Pending) when an active trainer request exists', () => {
    mockUseGetTrainerRequests.mockReturnValue({
      data: {
        requests: [
          {
            requestId: 'req-123',
            status: TrainerRequestStatus.REQUEST_PENDING,
            trainerSnapshot: { fullName: 'Coach Sarah' },
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderTestHook();

    expect(result.current.currentStage).toBe(JourneyStage.STAGE_3_REQUEST_PENDING);
    expect(result.current.activeRequest?.requestId).toBe('req-123');
  });

  it('resolves to Stage 4 (Consultation) when upcoming consultation exists', () => {
    mockUseUpcomingConsultations.mockReturnValue({
      data: {
        consultations: [
          {
            consultationId: 'cons-456',
            status: ConsultationStatus.SCHEDULED,
            slot: { scheduledStartAt: '2026-09-20T10:00:00Z' },
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderTestHook();

    expect(result.current.currentStage).toBe(JourneyStage.STAGE_4_CONSULTATION);
    expect(result.current.activeConsultation?.consultationId).toBe('cons-456');
  });

  it('resolves to Stage 5 (Offer) when active offer exists', () => {
    mockUseReceivedOffers.mockReturnValue({
      data: {
        offers: [
          {
            offerId: 'offer-789',
            status: CoachingOfferStatus.SENT,
            pricing: { totalAmount: 4999, currency: 'INR' },
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderTestHook();

    expect(result.current.currentStage).toBe(JourneyStage.STAGE_5_OFFER);
    expect(result.current.activeOffer?.offerId).toBe('offer-789');
  });

  it('resolves to Stage 6 (My Trainer) when active coaching relationship exists', () => {
    mockUseActiveCoachingRelationship.mockReturnValue({
      data: [
        {
          relationshipId: 'rel-999',
          status: CoachingRelationshipStatus.ACTIVE,
          trainer: { id: 'trainer-9', fullName: 'Coach Alex' },
        },
      ],
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderTestHook();

    expect(result.current.currentStage).toBe(JourneyStage.STAGE_6_MY_TRAINER);
    expect(result.current.activeCoaching?.relationshipId).toBe('rel-999');
  });

  it('resolves to Stage 4 (Consultation) when request is accepted by trainer', () => {
    mockUseGetTrainerRequests.mockReturnValue({
      data: {
        requests: [
          {
            requestId: 'req-accepted-1',
            status: TrainerRequestStatus.REQUEST_ACCEPTED,
            trainerSnapshot: { fullName: 'Coach Accepted' },
          },
        ],
      },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderTestHook();

    expect(result.current.currentStage).toBe(JourneyStage.STAGE_4_CONSULTATION);
    expect(result.current.activeRequest?.requestId).toBe('req-accepted-1');
  });

  it('handles coaching data returned as an object wrapper with relationships array', () => {
    mockUseActiveCoachingRelationship.mockReturnValue({
      data: {
        relationships: [
          {
            relationshipId: 'rel-wrapped',
            status: 'ACTIVE',
            trainer: { fullName: 'Wrapped Coach' },
          },
        ],
      } as any,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderTestHook();

    expect(result.current.currentStage).toBe(JourneyStage.STAGE_6_MY_TRAINER);
    expect(result.current.activeCoaching?.relationshipId).toBe('rel-wrapped');
  });

  it('handles undefined or malformed query data gracefully without crashing', () => {
    mockUseActiveCoachingRelationship.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseReceivedOffers.mockReturnValue({
      data: null as any,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseUpcomingConsultations.mockReturnValue({
      data: 'invalid string' as any,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });
    mockUseGetTrainerRequests.mockReturnValue({
      data: 12345 as any,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderTestHook();

    expect(result.current.currentStage).toBe(JourneyStage.STAGE_1_DISCOVERY);
    expect(result.current.activeCoaching).toBeNull();
    expect(result.current.activeOffer).toBeNull();
    expect(result.current.activeConsultation).toBeNull();
    expect(result.current.activeRequest).toBeNull();
  });

  describe('Priority conflict tests', () => {
    it('Active coaching takes precedence over an old offer (Priority 1 > 2)', () => {
      mockUseActiveCoachingRelationship.mockReturnValue({
        data: [
          {
            relationshipId: 'rel-active',
            status: CoachingRelationshipStatus.ACTIVE,
          },
        ],
        isLoading: false,
        isError: false,
      });

      mockUseReceivedOffers.mockReturnValue({
        data: {
          offers: [
            {
              offerId: 'old-offer',
              status: CoachingOfferStatus.SENT,
            },
          ],
        },
        isLoading: false,
        isError: false,
      });

      const { result } = renderTestHook();

      expect(result.current.currentStage).toBe(JourneyStage.STAGE_6_MY_TRAINER);
    });

    it('Active offer takes precedence over old consultation (Priority 2 > 3)', () => {
      mockUseReceivedOffers.mockReturnValue({
        data: {
          offers: [
            {
              offerId: 'offer-active',
              status: CoachingOfferStatus.SENT,
            },
          ],
        },
        isLoading: false,
        isError: false,
      });

      mockUseUpcomingConsultations.mockReturnValue({
        data: {
          consultations: [
            {
              consultationId: 'old-cons',
              status: ConsultationStatus.SCHEDULED,
            },
          ],
        },
        isLoading: false,
        isError: false,
      });

      const { result } = renderTestHook();

      expect(result.current.currentStage).toBe(JourneyStage.STAGE_5_OFFER);
    });

    it('Active consultation takes precedence over pending request (Priority 3 > 4)', () => {
      mockUseUpcomingConsultations.mockReturnValue({
        data: {
          consultations: [
            {
              consultationId: 'cons-active',
              status: ConsultationStatus.SCHEDULED,
            },
          ],
        },
        isLoading: false,
        isError: false,
      });

      mockUseGetTrainerRequests.mockReturnValue({
        data: {
          requests: [
            {
              requestId: 'req-pending',
              status: TrainerRequestStatus.REQUEST_PENDING,
            },
          ],
        },
        isLoading: false,
        isError: false,
      });

      const { result } = renderTestHook();

      expect(result.current.currentStage).toBe(JourneyStage.STAGE_4_CONSULTATION);
    });

    it('Active request takes precedence over locally selected trainer (Priority 4 > 5)', () => {
      mockUseGetTrainerRequests.mockReturnValue({
        data: {
          requests: [
            {
              requestId: 'req-pending',
              status: TrainerRequestStatus.REQUEST_PENDING,
            },
          ],
        },
        isLoading: false,
        isError: false,
      });

      const { result } = renderTestHook({
        id: 'local-trainer',
        fullName: 'Local Coach',
      });

      expect(result.current.currentStage).toBe(JourneyStage.STAGE_3_REQUEST_PENDING);
    });
  });

  describe('Loading and Error states', () => {
    it('sets isLoading to true if any underlying query is loading', () => {
      mockUseGetTrainerRequests.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
      });

      const { result } = renderTestHook();

      expect(result.current.isLoading).toBe(true);
    });

    it('sets isError and passes error if a query fails', () => {
      const testError = new Error('Network error loading offers');
      mockUseReceivedOffers.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: testError,
      });

      const { result } = renderTestHook();

      expect(result.current.isError).toBe(true);
      expect(result.current.error).toBe(testError);
    });
  });
});
