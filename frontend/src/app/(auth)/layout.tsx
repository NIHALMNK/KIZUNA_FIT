import React from 'react';
import { GuestGuard } from '../../shared/components/guards/GuestGuard';
import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuestGuard>
      <div className="theme-public min-h-screen relative flex flex-col items-center justify-center bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white overflow-y-auto font-sans antialiased py-12">
        {/* Ambient Dark Background Layer 1: Soft Radial Light Orbs */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute -top-[25%] left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-cyan-500/10 rounded-full blur-[160px] opacity-60" />
          <div className="absolute top-[45%] -left-[10%] w-[500px] h-[500px] bg-slate-800/20 rounded-full blur-[140px] opacity-40" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] opacity-50" />
        </div>

        {/* Ambient Layer 2: Subtle Architectural Grid Texture */}
        <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]" />

        {/* Minimal Floating Header */}
        <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-5xl z-50 px-6 py-3.5 bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 rounded-full shadow-lg shadow-black/30 flex items-center justify-between transition-all duration-300">
          {/* Left Side: Logo & Brand Name */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-cyan-500/50 rounded-full p-1 transition-transform hover:opacity-95"
          >
            <div className="relative h-7 sm:h-8 w-auto flex items-center shrink-0">
              <Image
                src="/assets/KIZUNA-FIT.png"
                alt="KIZUNAFIT Logo"
                width={32}
                height={32}
                priority
                className="h-full w-auto object-contain drop-shadow-[0_2px_8px_rgba(6,182,212,0.3)]"
              />
            </div>
            <span className="text-sm sm:text-base font-semibold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              KIZUNA-FIT
            </span>
          </Link>

          {/* Right Side: Single CTA Button - Find Trainers */}
          <Link
            href="/trainers"
            className="group inline-flex items-center gap-2 px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/60 hover:border-cyan-500/40 rounded-full backdrop-blur-md shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/60"
          >
            <span>Find Trainers</span>
            <svg
              className="w-3.5 h-3.5 text-cyan-400 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </header>

        {/* Full Screen Centered Authentication Viewport */}
        <main className="relative z-10 w-full flex flex-1 items-center justify-center px-4 pt-16 pb-6 overflow-y-auto">
          <div className="w-full max-w-md animate-in fade-in-0 slide-in-from-bottom-4 duration-500 fill-mode-forwards my-auto">
            {children}
          </div>
        </main>
      </div>
    </GuestGuard>
  );
}
