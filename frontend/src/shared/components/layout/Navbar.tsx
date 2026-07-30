'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '../../../modules/identity/application/store/authStore';
import { useLogout } from '../../../modules/identity/application/hooks/useLogout';
import { ROUTES } from '../../constants/routes';

export const Navbar = () => {
  const pathname = usePathname();
  const { status, user } = useAuthStore();
  const logoutMutation = useLogout();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Track window scroll position to dynamically trigger shrink & blur effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide global navbar on authentication pages for distraction-free viewport
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname === '/verify-email';

  if (isAuthPage) {
    return null;
  }

  const role = status === 'authenticated' && user?.role ? (user.role as 'CLIENT' | 'TRAINER' | 'ADMIN') : 'guest';

  const roleBadgeStyle =
    role === 'TRAINER'
      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
      : role === 'CLIENT'
      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
      : 'bg-slate-800 text-slate-300';

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Find Trainers', href: '/trainers' },
    { label: 'About', href: '/#features' },
    { label: 'Pricing', href: '/#pricing' },
    { label: 'Contact', href: '/#footer' },
  ];

  return (
    <header className="fixed top-4 sm:top-5 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-6xl z-50 transition-all duration-300">
      <nav
        className={`w-full px-5 sm:px-8 flex items-center justify-between rounded-full border transition-all duration-300 ${
          isScrolled
            ? 'py-2.5 bg-slate-950/85 backdrop-blur-2xl border-slate-800/90 shadow-2xl shadow-black/60'
            : 'py-3.5 bg-slate-900/60 backdrop-blur-xl border-slate-800/80 shadow-xl shadow-black/40'
        }`}
      >
        {/* Brand Logo Anchor */}
        <Link href={ROUTES.HOME} className="flex items-center gap-3 group focus:outline-none rounded-full p-0.5 shrink-0">
          <div className="relative h-8 sm:h-9 w-auto flex items-center shrink-0">
            <Image
              src="/assets/KIZUNA-FIT.png"
              alt="KIZUNAFIT Platform"
              width={36}
              height={36}
              priority
              className="h-full w-auto object-contain drop-shadow-[0_2px_10px_rgba(6,182,212,0.3)]"
            />
          </div>
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
            KIZUNA-FIT
          </span>
          {status === 'authenticated' && user?.role && (
            <span className={`hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full tracking-wider ${roleBadgeStyle}`}>
              {user.role}
            </span>
          )}
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className="relative group text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors py-1"
              >
                <span>{link.label}</span>
                <span
                  className={`absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-cyan-400 to-teal-400 transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          {status !== 'authenticated' ? (
            <>
              <Link
                href={ROUTES.LOGIN}
                className="px-4 py-2 text-xs font-bold text-slate-200 hover:text-white bg-slate-800/60 hover:bg-slate-800/90 border border-slate-700/60 hover:border-cyan-500/40 rounded-full backdrop-blur-md transition-all duration-200"
              >
                Login
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-full shadow-md shadow-cyan-950/40 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
              >
                Get Started
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href={user?.role === 'TRAINER' ? ROUTES.TRAINER_PROFILE : ROUTES.CLIENT_PROFILE}
                className="px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-bold hover:bg-cyan-500/20 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="px-3.5 py-2 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors disabled:opacity-50"
              >
                {logoutMutation.isPending ? 'Logging out...' : 'Sign Out'}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-full bg-slate-800/80 text-slate-200 hover:text-white border border-slate-700/60 transition-colors focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Animated Glass Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-3 p-6 rounded-3xl bg-slate-950/95 backdrop-blur-2xl border border-slate-800/90 shadow-2xl space-y-4 text-center animate-in fade-in-0 slide-in-from-top-3 duration-300">
          <div className="flex flex-col gap-3 font-semibold text-slate-300 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 hover:text-cyan-400 transition-colors border-b border-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {status !== 'authenticated' ? (
            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href={ROUTES.LOGIN}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 text-xs font-bold text-slate-200 bg-slate-900 border border-slate-800 rounded-xl"
              >
                Login
              </Link>
              <Link
                href={ROUTES.REGISTER}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 rounded-xl shadow-md"
              >
                Get Started
              </Link>
            </div>
          ) : (
            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                href={user?.role === 'TRAINER' ? ROUTES.TRAINER_PROFILE : ROUTES.CLIENT_PROFILE}
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-xl"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logoutMutation.mutate();
                }}
                className="w-full py-2 text-xs font-semibold text-rose-400"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
