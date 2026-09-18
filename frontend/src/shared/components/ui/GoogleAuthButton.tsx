'use client';

import React, { useEffect, useRef, useState } from 'react';

export const GoogleAuthButton: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && containerRef.current) {
      const renderGoogleButton = () => {
        const w = window as any;
        if (w.google && w.google.accounts && w.google.accounts.id) {
          try {
            w.google.accounts.id.renderButton(containerRef.current!, {
              type: 'standard',
              shape: 'pill',
              theme: 'filled_black',
              size: 'large',
              text: 'continue_with',
              width: '100%',
            });
            setIsReady(true);
          } catch (e) {
            console.warn('Google Auth render fallback', e);
          }
        }
      };

      if ((window as any).__google_initialized) {
        renderGoogleButton();
      } else {
        const checkInterval = setInterval(() => {
          if ((window as any).__google_initialized) {
            renderGoogleButton();
            setIsReady(true);
            clearInterval(checkInterval);
          }
        }, 100);

        return () => clearInterval(checkInterval);
      }
    }
  }, []);

  return (
    <div className="w-full relative group">
      {/* Google Auth Button Wrapper */}
      <div className="w-full flex items-center justify-center gap-3 h-11 px-5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-sm transition-all duration-200 shadow-sm cursor-pointer relative overflow-hidden">
        {/* Animated Google SVG Logo */}
        <svg
          className="w-5 h-5 group-hover:scale-110 transition-transform duration-200 shrink-0"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>

        <span className="font-semibold tracking-tight">Continue with Google</span>

        {/* Hidden Overlay Google GIS Button for Native Event Interception */}
        <div
          ref={containerRef}
          className="absolute inset-0 opacity-0 overflow-hidden cursor-pointer z-10 scale-125"
        />
      </div>
    </div>
  );
};
