'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  JourneyStage,
  SelectedTrainerInfo,
  ClientAcquisitionJourneyState,
} from '../../domain/types/journey.types';
import { useActiveCoachingRelationship } from '../../../coaching/application/queries/useActiveCoachingRelationship';
import { CoachingRelationshipStatus } from '../../../coaching/domain/types/coaching.types';
import { useReceivedOffers } from '../../../offer/application/hooks/useOffers';
import { CoachingOfferStatus } from '../../../offer/domain/types/offer.types';
import { useUpcomingConsultations } from '../../../consultation/application/hooks/useConsultationQueries';
import { ConsultationStatus } from '../../../consultation/domain/types/consultation.types';
import { useGetTrainerRequests } from '../../../marketplace/application/useMarketplace';
import { TrainerRequestStatus } from '../../../marketplace/domain/types';

export function useClientAcquisitionJourney(
  initialSelectedTrainer: SelectedTrainerInfo | null = null,
): ClientAcquisitionJourneyState {
  const [selectedTrainer, setSelectedTrainer] = useState<SelectedTrainerInfo | null>(
    initialSelectedTrainer,
  );

  // Domain Queries
  const coachingQuery = useActiveCoachingRelationship();
  const offerQuery = useReceivedOffers();
  const consultationQuery = useUpcomingConsultations();
  const requestQuery = useGetTrainerRequests();

  const isLoading =
    coachingQuery.isLoading ||
    offerQuery.isLoading ||
    consultationQuery.isLoading ||
    requestQuery.isLoading;

  const isError =
    coachingQuery.isError ||
    offerQuery.isError ||
    consultationQuery.isError ||
    requestQuery.isError;

  const error =
    (coachingQuery.error as Error) ||
    (offerQuery.error as Error) ||
    (consultationQuery.error as Error) ||
    (requestQuery.error as Error) ||
    null;

  // 1. Active Coaching Relationship
  const activeCoaching = useMemo(() => {
    const rawCoaching = coachingQuery.data;
    const relationships: any[] = Array.isArray(rawCoaching)
      ? rawCoaching
      : Array.isArray((rawCoaching as any)?.relationships)
        ? (rawCoaching as any).relationships
        : rawCoaching &&
            typeof rawCoaching === 'object' &&
            ('relationshipId' in rawCoaching || 'id' in rawCoaching)
          ? [rawCoaching]
          : [];
    return (
      relationships.find(
        (rel) => rel?.status === CoachingRelationshipStatus.ACTIVE || rel?.status === 'ACTIVE',
      ) || null
    );
  }, [coachingQuery.data]);

  // 2. Active / Sent Coaching Offer
  const activeOffer = useMemo(() => {
    const rawOffers = offerQuery.data;
    const offers: any[] = Array.isArray(rawOffers)
      ? rawOffers
      : Array.isArray((rawOffers as any)?.offers)
        ? (rawOffers as any).offers
        : [];
    return (
      offers.find(
        (o) =>
          o?.status === CoachingOfferStatus.SENT ||
          o?.status === CoachingOfferStatus.ACCEPTED ||
          o?.status === 'SENT' ||
          o?.status === 'ACCEPTED',
      ) || null
    );
  }, [offerQuery.data]);

  // 3. Upcoming / Active Consultation
  const activeConsultation = useMemo(() => {
    const rawConsultations = consultationQuery.data;
    const consultations: any[] = Array.isArray(rawConsultations)
      ? rawConsultations
      : Array.isArray((rawConsultations as any)?.consultations)
        ? (rawConsultations as any).consultations
        : [];
    return (
      consultations.find(
        (c) =>
          c?.status === ConsultationStatus.SCHEDULED ||
          c?.status === ConsultationStatus.SLOT_BOOKED ||
          c?.status === ConsultationStatus.CREATED ||
          c?.status === 'SCHEDULED' ||
          c?.status === 'SLOT_BOOKED' ||
          c?.status === 'CREATED',
      ) || null
    );
  }, [consultationQuery.data]);

  // 4. Pending / Accepted Trainer Request
  const activeRequest = useMemo(() => {
    const rawRequests = requestQuery.data;
    const requests: any[] = Array.isArray(rawRequests)
      ? rawRequests
      : Array.isArray((rawRequests as any)?.requests)
        ? (rawRequests as any).requests
        : [];
    return (
      requests.find((r) => {
        const rawStatus = (r?.requestStatus || r?.status || '').toUpperCase();
        return (
          rawStatus === TrainerRequestStatus.REQUEST_PENDING ||
          rawStatus === TrainerRequestStatus.PENDING ||
          rawStatus === TrainerRequestStatus.REQUEST_ACCEPTED ||
          rawStatus === TrainerRequestStatus.ACCEPTED
        );
      }) || null
    );
  }, [requestQuery.data]);

  // Derived Journey Stage by strict precedence rule
  const currentStage: JourneyStage = useMemo(() => {
    // Stage 6: Active Coaching Relationship (Highest Priority)
    if (activeCoaching) {
      return JourneyStage.STAGE_6_MY_TRAINER;
    }

    // Stage 5: Received Offer requiring action / ready for payment
    if (activeOffer) {
      return JourneyStage.STAGE_5_OFFER;
    }

    // Stage 4: Consultation session in progress, scheduled, or booking required
    if (activeConsultation) {
      return JourneyStage.STAGE_4_CONSULTATION;
    }

    // Request Stage check:
    if (activeRequest) {
      const rawStatus = (activeRequest.requestStatus || activeRequest.status || '').toUpperCase();
      // If coach accepted request, transition immediately to Consultation (Section 10 & 13)
      if (
        rawStatus === TrainerRequestStatus.REQUEST_ACCEPTED ||
        rawStatus === TrainerRequestStatus.ACCEPTED
      ) {
        return JourneyStage.STAGE_4_CONSULTATION;
      }
      return JourneyStage.STAGE_3_REQUEST_PENDING;
    }

    // Stage 2: Trainer selected locally (UI draft state)
    if (selectedTrainer) {
      return JourneyStage.STAGE_2_TRAINER_SELECTED;
    }

    // Stage 1: Coach Discovery
    return JourneyStage.STAGE_1_DISCOVERY;
  }, [activeCoaching, activeOffer, activeConsultation, activeRequest, selectedTrainer]);

  const refetchAll = useCallback(async () => {
    await Promise.all([
      coachingQuery.refetch(),
      offerQuery.refetch(),
      consultationQuery.refetch(),
      requestQuery.refetch(),
    ]);
  }, [coachingQuery, offerQuery, consultationQuery, requestQuery]);

  return {
    currentStage,
    isLoading,
    isError,
    error,
    selectedTrainer,
    setSelectedTrainer,
    activeCoaching,
    activeOffer,
    activeConsultation,
    activeRequest,
    refetchAll,
  };
}
