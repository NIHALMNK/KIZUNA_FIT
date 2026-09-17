'use client';

import React from 'react';
import { useClientAcquisitionJourney } from '../../application/hooks/useClientAcquisitionJourney';
import { JourneyStage } from '../../domain/types/journey.types';
import { JourneyProgressBar } from './JourneyProgressBar';
import { Stage1Discovery } from './Stage1Discovery';
import { Stage2TrainerSelected } from './Stage2TrainerSelected';
import { Stage3RequestPending } from './Stage3RequestPending';
import { Stage4Consultation } from './Stage4Consultation';
import { Stage5Offer } from './Stage5Offer';
import { Stage6MyTrainer } from './Stage6MyTrainer';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export const FindMyTrainerWorkspace: React.FC = () => {
  const {
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
  } = useClientAcquisitionJourney();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Skeleton Progress Bar */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 animate-pulse space-y-4">
          <div className="h-4 bg-[var(--color-surface-alt)] rounded w-1/4" />
          <div className="h-10 bg-[var(--color-surface-alt)] rounded-xl" />
        </div>

        {/* Skeleton Body */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-8 animate-pulse text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--color-primary)]" />
          <p className="text-xs sm:text-sm font-bold text-[var(--color-text-secondary)]">
            Resolving your coaching journey status...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[var(--color-surface)] border border-red-200 rounded-2xl p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[var(--color-heading)]">
            Failed to Synchronize Journey
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] max-w-md mx-auto">
            {error?.message || 'Unable to fetch your latest coaching acquisition records.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetchAll()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[var(--color-primary)] text-white hover:opacity-95 shadow-xs transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dynamic Journey Progress Bar */}
      <JourneyProgressBar currentStage={currentStage} />

      {/* Dynamic Stage Component Rendering */}
      {currentStage === JourneyStage.STAGE_1_DISCOVERY && (
        <Stage1Discovery onSelectTrainer={(trainer) => setSelectedTrainer(trainer)} />
      )}

      {currentStage === JourneyStage.STAGE_2_TRAINER_SELECTED && selectedTrainer && (
        <Stage2TrainerSelected trainer={selectedTrainer} onBack={() => setSelectedTrainer(null)} />
      )}

      {currentStage === JourneyStage.STAGE_3_REQUEST_PENDING && activeRequest && (
        <Stage3RequestPending request={activeRequest} />
      )}

      {currentStage === JourneyStage.STAGE_4_CONSULTATION && activeConsultation && (
        <Stage4Consultation consultation={activeConsultation} />
      )}

      {currentStage === JourneyStage.STAGE_5_OFFER && activeOffer && (
        <Stage5Offer offer={activeOffer} />
      )}

      {currentStage === JourneyStage.STAGE_6_MY_TRAINER && activeCoaching && (
        <Stage6MyTrainer coaching={activeCoaching} />
      )}
    </div>
  );
};
