'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchTrainers } from '@/modules/profile/presentation/hooks/usePublicTrainers';
import { useProfileUiStore } from '@/modules/profile/presentation/store/profileUiStore';
import { PageHeader } from '@/modules/profile/presentation/components/PageHeader';
import { LoadingState } from '@/modules/profile/presentation/components/LoadingState';
import { ErrorState } from '@/modules/profile/presentation/components/ErrorState';
import { EmptyState } from '@/modules/profile/presentation/components/EmptyState';
import { SPECIALIZATION_OPTIONS, AVAILABILITY_STATUS_OPTIONS } from '@/modules/profile/presentation/constants/profile.constants';
import { TrainerSpecialization, TrainerAvailabilityStatus } from '@/modules/profile/domain/enums/profile.enums';

export default function PublicTrainersSearchPage() {
  const { searchFilters, setSearchFilters, resetSearchFilters } = useProfileUiStore();
  const { data, isLoading, isError, error, refetch } = useSearchTrainers(searchFilters);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <PageHeader
        title="Find a Certified Fitness Trainer"
        subtitle="Search top-rated fitness coaches, specialists, and personal trainers"
        role="TRAINER"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Search & Filter Control Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Search Keyword
              </label>
              <input
                type="text"
                value={searchFilters.search || ''}
                onChange={(e) => setSearchFilters({ search: e.target.value })}
                placeholder="Search by name, headline, or keyword..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Specialization
              </label>
              <select
                value={searchFilters.specialization || ''}
                onChange={(e) => setSearchFilters({ specialization: (e.target.value as TrainerSpecialization) || undefined })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">All Specializations</option>
                {SPECIALIZATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Availability
              </label>
              <select
                value={searchFilters.availability || ''}
                onChange={(e) => setSearchFilters({ availability: (e.target.value as TrainerAvailabilityStatus) || undefined })}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Any Status</option>
                {AVAILABILITY_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-4">
              <label className="flex items-center space-x-2 text-xs font-medium text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!searchFilters.verifiedOnly}
                  onChange={(e) => setSearchFilters({ verifiedOnly: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Verified Certifications Only</span>
              </label>

              <select
                value={searchFilters.sortBy || 'rating'}
                onChange={(e) => setSearchFilters({ sortBy: e.target.value as any })}
                className="px-2 py-1 text-xs border border-gray-300 rounded"
              >
                <option value="rating">Sort by Rating</option>
                <option value="experience">Sort by Experience</option>
                <option value="newest">Sort by Newest</option>
              </select>
            </div>

            <button
              onClick={resetSearchFilters}
              className="text-xs font-medium text-gray-500 hover:text-gray-700"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Results Section */}
        {isLoading && <LoadingState message="Searching for fitness trainers..." count={4} />}
        {isError && <ErrorState message={(error as any)?.message || 'Failed to fetch trainers list'} onRetry={refetch} />}

        {data && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Showing {data.data.length} of {data.total} Trainers
              </p>
            </div>

            {data.data.length === 0 ? (
              <EmptyState
                title="No Trainers Found"
                description="Try relaxing your search terms or filter preferences."
                action={
                  <button
                    onClick={resetSearchFilters}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md"
                  >
                    Clear Search Filters
                  </button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {data.data.map((trainer) => (
                  <div
                    key={trainer.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start gap-4 mb-4">
                        {trainer.avatarUrl ? (
                          <img
                            src={trainer.avatarUrl}
                            alt={trainer.headline}
                            className="h-16 w-16 rounded-full object-cover border border-gray-200"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold flex items-center justify-center text-lg">
                            {trainer.headline.slice(0, 2).toUpperCase()}
                          </div>
                        )}

                        <div className="flex-1">
                          <h3 className="text-base font-bold text-gray-900">{trainer.headline}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {trainer.location.city}, {trainer.location.country} • {trainer.yearsOfExperience} yrs exp
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs">
                            <span className="font-semibold text-amber-600">★ {trainer.averageRating.toFixed(1)}</span>
                            <span className="text-gray-400">({trainer.totalReviews} reviews)</span>
                            <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded">
                              {trainer.availabilityStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-3 mb-4">{trainer.bio}</p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {trainer.specializations.map((spec) => (
                          <span
                            key={spec}
                            className="px-2 py-0.5 text-[10px] font-medium bg-gray-100 text-gray-700 rounded border border-gray-200"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {trainer.certifications.length} Verified Certifications
                      </span>
                      <Link
                        href={`/trainers/${trainer.userId}`}
                        className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md"
                      >
                        View Full Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pt-6 border-t border-gray-200">
                <button
                  disabled={data.page <= 1}
                  onClick={() => setSearchFilters({ page: data.page - 1 })}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-600 font-medium">
                  Page {data.page} of {data.totalPages}
                </span>
                <button
                  disabled={data.page >= data.totalPages}
                  onClick={() => setSearchFilters({ page: data.page + 1 })}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
