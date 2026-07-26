'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '../modules/identity/application/store/authStore';
import { ROUTES } from '../shared/constants/routes';

export default function Home() {
  const { status, user } = useAuthStore();

  const isGuest = status !== 'authenticated' || !user;
  const isClient = status === 'authenticated' && user?.role === 'CLIENT';
  const isTrainer = status === 'authenticated' && user?.role === 'TRAINER';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center space-y-6">
        {/* Welcome Headline */}
        {isGuest && (
          <>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              Welcome to <span className="text-blue-600">KIZUNAFIT</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              The ultimate fitness platform connecting clients with elite certified personal trainers. Achieve your goals with customized coaching.
            </p>
          </>
        )}

        {isClient && (
          <>
            <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
              Client Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Welcome back to KIZUNAFIT!
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
              Continue your fitness journey, track your body measurements, and find elite personal trainers.
            </p>
          </>
        )}

        {isTrainer && (
          <>
            <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
              Trainer Dashboard
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Welcome back, Coach!
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto">
              Manage your weekly availability schedule, upload verified certifications, and build your showcase portfolio.
            </p>
          </>
        )}

        {/* CTA Button Grid */}
        <div className="pt-6 flex flex-wrap gap-4 justify-center items-center">
          {isGuest && (
            <>
              <Link
                href={ROUTES.REGISTER}
                className="px-6 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
              >
                Get Started
              </Link>
              <Link
                href={ROUTES.PUBLIC_TRAINERS}
                className="px-6 py-3 text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md shadow-sm"
              >
                Find Trainers
              </Link>
              <Link
                href={`${ROUTES.REGISTER}?role=TRAINER`}
                className="px-6 py-3 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-md shadow-sm"
              >
                Become a Trainer
              </Link>
            </>
          )}

          {isClient && (
            <>
              <Link
                href={ROUTES.CLIENT_PROFILE}
                className="px-6 py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm"
              >
                My Profile
              </Link>
              <Link
                href={ROUTES.PUBLIC_TRAINERS}
                className="px-6 py-3 text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md shadow-sm"
              >
                Find Trainers
              </Link>
            </>
          )}

          {isTrainer && (
            <>
              <Link
                href={ROUTES.TRAINER_PROFILE}
                className="px-6 py-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm"
              >
                My Trainer Profile
              </Link>
              <Link
                href={ROUTES.TRAINER_AVAILABILITY}
                className="px-6 py-3 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-md shadow-sm"
              >
                Manage Availability
              </Link>
              <Link
                href={ROUTES.TRAINER_SHOWCASE}
                className="px-6 py-3 text-xs font-bold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md shadow-sm"
              >
                Showcase Portfolio
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
