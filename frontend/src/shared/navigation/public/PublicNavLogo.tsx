'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PUBLIC_ROUTES } from '../../constants/routes/public.routes';

interface PublicNavLogoProps {
  className?: string;
}

export const PublicNavLogo: React.FC<PublicNavLogoProps> = ({ className = '' }) => {
  return (
    <Link
      href={PUBLIC_ROUTES.HOME}
      className={`flex items-center gap-3.5 group focus:outline-none rounded-full shrink-0 transition-opacity hover:opacity-95 ${className}`}
      aria-label="KIZUNAFIT Home"
    >
      <div className="relative h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center shrink-0">
        <Image
          src="/assets/KIZUNA-FIT.png"
          alt="KIZUNA-FIT Logo"
          width={40}
          height={40}
          priority
          className="h-full w-full object-contain drop-shadow-[0_2px_12px_rgba(6,182,212,0.4)]"
        />
      </div>
      <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
        KIZUNA-FIT
      </span>
    </Link>
  );
};
