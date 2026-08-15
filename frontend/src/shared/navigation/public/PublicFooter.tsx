'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FOOTER_COLUMNS, FOOTER_BRAND_TEXT } from './footer.config';
import { PUBLIC_ROUTES } from '../../constants/routes/public.routes';

export const PublicFooter: React.FC = () => {
  return (
    <footer id="contact" className="relative z-10 border-t border-slate-900 bg-slate-950/90 pt-16 pb-12 px-6 sm:px-8 text-slate-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand Description Column */}
        <div className="md:col-span-4 space-y-4">
          <Link href={PUBLIC_ROUTES.HOME} className="flex items-center gap-3 w-fit group">
            <div className="relative h-8 w-8">
              <Image
                src="/assets/KIZUNA-FIT.png"
                alt="KIZUNAFIT Logo"
                width={32}
                height={32}
                className="h-full w-full object-contain"
              />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              KIZUNA-FIT
            </span>
          </Link>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
            {FOOTER_BRAND_TEXT.tagline}
          </p>
        </div>

        {/* Configuration-driven Links Columns */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">
                {column.title}
              </h4>
              <ul className="space-y-2 text-xs font-semibold">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-cyan-400 transition-colors"
                      {...(link.isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>{FOOTER_BRAND_TEXT.copyright}</p>
        <div className="flex items-center gap-4 font-medium">
          <span>Enterprise SaaS Grade</span>
          <span>•</span>
          <span>Encrypted Telemetry</span>
        </div>
      </div>
    </footer>
  );
};
