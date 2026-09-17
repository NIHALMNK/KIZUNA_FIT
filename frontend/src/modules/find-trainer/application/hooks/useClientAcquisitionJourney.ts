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
    const relationships = coachingQuery.data || [];
    return relationships.find((rel) => rel.status === CoachingRelationshipStatus.ACTIVE) || null;
  }, [coachingQuery.data]);

  // 2. Active / Sent Coaching Offer
  const activeOffer = useMemo(() => {
    const offers = offerQuery.data?.offers || [];
    return (
      offers.find(
        (o) => o.status === CoachingOfferStatus.SENT || o.status === CoachingOfferStatus.ACCEPTED,
      ) || null
    );
  }, [offerQuery.data?.offers]);

  // 3. Upcoming / Active Consultation
  const activeConsultation = useMemo(() => {
    const consultations = consultationQuery.data?.consultations || [];
    return (
      consultations.find(
        (c) =>
          c.status === ConsultationStatus.SCHEDULED ||
          c.status === ConsultationStatus.SLOT_BOOKED ||
          c.status === ConsultationStatus.CREATED,
      ) || null
    );
  }, [consultationQuery.data?.consultations]);

  // 4. Pending / Accepted Trainer Request
  const activeRequest = useMemo(() => {
    const requests = requestQuery.data?.requests || [];
    return (
      requests.find((r) => {
        const rawStatus = (r.requestStatus || r.status || '').toUpperCase();
        return (
          rawStatus === TrainerRequestStatus.REQUEST_PENDING ||
          rawStatus === TrainerRequestStatus.PENDING ||
          rawStatus === TrainerRequestStatus.REQUEST_ACCEPTED ||
          rawStatus === TrainerRequestStatus.ACCEPTED
        );
      }) || null
    );
  }, [requestQuery.data?.requests]);

  // Derived Journey Stage by strict precedence rule
  const currentStage: JourneyStage = useMemo(() => {
    if (activeCoaching) {
      return JourneyStage.STAGE_6_MY_TRAINER;
    }
    if (activeOffer) {
      return JourneyStage.STAGE_5_OFFER;
    }
    if (activeConsultation) {
      return JourneyStage.STAGE_4_CONSULTATION;
    }
    if (activeRequest) {
      return JourneyStage.STAGE_3_REQUEST_PENDING;
    }
    if (selectedTrainer) {
      return JourneyStage.STAGE_2_TRAINER_SELECTED;
    }
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
