'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSearchTrainers } from '@/modules/profile/presentation/hooks/usePublicTrainers';
import { PageHeader } from '@/modules/profile/presentation/components/PageHeader';
import { LoadingState } from '@/shared/components/feedback/LoadingState';
import { ErrorState } from '@/shared/components/feedback/ErrorState';
import { EmptyState } from '@/shared/components/feedback/EmptyState';
import { SPECIALIZATION_OPTIONS, AVAILABILITY_STATUS_OPTIONS } from '@/modules/profile/presentation/constants/profile.constants';
import { TrainerSpecialization, TrainerAvailabilityStatus } from '@/modules/profile/domain/enums/profile.enums';
import { ROUTES } from '@/shared/constants/routes';
import { SearchTrainerParams } from '@/modules/profile/domain/types/profile.types';

export default function PublicTrainersSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL query parameters so refresh & link sharing preserve state
  const initialFilters: SearchTrainerParams = {
    search: searchParams.get('search') || undefined,
    specialization: (searchParams.get('specialization') as TrainerSpecialization) || undefined,
    availability: (searchParams.get('availability') as TrainerAvailabilityStatus) || undefined,
    minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
    verifiedOnly: searchParams.get('verifiedOnly') === 'true' ? true : undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'rating',
    sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: 10,
  };

  const [filters, setFilters] = useState<SearchTrainerParams>(initialFilters);
  const [searchInput, setSearchInput] = useState<string>(initialFilters.search || '');

  // 300ms Debounce effect for search keyword typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput || undefined, page: 1 }));
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Sync state changes to URL search params
  const syncUrlParams = useCallback(
    (updated: SearchTrainerParams) => {
      const params = new URLSearchParams();
      if (updated.search) params.set('search', updated.search);
      if (updated.specialization) params.set('specialization', updated.specialization);
      if (updated.availability) params.set('availability', updated.availability);
      if (updated.minRating) params.set('minRating', String(updated.minRating));
      if (updated.verifiedOnly) params.set('verifiedOnly', 'true');
      if (updated.sortBy) params.set('sortBy', updated.sortBy);
      if (updated.page && updated.page > 1) params.set('page', String(updated.page));

      const queryStr = params.toString();
      const url = queryStr ? `${ROUTES.PUBLIC_TRAINERS}?${queryStr}` : ROUTES.PUBLIC_TRAINERS;
      router.replace(url, { scroll: false });
    },
    [router],
  );

  useEffect(() => {
    syncUrlParams(filters);
  }, [filters, syncUrlParams]);

  // Data fetching hook using TanStack Query
  const { data, isLoading, isError, error, refetch } = useSearchTrainers(filters);

  const updateFilters = (newFields: Partial<SearchTrainerParams>) => {
    setFilters((prev) => ({ ...prev, ...newFields, page: newFields.page ?? 1 }));
  };

  const handleReset = () => {
    setSearchInput('');
    const resetValues: SearchTrainerParams = {
      search: undefined,
      specialization: undefined,
      availability: undefined,
      minRating: undefined,
      verifiedOnly: undefined,
      sortBy: 'rating',
      sortOrder: 'desc',
      page: 1,
      limit: 10,
    };
    setFilters(resetValues);
    router.replace(ROUTES.PUBLIC_TRAINERS);
  };

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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by trainer name, headline, or keyword..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
                Specialization
              </label>
              <select
                value={filters.specialization || ''}
                onChange={(e) => updateFilters({ specialization: (e.target.value as TrainerSpecialization) || undefined })}
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
                Availability Status
              </label>
              <select
                value={filters.availability || ''}
                onChange={(e) => updateFilters({ availability: (e.target.value as TrainerAvailabilityStatus) || undefined })}
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
                  checked={!!filters.verifiedOnly}
                  onChange={(e) => updateFilters({ verifiedOnly: e.target.checked ? true : undefined })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Verified Certifications Only</span>
              </label>

              <select
                value={filters.sortBy || 'rating'}
                onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
                className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-emerald-500"
              >
                <option value="rating">Sort by Rating</option>
                <option value="experience">Sort by Experience</option>
                <option value="newest">Sort by Newest</option>
              </select>
            </div>

            <button
              onClick={handleReset}
              className="text-xs font-semibold text-gray-500 hover:text-gray-700 underline"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Standardized Page Rendering Lifecycle: Loading -> Error -> Empty -> Success */}
        {isLoading && <LoadingState message="Searching for fitness trainers..." count={4} />}
        {isError && <ErrorState error={error} onRetry={refetch} />}

        {data && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Showing {data.data.length} of {data.total} Trainers Found
              </p>
            </div>

            {data.data.length === 0 ? (
              <EmptyState
                title="No trainers match your filters"
                description="Try broadening your search keywords or resetting your specialization filters."
                action={
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md"
                  >
                    Reset Search Filters
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
                        href={ROUTES.PUBLIC_TRAINER_DETAILS(trainer.userId)}
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
                  onClick={() => updateFilters({ page: data.page - 1 })}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-xs text-gray-600 font-medium">
                  Page {data.page} of {data.totalPages}
                </span>
                <button
                  disabled={data.page >= data.totalPages}
                  onClick={() => updateFilters({ page: data.page + 1 })}
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
