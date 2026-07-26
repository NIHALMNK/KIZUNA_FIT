'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useGetPublicTrainerProfile } from '@/modules/profile/presentation/hooks/usePublicTrainers';
import { PageHeader } from '@/modules/profile/presentation/components/PageHeader';
import { SectionCard } from '@/modules/profile/presentation/components/SectionCard';
import { InfoCard } from '@/modules/profile/presentation/components/InfoCard';
import { LoadingState } from '@/modules/profile/presentation/components/LoadingState';
import { ErrorState } from '@/modules/profile/presentation/components/ErrorState';

export default function PublicTrainerDetailsPage() {
  const params = useParams();
  const trainerId = params?.id as string;

  const { data: trainer, isLoading, isError, error, refetch } = useGetPublicTrainerProfile(trainerId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <PageHeader title="Trainer Details" role="TRAINER" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <LoadingState message="Loading trainer details..." />
        </div>
      </div>
    );
  }

  if (isError || !trainer) {
    return (
      <div className="min-h-screen bg-gray-50 pb-12">
        <PageHeader title="Trainer Details" role="TRAINER" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ErrorState message={(error as any)?.message || 'Trainer profile not found'} onRetry={refetch} />
          <div className="text-center mt-4">
            <Link
              href="/trainers"
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-md"
            >
              ← Back to Trainers Directory
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <PageHeader
        title={trainer.headline}
        subtitle={`${trainer.location.city}, ${trainer.location.country} • ${trainer.yearsOfExperience} Years Experience`}
        role="TRAINER"
        action={
          <Link
            href="/trainers"
            className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            ← Back to Directory
          </Link>
        }
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header Profile Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
          {trainer.avatarUrl ? (
            <img
              src={trainer.avatarUrl}
              alt={trainer.headline}
              className="h-28 w-28 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="h-28 w-28 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-800 font-bold flex items-center justify-center text-2xl">
              {trainer.headline.slice(0, 2).toUpperCase()}
            </div>
          )}

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900">{trainer.headline}</h2>
            <p className="text-xs text-gray-500 mt-1">
              {trainer.location.city}, {trainer.location.state}, {trainer.location.country}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-xs">
              <span className="font-semibold text-amber-600">★ {trainer.averageRating.toFixed(1)} Rating</span>
              <span className="text-gray-500">{trainer.totalReviews} Reviews</span>
              <span className="px-2.5 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 rounded-full">
                Status: {trainer.availabilityStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Biography & Languages */}
        <SectionCard title="About the Coach">
          <div className="space-y-4">
            <p className="text-sm text-gray-800 whitespace-pre-line bg-gray-50 p-4 rounded border border-gray-100">
              {trainer.bio}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard label="Languages Spoken" value={trainer.languages.join(', ')} />
              <InfoCard label="Years of Experience" value={`${trainer.yearsOfExperience} Years`} />
            </div>

            <div>
              <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Specializations
              </span>
              <div className="flex flex-wrap gap-2">
                {trainer.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 rounded"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Verified Certifications */}
        <SectionCard title="Verified Certifications">
          {trainer.certifications.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No verified certifications listed.</p>
          ) : (
            <div className="space-y-2">
              {trainer.certifications.map((cert, i) => (
                <div key={i} className="bg-gray-50 p-3 rounded border border-gray-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-900">{cert.title}</h4>
                    <p className="text-[11px] text-gray-600">{cert.organization}</p>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-green-100 text-green-800 rounded">
                    Verified
                  </span>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Showcase Portfolio */}
        <SectionCard title="Showcase & Portfolio">
          {trainer.showcase.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No showcase items listed.</p>
          ) : (
            <div className="space-y-3">
              {trainer.showcase.map((item) => (
                <div key={item.showcaseId} className="bg-gray-50 p-4 rounded border border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-gray-900">{item.title}</h4>
                    <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 whitespace-pre-line mt-1">{item.description}</p>
                  {item.mediaUrl && (
                    <a
                      href={item.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 px-2.5 py-1 text-xs font-medium text-blue-600 bg-white border border-blue-200 rounded hover:bg-blue-50"
                    >
                      View Media Attachment →
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
