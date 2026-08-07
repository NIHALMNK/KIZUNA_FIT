'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../../modules/identity/application/store/authStore';
import { IdentityControls } from '../../../modules/identity/presentation/components/IdentityControls';
import { PUBLIC_ROUTES } from '../../../shared/constants/routes/public.routes';

export default function ClientDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-extrabold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>KIZUNAFIT CLIENT PORTAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Track active requests, schedule consultations, and manage your 1-on-1 coaching journey.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={PUBLIC_ROUTES.FIND_TRAINERS}
            className="px-5 py-2.5 text-xs font-extrabold text-white btn-public-primary rounded-2xl shadow-lg shadow-cyan-950/40"
          >
            Find Trainers
          </Link>
          <Link
            href="/client/settings/change-password"
            className="px-4 py-2.5 text-xs font-extrabold text-slate-300 hover:text-white bg-slate-800/80 border border-slate-700/60 rounded-2xl transition-colors"
          >
            Change Password
          </Link>
        </div>
      </div>

      {/* Identity & Session Control Debug Section */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-4">
        <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
          Session & Account Management
        </h3>
        <IdentityControls />
      </div>
    </div>
  );
}
