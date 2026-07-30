'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuthStore } from '../modules/identity/application/store/authStore';
import { ROUTES } from '../shared/constants/routes';

// Register GSAP ScrollTrigger plugin on client-side
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Home() {
  const { status, user } = useAuthStore();
  const [activeFeatureTab, setActiveFeatureTab] = useState<'workout' | 'nutrition' | 'analytics'>('workout');

  const isAuthenticated = status === 'authenticated' && Boolean(user);
  const isTrainer = user?.role === 'TRAINER';

  // Section Refs for GSAP ScrollTrigger targeting
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const whyRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const marketplaceRef = useRef<HTMLDivElement>(null);
  const telemetryRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Enable GSAP animations only in browser environment
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // 1. Hero Section Staggered Entrance
      if (heroRef.current) {
        const heroElements = heroRef.current.querySelectorAll('.gsap-hero-anim');
        gsap.fromTo(
          heroElements,
          { opacity: 0, y: 40, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            delay: 0.1,
          }
        );

        // Hero Parallax Mockup 3D Tilt on Scroll
        const mockup = heroRef.current.querySelector('.gsap-hero-mockup');
        if (mockup) {
          gsap.to(mockup, {
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
            },
            y: 60,
            rotationX: 5,
            scale: 0.98,
            ease: 'none',
          });
        }
      }

      // 2. Statistics Bar Scroll Animation
      if (statsRef.current) {
        const statCards = statsRef.current.querySelectorAll('.gsap-stat-card');
        gsap.fromTo(
          statCards,
          { opacity: 0, y: 30, scale: 0.9 },
          {
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: 'back.out(1.4)',
          }
        );
      }

      // 3. Why KIZUNAFIT Problem vs Solution Slide-In
      if (whyRef.current) {
        const oldWay = whyRef.current.querySelector('.gsap-why-old');
        const newWay = whyRef.current.querySelector('.gsap-why-new');

        if (oldWay) {
          gsap.fromTo(
            oldWay,
            { opacity: 0, x: -50 },
            {
              scrollTrigger: {
                trigger: whyRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
              opacity: 1,
              x: 0,
              duration: 0.9,
              ease: 'power3.out',
            }
          );
        }

        if (newWay) {
          gsap.fromTo(
            newWay,
            { opacity: 0, x: 50 },
            {
              scrollTrigger: {
                trigger: whyRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
              opacity: 1,
              x: 0,
              duration: 0.9,
              delay: 0.15,
              ease: 'power3.out',
            }
          );
        }
      }

      // 4. Platform Features Cascade Grid
      if (featuresRef.current) {
        const featureCards = featuresRef.current.querySelectorAll('.gsap-feature-card');
        gsap.fromTo(
          featureCards,
          { opacity: 0, y: 45, scale: 0.94 },
          {
            scrollTrigger: {
              trigger: featuresRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
          }
        );
      }

      // 5. How It Works Sequential Timeline
      if (howItWorksRef.current) {
        const stepCards = howItWorksRef.current.querySelectorAll('.gsap-step-card');
        gsap.fromTo(
          stepCards,
          { opacity: 0, y: 35, scale: 0.92 },
          {
            scrollTrigger: {
              trigger: howItWorksRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: 'back.out(1.2)',
          }
        );
      }

      // 6. Marketplace Trainer Cards Reveal
      if (marketplaceRef.current) {
        const trainerCards = marketplaceRef.current.querySelectorAll('.gsap-trainer-card');
        gsap.fromTo(
          trainerCards,
          { opacity: 0, y: 40, rotationY: 8 },
          {
            scrollTrigger: {
              trigger: marketplaceRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
            opacity: 1,
            y: 0,
            rotationY: 0,
            duration: 0.85,
            stagger: 0.14,
            ease: 'power3.out',
          }
        );
      }

      // 7. Telemetry Interactive Dashboard Fade-In
      if (telemetryRef.current) {
        const card = telemetryRef.current.querySelector('.gsap-telemetry-card');
        if (card) {
          gsap.fromTo(
            card,
            { opacity: 0, y: 50, scale: 0.95 },
            {
              scrollTrigger: {
                trigger: telemetryRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              ease: 'power3.out',
            }
          );
        }
      }

      // 8. Testimonial Cards Float In
      if (testimonialsRef.current) {
        const reviewCards = testimonialsRef.current.querySelectorAll('.gsap-review-card');
        gsap.fromTo(
          reviewCards,
          { opacity: 0, y: 40 },
          {
            scrollTrigger: {
              trigger: testimonialsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
          }
        );
      }

      // 9. Final CTA Pulse & Scale Reveal
      if (ctaRef.current) {
        const ctaCard = ctaRef.current.querySelector('.gsap-cta-card');
        if (ctaCard) {
          gsap.fromTo(
            ctaCard,
            { opacity: 0, scale: 0.92, y: 30 },
            {
              scrollTrigger: {
                trigger: ctaRef.current,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1,
              ease: 'power3.out',
            }
          );
        }
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white font-sans antialiased overflow-x-hidden">
      {/* Background Ambient Lighting Orbs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] opacity-70" />
        <div className="absolute top-[35%] -left-[15%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] opacity-50" />
        <div className="absolute top-[65%] -right-[15%] w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[180px] opacity-40" />
      </div>

      {/* Subtle Architectural Texture Grid */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)]" />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section ref={heroRef} className="relative z-10 pt-12 sm:pt-20 pb-20 sm:pb-32 px-6 sm:px-8 max-w-7xl mx-auto text-center">
        {/* Pill Badge */}
        <div className="gsap-hero-anim inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800 text-cyan-400 text-xs font-extrabold tracking-wider uppercase mb-8 shadow-inner backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>KIZUNAFIT 2.0 • AI-POWERED 1-ON-1 COACHING</span>
        </div>

        {/* Hero Main Headline */}
        <h1 className="gsap-hero-anim text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.08]">
          Elite Fitness Coaching<span className="text-cyan-400">.</span>
          <br className="hidden sm:inline" />
          Transformed by Intelligence<span className="text-teal-400">.</span>
        </h1>

        {/* Hero Subtitle */}
        <p className="gsap-hero-anim mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
          Connect 1-on-1 with certified personal trainers, track real-time biometrics, and experience hyper-personalized workout & nutrition programming built for real physical transformation.
        </p>

        {/* Hero CTA Button Grid */}
        <div className="gsap-hero-anim mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            href={isAuthenticated ? (isTrainer ? ROUTES.TRAINER_PROFILE : ROUTES.CLIENT_PROFILE) : ROUTES.PUBLIC_TRAINERS}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-2xl shadow-lg shadow-cyan-950/50 hover:shadow-cyan-900/60 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
          >
            <span>{isAuthenticated ? 'Go to Dashboard' : 'Find Your Trainer'}</span>
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          {!isAuthenticated && (
            <Link
              href={`${ROUTES.REGISTER}?role=TRAINER`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-slate-200 hover:text-white bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl backdrop-blur-md shadow-sm hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
            >
              <span>Join as a Trainer</span>
            </Link>
          )}
        </div>

        {/* Floating Glass Mockup Hero Feature with GSAP Parallax Tilt */}
        <div className="gsap-hero-mockup mt-16 sm:mt-24 relative max-w-5xl mx-auto perspective-1000">
          {/* Top Edge Light Beam */}
          <div className="absolute -top-[1px] inset-x-12 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent z-20" />

          <div className="relative rounded-3xl bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 shadow-[0_25px_80px_-15px_rgba(2,6,23,0.95)] p-4 sm:p-8 overflow-hidden text-left">
            {/* Mockup Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-semibold text-slate-400 ml-2">KIZUNAFIT Live Biometrics Engine v2.4</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Sync Active</span>
              </div>
            </div>

            {/* Dashboard Mockup Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Client Active Program Progress */}
              <div className="md:col-span-2 p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Program</span>
                    <h3 className="text-lg font-extrabold text-white mt-0.5">12-Week Hypertrophy & Recomp</h3>
                  </div>
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20">
                    Week 6 of 12
                  </span>
                </div>

                {/* Progress Bar & Curve */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Program Completion</span>
                    <span>58% Complete</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div className="h-full bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-400 rounded-full w-[58%]" />
                  </div>
                </div>

                {/* Biometric SVG Chart Graphic */}
                <div className="h-28 w-full relative pt-2">
                  <svg className="w-full h-full text-cyan-500" viewBox="0 0 400 100" fill="none" preserveAspectRatio="none">
                    <path
                      d="M0 80 Q 80 60, 160 70 T 320 30 T 400 20"
                      stroke="url(#gradient-line)"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      d="M0 80 Q 80 60, 160 70 T 320 30 T 400 20 V 100 H 0 Z"
                      fill="url(#gradient-area)"
                      opacity="0.15"
                    />
                    <defs>
                      <linearGradient id="gradient-line" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                      <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              {/* Card 2: Trainer 1-on-1 Snapshot */}
              <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Assigned Coach</span>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-500 to-teal-500 p-0.5 shrink-0">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-white text-sm">
                        MV
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white">Coach Marcus Vance</h4>
                      <p className="text-xs text-slate-400 font-medium">CSCS • NASM Master</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-300 font-bold">
                    <span>Next Video Session</span>
                    <span className="text-cyan-400">Today, 4:00 PM</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Form check & weekly macro adjustment</p>
                </div>

                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white border border-slate-800 text-xs font-bold transition-colors"
                >
                  Message Coach
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TRUSTED PROOF STATISTICS BAR */}
      {/* ========================================================================= */}
      <section ref={statsRef} className="relative z-10 border-y border-slate-900 bg-slate-950/80 py-12 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="gsap-stat-card p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md space-y-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">2,400+</h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-400">Clients Transformed</p>
          </div>
          <div className="gsap-stat-card p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md space-y-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-cyan-400 tracking-tight">150+</h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-400">Certified Master Trainers</p>
          </div>
          <div className="gsap-stat-card p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md space-y-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight">98.4%</h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-400">Program Completion Rate</p>
          </div>
          <div className="gsap-stat-card p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-md space-y-1">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight">4.9 / 5 ★</h3>
            <p className="text-xs sm:text-sm font-semibold text-slate-400">Average Client Rating</p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. WHY KIZUNAFIT (PROBLEM VS SOLUTION STORYTELLING) */}
      {/* ========================================================================= */}
      <section ref={whyRef} className="relative z-10 py-24 px-6 sm:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">The Problem & The Solution</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Traditional Coaching is Broken<span className="text-rose-500">.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-medium">
            Generic PDF workout plans, lost WhatsApp messages, and zero biometric tracking lead to frustration. KIZUNAFIT replaces chaos with intelligent 1-on-1 structure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* The Old Way */}
          <div className="gsap-why-old p-8 rounded-3xl bg-slate-900/40 border border-rose-500/20 space-y-6 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
                ✕
              </div>
              <h3 className="text-xl font-bold text-white">The Old Way of Online Coaching</h3>
            </div>

            <ul className="space-y-4 text-sm text-slate-300 font-medium">
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Static PDF workout sheets emailed once and forgotten</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Disconnected WhatsApp chats with delayed feedback</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Zero real-time telemetry or biometric tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400 font-bold">✕</span>
                <span>No accountability when motivation drops</span>
              </li>
            </ul>
          </div>

          {/* The KIZUNAFIT Way */}
          <div className="gsap-why-new p-8 rounded-3xl bg-slate-900/70 border border-cyan-500/30 space-y-6 relative overflow-hidden backdrop-blur-xl shadow-xl shadow-cyan-950/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold">
                ✓
              </div>
              <h3 className="text-xl font-bold text-white">The KIZUNAFIT Experience</h3>
            </div>

            <ul className="space-y-4 text-sm text-slate-200 font-medium">
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold">✓</span>
                <span>Interactive workout logger with live set & rep counters</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold">✓</span>
                <span>Direct 1-on-1 HD video check-ins and form analysis</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold">✓</span>
                <span>Live biometric weight progression & macro telemetry</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400 font-bold">✓</span>
                <span>Certified coach matching tailored to your specific goals</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PLATFORM FEATURES GRID */}
      {/* ========================================================================= */}
      <section ref={featuresRef} id="features" className="relative z-10 py-24 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Everything You Need</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Built for Elite Performance<span className="text-cyan-400">.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-medium">
            Every feature is designed to eliminate friction between client and trainer, creating the ultimate accountability ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="gsap-feature-card p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-slate-700 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Trainer Discovery & Matching</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Filter certified coaches by specialization, certifications, pricing, and verified client success rates.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="gsap-feature-card p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-slate-700 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Precision Workout Tracking</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Log sets, reps, load, and RPE with instant trainer review and automated progress curves.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="gsap-feature-card p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-slate-700 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5 5 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5 5 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Smart Nutrition & Macros</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Custom caloric targets and macronutrient split guidance adjusted weekly based on body response.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="gsap-feature-card p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-slate-700 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">1-on-1 Video Consultations</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Integrated HD video sessions for posture evaluation, movement checkups, and goal setting.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="gsap-feature-card p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-slate-700 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Direct Coach Messaging</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Encrypted messaging with exercise video attachments for instant form feedback.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="gsap-feature-card p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl hover:border-slate-700 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Performance Analytics</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Track 1RM PR milestones, body fat composition, and workout streak achievements over time.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOW IT WORKS TIMELINE */}
      {/* ========================================================================= */}
      <section ref={howItWorksRef} id="how-it-works" className="relative z-10 py-24 px-6 sm:px-8 border-t border-slate-900 bg-slate-950/60 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Simple From Day One</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            How KIZUNAFIT Works<span className="text-cyan-400">.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 font-medium">
            Four simple steps to kickstart your physical transformation with elite 1-on-1 coaching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="gsap-step-card p-6 rounded-3xl bg-slate-900/50 border border-slate-800 relative space-y-3">
            <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 font-extrabold text-sm flex items-center justify-center border border-cyan-500/30">
              1
            </span>
            <h3 className="text-lg font-bold text-white">Discover Your Coach</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Browse verified trainer profiles, review specializations, and find the perfect match.
            </p>
          </div>

          {/* Step 2 */}
          <div className="gsap-step-card p-6 rounded-3xl bg-slate-900/50 border border-slate-800 relative space-y-3">
            <span className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 font-extrabold text-sm flex items-center justify-center border border-teal-500/30">
              2
            </span>
            <h3 className="text-lg font-bold text-white">Book Consultation</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Schedule your 1-on-1 video intake session to align on goals, injuries, and target timelines.
            </p>
          </div>

          {/* Step 3 */}
          <div className="gsap-step-card p-6 rounded-3xl bg-slate-900/50 border border-slate-800 relative space-y-3">
            <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-sm flex items-center justify-center border border-emerald-500/30">
              3
            </span>
            <h3 className="text-lg font-bold text-white">Receive Custom Plan</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Get your custom weekly workouts, video exercise guides, and caloric macro breakdown.
            </p>
          </div>

          {/* Step 4 */}
          <div className="gsap-step-card p-6 rounded-3xl bg-slate-900/50 border border-slate-800 relative space-y-3">
            <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-extrabold text-sm flex items-center justify-center border border-amber-500/30">
              4
            </span>
            <h3 className="text-lg font-bold text-white">Execute & Transform</h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Log daily workouts, receive trainer feedback, track biometrics, and achieve your goals.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. MARKETPLACE PREVIEW (FEATURED CERTIFIED TRAINERS) */}
      {/* ========================================================================= */}
      <section ref={marketplaceRef} className="relative z-10 py-24 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Featured Coaches</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Meet Elite Trainers<span className="text-cyan-400">.</span>
            </h2>
            <p className="text-base text-slate-300 font-medium max-w-xl">
              Every trainer on KIZUNAFIT is rigorously vetted, certified, and dedicated to your physical success.
            </p>
          </div>

          <Link
            href={ROUTES.PUBLIC_TRAINERS}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-sm font-bold text-slate-200 hover:text-white w-fit transition-colors"
          >
            <span>Explore All 150+ Trainers</span>
            <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Trainer Card 1 */}
          <div className="gsap-trainer-card p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-5 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shrink-0 shadow-md">
                  <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center font-extrabold text-white text-lg">
                    MV
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Coach Marcus Vance</h3>
                  <p className="text-xs text-slate-400 font-semibold">NASM Master Trainer • CSCS</p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-amber-400">
                    <span>5.0 ★</span>
                    <span className="text-slate-500 font-normal">(128 reviews)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 text-xs font-semibold border border-slate-800">
                  Hypertrophy
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 text-xs font-semibold border border-slate-800">
                  Powerlifting
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 text-xs font-semibold border border-slate-800">
                  8+ Yrs Exp
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">Starting at</span>
                <p className="text-base font-extrabold text-white">$49 <span className="text-xs font-medium text-slate-400">/ week</span></p>
              </div>
              <Link
                href={ROUTES.PUBLIC_TRAINERS}
                className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-colors"
              >
                View Profile
              </Link>
            </div>
          </div>

          {/* Trainer Card 2 */}
          <div className="gsap-trainer-card p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-5 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 p-0.5 shrink-0 shadow-md">
                  <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center font-extrabold text-white text-lg">
                    ER
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Coach Elena Rostova</h3>
                  <p className="text-xs text-slate-400 font-semibold">IFBB Pro • Precision Nutrition</p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-amber-400">
                    <span>4.9 ★</span>
                    <span className="text-slate-500 font-normal">(94 reviews)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 text-xs font-semibold border border-slate-800">
                  Body Recomp
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 text-xs font-semibold border border-slate-800">
                  Fat Loss
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 text-xs font-semibold border border-slate-800">
                  6+ Yrs Exp
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">Starting at</span>
                <p className="text-base font-extrabold text-white">$55 <span className="text-xs font-medium text-slate-400">/ week</span></p>
              </div>
              <Link
                href={ROUTES.PUBLIC_TRAINERS}
                className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-colors"
              >
                View Profile
              </Link>
            </div>
          </div>

          {/* Trainer Card 3 */}
          <div className="gsap-trainer-card p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-5 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-600 p-0.5 shrink-0 shadow-md">
                  <div className="w-full h-full rounded-2xl bg-slate-950 flex items-center justify-center font-extrabold text-white text-lg">
                    DC
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Coach David Chen</h3>
                  <p className="text-xs text-slate-400 font-semibold">DPT • Strength Specialist</p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-amber-400">
                    <span>5.0 ★</span>
                    <span className="text-slate-500 font-normal">(156 reviews)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 text-xs font-semibold border border-slate-800">
                  Post-Rehab
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 text-xs font-semibold border border-slate-800">
                  Athletic Perf
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 text-xs font-semibold border border-slate-800">
                  10+ Yrs Exp
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium">Starting at</span>
                <p className="text-base font-extrabold text-white">$60 <span className="text-xs font-medium text-slate-400">/ week</span></p>
              </div>
              <Link
                href={ROUTES.PUBLIC_TRAINERS}
                className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition-colors"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PROGRESS & ANALYTICS INTERACTIVE PREVIEW */}
      {/* ========================================================================= */}
      <section ref={telemetryRef} className="relative z-10 py-24 px-6 sm:px-8 border-t border-slate-900 bg-slate-950/80 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Real-Time Telemetry</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Track Every Transformation Milestone<span className="text-emerald-400">.</span>
          </h2>
          <p className="text-base text-slate-300 font-medium">
            Biometrics, body measurements, and exercise volume graphs synced directly between client and coach.
          </p>
        </div>

        {/* Feature Tab Selector */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md gap-1">
            <button
              type="button"
              onClick={() => setActiveFeatureTab('workout')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeFeatureTab === 'workout'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Workout Telemetry
            </button>
            <button
              type="button"
              onClick={() => setActiveFeatureTab('nutrition')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeFeatureTab === 'nutrition'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Macro Compliance
            </button>
            <button
              type="button"
              onClick={() => setActiveFeatureTab('analytics')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeFeatureTab === 'analytics'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Body Transformation Curve
            </button>
          </div>
        </div>

        {/* Dynamic Display Card */}
        <div className="gsap-telemetry-card max-w-4xl mx-auto p-8 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-2xl space-y-6">
          {activeFeatureTab === 'workout' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-bold text-white">Barbell Squat Volume & 1RM Trend</h4>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  +35 lbs 1RM Gain
                </span>
              </div>
              <div className="h-40 w-full flex items-end gap-3 pt-4 border-b border-slate-800 pb-2">
                {['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'].map((week, idx) => (
                  <div key={week} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div
                      className="w-full bg-gradient-to-t from-cyan-500 to-teal-400 rounded-t-lg transition-all duration-500"
                      style={{ height: `${40 + idx * 10}%` }}
                    />
                    <span className="text-[11px] font-semibold text-slate-400">{week}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeFeatureTab === 'nutrition' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-bold text-white">Target Macro Split Breakdown</h4>
                <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
                  2,450 kcal / day
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center pt-2">
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-bold text-slate-400">Protein</span>
                  <p className="text-xl font-extrabold text-cyan-400 mt-1">185g</p>
                  <span className="text-[10px] text-slate-500">Target hit 96%</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-bold text-slate-400">Carbohydrates</span>
                  <p className="text-xl font-extrabold text-teal-400 mt-1">240g</p>
                  <span className="text-[10px] text-slate-500">Target hit 98%</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-xs font-bold text-slate-400">Healthy Fats</span>
                  <p className="text-xl font-extrabold text-emerald-400 mt-1">65g</p>
                  <span className="text-[10px] text-slate-500">Target hit 94%</span>
                </div>
              </div>
            </div>
          )}

          {activeFeatureTab === 'analytics' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-bold text-white">Body Recomposition & Fat Loss Trend</h4>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                  -14 lbs Fat • +6 lbs Muscle
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Start: 198 lbs (22% Body Fat)</span>
                <span className="text-emerald-400 font-extrabold">Current: 184 lbs (14% Body Fat)</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. CLIENT TESTIMONIALS & TRANSFORMATION STORIES */}
      {/* ========================================================================= */}
      <section ref={testimonialsRef} id="testimonials" className="relative z-10 py-24 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Real People • Real Results</span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Client Transformations<span className="text-cyan-400">.</span>
          </h2>
          <p className="text-base text-slate-300 font-medium">
            Hear directly from clients and coaches who unlocked peak physical performance using KIZUNAFIT.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Review 1 */}
          <div className="gsap-review-card p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-amber-400 text-sm font-bold">★★★★★</div>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                "Lost 22 lbs of fat while building lean muscle in 12 weeks. Having Coach Elena check my form and hold me accountable every single day was the game changer I needed."
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-sm border border-cyan-500/30">
                SJ
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Sarah Jenkins</h4>
                <p className="text-xs text-slate-400">Coached by Elena Rostova</p>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="gsap-review-card p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-amber-400 text-sm font-bold">★★★★★</div>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                "As a busy executive, I never had time for generic gym routines. KIZUNAFIT matched me with Coach David, and I hit a 405 lb deadlift at age 42 without injury."
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center text-sm border border-teal-500/30">
                MC
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Michael Chang</h4>
                <p className="text-xs text-slate-400">Coached by David Chen</p>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="gsap-review-card p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-amber-400 text-sm font-bold">★★★★★</div>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                "KIZUNAFIT allowed me to scale my 1-on-1 coaching client base from 10 to 45 clients while maintaining ultra-high quality program delivery and telemetry."
              </p>
            </div>
            <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-sm border border-emerald-500/30">
                AR
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Coach Alex Rivera</h4>
                <p className="text-xs text-slate-400">Certified Master Coach</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FINAL HIGH-IMPACT CTA SECTION */}
      {/* ========================================================================= */}
      <section ref={ctaRef} className="relative z-10 py-20 px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="gsap-cta-card relative rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800/90 shadow-2xl p-10 sm:p-16 text-center overflow-hidden">
          {/* Accent Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Ready to Transform Your Physical Fitness<span className="text-cyan-400">?</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-300 font-medium">
              Join thousands of clients and certified coaches achieving peak performance on KIZUNAFIT.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <Link
                href={ROUTES.PUBLIC_TRAINERS}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-2xl shadow-lg shadow-cyan-950/50 hover:shadow-cyan-900/60 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
              >
                <span>Find Your Trainer Now</span>
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>

              {!isAuthenticated && (
                <Link
                  href={`${ROUTES.REGISTER}?role=TRAINER`}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-bold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl backdrop-blur-md shadow-sm hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
                >
                  <span>Become a Trainer</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
