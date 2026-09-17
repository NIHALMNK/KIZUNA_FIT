'use client';

import React from 'react';
import { JourneyStage } from '../../domain/types/journey.types';
import { UserCheck, Send, Calendar, Tag, Trophy, Check } from 'lucide-react';

interface JourneyProgressBarProps {
  currentStage: JourneyStage;
}

interface StepItem {
  id: string;
  stage: JourneyStage;
  stageNumber: number;
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepItem[] = [
  {
    id: 'trainer-selected',
    stage: JourneyStage.STAGE_2_TRAINER_SELECTED,
    stageNumber: 2,
    label: 'Trainer Selected',
    sublabel: 'Profile & Proposal',
    icon: UserCheck,
  },
  {
    id: 'request-sent',
    stage: JourneyStage.STAGE_3_REQUEST_PENDING,
    stageNumber: 3,
    label: 'Request Sent',
    sublabel: 'Review Pending',
    icon: Send,
  },
  {
    id: 'consultation',
    stage: JourneyStage.STAGE_4_CONSULTATION,
    stageNumber: 4,
    label: 'Consultation',
    sublabel: 'Video Intake Call',
    icon: Calendar,
  },
  {
    id: 'coaching-offer',
    stage: JourneyStage.STAGE_5_OFFER,
    stageNumber: 5,
    label: 'Coaching Offer',
    sublabel: 'Plan & Payment',
    icon: Tag,
  },
  {
    id: 'active-coaching',
    stage: JourneyStage.STAGE_6_MY_TRAINER,
    stageNumber: 6,
    label: 'Coaching',
    sublabel: 'Active Relationship',
    icon: Trophy,
  },
];

const STAGE_NUM_MAP: Record<JourneyStage, number> = {
  [JourneyStage.STAGE_1_DISCOVERY]: 1,
  [JourneyStage.STAGE_2_TRAINER_SELECTED]: 2,
  [JourneyStage.STAGE_3_REQUEST_PENDING]: 3,
  [JourneyStage.STAGE_4_CONSULTATION]: 4,
  [JourneyStage.STAGE_5_OFFER]: 5,
  [JourneyStage.STAGE_6_MY_TRAINER]: 6,
};

export const JourneyProgressBar: React.FC<JourneyProgressBarProps> = ({ currentStage }) => {
  const currentStageNum = STAGE_NUM_MAP[currentStage];

  return (
    <div className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-4 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
            Coaching Journey
          </span>
          <h2 className="text-sm sm:text-base font-extrabold text-[var(--color-heading)]">
            {currentStage === JourneyStage.STAGE_1_DISCOVERY && 'Phase 1: Discover & Choose Coach'}
            {currentStage === JourneyStage.STAGE_2_TRAINER_SELECTED && 'Phase 2: Submit Proposal'}
            {currentStage === JourneyStage.STAGE_3_REQUEST_PENDING &&
              'Phase 3: Coach Reviewing Request'}
            {currentStage === JourneyStage.STAGE_4_CONSULTATION && 'Phase 4: 1-on-1 Consultation'}
            {currentStage === JourneyStage.STAGE_5_OFFER && 'Phase 5: Coaching Offer & Enrollment'}
            {currentStage === JourneyStage.STAGE_6_MY_TRAINER &&
              'Phase 6: Active Coaching Contract'}
          </h2>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-[var(--color-surface-alt)] text-[var(--color-primary)] border border-[var(--color-border)]">
            Stage {currentStageNum} of 6
          </span>
        </div>
      </div>

      {/* Steps Track */}
      <div className="relative">
        <div className="grid grid-cols-5 gap-2 sm:gap-4 relative z-10">
          {STEPS.map((step, idx) => {
            const isCompleted = currentStageNum > step.stageNumber;
            const isCurrent = currentStageNum === step.stageNumber;
            const isUpcoming = currentStageNum < step.stageNumber;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center text-center group">
                <div
                  className={`relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full transition-all duration-300 font-bold text-xs ${
                    isCompleted
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : isCurrent
                        ? 'bg-[var(--color-surface)] border-2 border-[var(--color-primary)] text-[var(--color-primary)] shadow-md ring-4 ring-[var(--color-primary)]/10'
                        : 'bg-[var(--color-surface-alt)] border border-[var(--color-border)] text-[var(--color-text-muted)]'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                  ) : (
                    <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  )}
                </div>

                <div className="mt-2 hidden sm:block">
                  <span
                    className={`block text-xs font-bold leading-tight ${
                      isCurrent
                        ? 'text-[var(--color-primary)]'
                        : isCompleted
                          ? 'text-[var(--color-heading)]'
                          : 'text-[var(--color-text-muted)]'
                    }`}
                  >
                    {step.label}
                  </span>
                  <span className="text-[10px] text-[var(--color-text-muted)] hidden md:block">
                    {step.sublabel}
                  </span>
                </div>

                {/* Mobile compact label */}
                <div className="mt-1.5 sm:hidden">
                  <span
                    className={`block text-[10px] font-bold truncate max-w-[54px] ${
                      isCurrent
                        ? 'text-[var(--color-primary)] font-extrabold'
                        : isCompleted
                          ? 'text-[var(--color-heading)]'
                          : 'text-[var(--color-text-muted)]'
                    }`}
                  >
                    {step.label.split(' ')[0]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Background Line Connector */}
        <div className="absolute top-4 sm:top-5 left-[10%] right-[10%] h-0.5 bg-[var(--color-border)] z-0 -translate-y-1/2">
          <div
            className="h-full bg-[var(--color-primary)] transition-all duration-500 ease-out"
            style={{
              width: `${
                currentStageNum <= 1 ? 0 : Math.min(100, ((currentStageNum - 2) / 4) * 100)
              }%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
