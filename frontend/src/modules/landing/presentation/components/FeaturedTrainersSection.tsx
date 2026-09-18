'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchTrainers } from '@/modules/profile/presentation/hooks/usePublicTrainers';
import { PUBLIC_ROUTES } from '../../../../shared/constants/routes/public.routes';
import { Section } from '../../../../shared/sections/Section';
import { StaggerContainer } from '../../../../shared/motion/StaggerContainer';
import { SlideUp } from '../../../../shared/motion/SlideUp';
import { Avatar } from '../../../../shared/components/ui/Avatar';
import { Badge } from '../../../../shared/components/ui/Badge';
import { StatusBadge } from '../../../../shared/components/ui/StatusBadge';
import { Button } from '../../../../shared/components/ui/Button';
import { LoadingState } from '../../../../shared/components/feedback/LoadingState';
import { ArrowRight, Star } from 'lucide-react';

export const FeaturedTrainersSection: React.FC = () => {
  const { data, isLoading } = useSearchTrainers({ page: 1, limit: 3 });

  const trainers = data?.data || [];

  return (
    <Section id="trainers">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">Trainer Discovery</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-heading)]">
            Explore Certified Trainers
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] max-w-xl">
            Browse verified personal trainers, review credentials, and find the right coach for your goals.
          </p>
        </div>

        <Link href={PUBLIC_ROUTES.FIND_TRAINERS}>
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="h-4 w-4 text-[var(--color-primary)]" />}>
            View All Trainers
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <LoadingState message="Loading certified trainers..." count={3} />
      ) : trainers.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-[var(--color-border)] rounded-xl">
          <p className="text-sm text-[var(--color-text-secondary)]">No trainers available right now.</p>
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trainers.map((trainer) => (
            <SlideUp key={trainer.id}>
              <div className="p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-all duration-200 flex flex-col justify-between h-full shadow-sm space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5">
                    <Avatar
                      src={trainer.avatarUrl || undefined}
                      fallback={trainer.fullName?.slice(0, 2) || 'TR'}
                      size="lg"
                    />
                    <div>
                      <h3 className="text-base font-bold text-[var(--color-heading)]">{trainer.fullName}</h3>
                      <p className="text-xs text-[var(--color-text-secondary)] font-medium line-clamp-1">{trainer.headline || 'Fitness Coach'}</p>
                      <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span>{trainer.averageRating?.toFixed(1) || 'N/A'}</span>
                        <span className="text-[var(--color-text-muted)] font-normal">({trainer.totalReviews || 0} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {trainer.specializations?.slice(0, 3).map((spec) => (
                      <Badge key={spec} variant="default" className="text-[10px]">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                  <StatusBadge status={trainer.availabilityStatus === 'AVAILABLE' ? 'active' : 'suspended'} label={trainer.availabilityStatus} />
                  <Link href={PUBLIC_ROUTES.TRAINER_PROFILE(trainer.id)}>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </div>
            </SlideUp>
          ))}
        </StaggerContainer>
      )}
    </Section>
  );
};

