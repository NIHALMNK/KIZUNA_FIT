'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSearchTrainers } from '@/modules/profile/presentation/hooks/usePublicTrainers';
import { SPECIALIZATION_OPTIONS, AVAILABILITY_STATUS_OPTIONS } from '@/modules/profile/presentation/constants/profile.constants';
import { TrainerSpecialization, TrainerAvailabilityStatus } from '@/modules/profile/domain/enums/profile.enums';
import { ROUTES } from '@/shared/constants/routes';
import { SearchTrainerParams } from '@/modules/profile/domain/types/profile.types';

// Register GSAP ScrollTrigger plugin on client side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PublicTrainersSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters from URL query parameters to preserve state on refresh & sharing
  const initialFilters: SearchTrainerParams = {
    search: searchParams.get('search') || undefined,
    specialization: (searchParams.get('specialization') as TrainerSpecialization) || undefined,
    availability: (searchParams.get('availability') as TrainerAvailabilityStatus) || undefined,
    minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined,
    verifiedOnly: searchParams.get('verifiedOnly') === 'true' ? true : undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'rating',
    sortOrder: (searchParams.get('sortOrder') as any) || 'desc',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: 9,
  };

  const [filters, setFilters] = useState<SearchTrainerParams>(initialFilters);
  const [searchInput, setSearchInput] = useState<string>(initialFilters.search || '');

  // 300ms Debounce effect for search input typing
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput || undefined, page: 1 }));
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Sync state changes to URL search parameters
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

  // Fetch trainers data using TanStack Query
  const { data, isLoading, isError, error, refetch } = useSearchTrainers(filters);

  const gridContainerRef = useRef<HTMLDivElement>(null);

  // GSAP animation on trainer cards data change
  useEffect(() => {
    if (typeof window === 'undefined' || !gridContainerRef.current) return;

    const cards = gridContainerRef.current.querySelectorAll('.gsap-trainer-card-item');
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 35, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power3.out',
        }
      );
    }
  }, [data]);

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
      limit: 9,
    };
    setFilters(resetValues);
    router.replace(ROUTES.PUBLIC_TRAINERS);
  };

  // Helper to remove active filter chips
  const removeFilterChip = (key: keyof SearchTrainerParams) => {
    if (key === 'search') {
      setSearchInput('');
      updateFilters({ search: undefined });
    } else {
      updateFilters({ [key]: undefined });
    }
  };

  // Check if any filters are active
  const hasActiveFilters = Boolean(
    filters.search || filters.specialization || filters.availability || filters.verifiedOnly || filters.minRating
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white font-sans antialiased overflow-x-hidden pb-24">
      {/* Background Ambient Lighting Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-cyan-500/10 rounded-full blur-[160px] opacity-60" />
        <div className="absolute top-[40%] -right-[15%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] opacity-40" />
        <div className="absolute top-[75%] -left-[15%] w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[180px] opacity-30" />
      </div>

      {/* Subtle Texture Grid Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)]" />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      {/* Hero Header */}
      <section className="relative z-10 pt-8 sm:pt-12 pb-8 px-6 sm:px-8 max-w-7xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-primary)] text-xs font-semibold uppercase tracking-wider mb-2">
          <span>Trainer Discovery</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--color-heading)] max-w-3xl mx-auto">
          Find Your Certified Coach
        </h1>

        <p className="text-sm sm:text-base text-[var(--color-text-secondary)] max-w-2xl mx-auto font-normal leading-relaxed">
          Browse verified personal trainers, review certifications and specializations, and start custom 1-on-1 coaching.
        </p>
      </section>

      {/* ========================================================================= */}
      {/* 2. SEARCH & FLOATING FILTER PANEL */}
      {/* ========================================================================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 mb-10">
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-2xl shadow-xl shadow-black/40 space-y-6">
          {/* Smart Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search trainers by name, specialty (e.g. Hypertrophy, Rehab), or keywords..."
              className="w-full pl-12 pr-10 py-3.5 bg-slate-950/80 text-white placeholder-slate-400 text-sm font-medium rounded-2xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all shadow-inner"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateFilters({ search: undefined });
                }}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition-colors"
                aria-label="Clear search keyword"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Filter Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Specialization Filter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Specialization
              </label>
              <select
                value={filters.specialization || ''}
                onChange={(e) => updateFilters({ specialization: (e.target.value as TrainerSpecialization) || undefined })}
                className="w-full px-3.5 py-2.5 bg-slate-950/80 text-slate-200 text-xs font-semibold rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer transition-all"
              >
                <option value="">All Specializations</option>
                {SPECIALIZATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Availability Status Filter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Availability
              </label>
              <select
                value={filters.availability || ''}
                onChange={(e) => updateFilters({ availability: (e.target.value as TrainerAvailabilityStatus) || undefined })}
                className="w-full px-3.5 py-2.5 bg-slate-950/80 text-slate-200 text-xs font-semibold rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer transition-all"
              >
                <option value="">Any Status</option>
                {AVAILABILITY_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Options */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Sort By
              </label>
              <select
                value={filters.sortBy || 'rating'}
                onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-slate-950/80 text-slate-200 text-xs font-semibold rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 cursor-pointer transition-all"
              >
                <option value="rating">Highest Rated</option>
                <option value="experience">Years of Experience</option>
                <option value="newest">Recently Joined</option>
              </select>
            </div>

            {/* Verified Certifications Checkbox */}
            <div className="space-y-1.5 flex flex-col justify-end">
              <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={!!filters.verifiedOnly}
                  onChange={(e) => updateFilters({ verifiedOnly: e.target.checked ? true : undefined })}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-950"
                />
                <span className="text-xs font-bold text-slate-200">Verified Certs Only</span>
              </label>
            </div>
          </div>

          {/* Active Filter Chips & Reset Row */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-slate-400">Active Filters:</span>

                {filters.search && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold">
                    <span>Search: "{filters.search}"</span>
                    <button
                      type="button"
                      onClick={() => removeFilterChip('search')}
                      className="hover:text-white transition-colors"
                      aria-label="Remove search filter"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {filters.specialization && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 font-semibold">
                    <span>Specialty: {filters.specialization}</span>
                    <button
                      type="button"
                      onClick={() => removeFilterChip('specialization')}
                      className="hover:text-white transition-colors"
                      aria-label="Remove specialization filter"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {filters.availability && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                    <span>Status: {filters.availability}</span>
                    <button
                      type="button"
                      onClick={() => removeFilterChip('availability')}
                      className="hover:text-white transition-colors"
                      aria-label="Remove availability filter"
                    >
                      ✕
                    </button>
                  </span>
                )}

                {filters.verifiedOnly && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold">
                    <span>Verified Only ✓</span>
                    <button
                      type="button"
                      onClick={() => removeFilterChip('verifiedOnly')}
                      className="hover:text-white transition-colors"
                      aria-label="Remove verified filter"
                    >
                      ✕
                    </button>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. MAIN MARKETPLACE CONTENT LIFECYCLE */}
      {/* ========================================================================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8">
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 animate-pulse space-y-4 h-72 flex flex-col justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-800/70 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-800 rounded w-full" />
                  <div className="h-3 bg-slate-800 rounded w-4/5" />
                </div>
                <div className="h-10 bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-rose-500/30 text-center max-w-md mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400 font-bold">
              ✕
            </div>
            <h3 className="text-lg font-bold text-white">Failed to Load Trainers</h3>
            <p className="text-xs text-slate-400">
              {error?.message || 'A network error occurred. Please check your connection and retry.'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
            >
              Retry Search
            </button>
          </div>
        )}

        {/* Results Container */}
        {data && (
          <>
            {/* Header Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Showing <span className="text-cyan-400 font-extrabold">{data.data.length}</span> of <span className="text-white font-extrabold">{data.total}</span> Certified Coaches
              </p>
            </div>

            {/* Empty Results State */}
            {data.data.length === 0 ? (
              <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800/80 text-center max-w-lg mx-auto space-y-5 backdrop-blur-xl">
                <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold text-white">No Trainers Match Your Search</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Try broadening your search keywords or clearing your active filters to discover certified fitness coaches.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Reset All Search Filters
                </button>
              </div>
            ) : (
              /* Trainer Cards 3-Column Responsive Grid */
              <div ref={gridContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {data.data.map((trainer) => {
                  const isAvailable = trainer.availabilityStatus === TrainerAvailabilityStatus.AVAILABLE;
                  const isBusy = trainer.availabilityStatus === TrainerAvailabilityStatus.BUSY;

                  return (
                    <div
                      key={trainer.id}
                      className="gsap-trainer-card-item p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl hover:border-cyan-500/40 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-cyan-950/30 hover:-translate-y-1.5 flex flex-col justify-between group"
                    >
                      <div className="space-y-4">
                        {/* Top Profile Header */}
                        <div className="flex items-start gap-4">
                          <div className="relative">
                            {trainer.avatarUrl ? (
                              <img
                                src={trainer.avatarUrl}
                                alt={trainer.headline}
                                className="w-14 h-14 rounded-2xl object-cover border border-slate-800 shrink-0"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shrink-0 shadow-md">
                                <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center font-extrabold text-white text-lg">
                                  {trainer.headline.slice(0, 2).toUpperCase()}
                                </div>
                              </div>
                            )}

                            {/* Status Indicator Pulse */}
                            <span
                              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                                isAvailable
                                  ? 'bg-emerald-400 animate-pulse'
                                  : isBusy
                                  ? 'bg-amber-400'
                                  : 'bg-slate-600'
                              }`}
                              title={`Status: ${trainer.availabilityStatus}`}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-extrabold text-white truncate group-hover:text-cyan-400 transition-colors">
                                {trainer.trainerName || trainer.fullName || 'Certified Personal Trainer'}
                              </h3>
                              <span
                                className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0"
                                title="Verified Certifications"
                              >
                                Verified ✓
                              </span>
                            </div>

                            <p className="text-xs font-bold text-cyan-400/90 truncate mt-0.5">
                              {trainer.headline}
                            </p>

                            <p className="text-[11px] text-slate-400 font-medium truncate mt-1">
                              {trainer.location.city}, {trainer.location.country} • {trainer.yearsOfExperience} yrs exp
                            </p>

                            <div className="flex items-center gap-2 mt-1.5 text-xs font-bold">
                              <span className="text-amber-400">★ {trainer.averageRating.toFixed(1)}</span>
                              <span className="text-slate-500 font-normal">({trainer.totalReviews} reviews)</span>
                            </div>
                          </div>
                        </div>

                        {/* Bio Excerpt */}
                        <p className="text-xs text-slate-300 font-medium line-clamp-2 leading-relaxed">
                          {trainer.bio}
                        </p>

                        {/* Specialization Pill Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {trainer.specializations.map((spec) => (
                            <span
                              key={spec}
                              className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 text-[11px] font-semibold border border-slate-800/80"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Action Footer */}
                      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between mt-5">
                        <div className="text-xs text-slate-400 font-medium">
                          <span className="text-cyan-400 font-bold">{trainer.certifications.length}</span> Verified Certs
                        </div>
                        <Link
                          href={ROUTES.PUBLIC_TRAINER_DETAILS(trainer.userId)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-950/40 hover:shadow-lg transition-all"
                        >
                          <span>View Profile</span>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination Bar */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-8 border-t border-slate-900">
                <button
                  disabled={data.page <= 1}
                  onClick={() => updateFilters({ page: data.page - 1 })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Previous
                </button>
                <span className="text-xs text-slate-400 font-semibold">
                  Page <span className="text-white font-extrabold">{data.page}</span> of{' '}
                  <span className="text-white font-extrabold">{data.totalPages}</span>
                </span>
                <button
                  disabled={data.page >= data.totalPages}
                  onClick={() => updateFilters({ page: data.page + 1 })}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
