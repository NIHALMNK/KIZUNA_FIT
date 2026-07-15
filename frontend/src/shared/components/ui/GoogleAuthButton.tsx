'use client';

import React, { useEffect, useRef } from 'react';

export const GoogleAuthButton: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only render the button if the google script has been loaded and initialized
    if (typeof window !== 'undefined' && containerRef.current) {
      const renderGoogleButton = () => {
        const w = window as any;
        if (w.google && w.google.accounts && w.google.accounts.id) {
          w.google.accounts.id.renderButton(containerRef.current!, {
            type: 'standard',
            shape: 'rectangular',
            theme: 'outline',
            size: 'large',
            text: 'continue_with',
            width: 250, // Fixed width as requested by user
          });
        }
      };

      // If initialized, render immediately
      if ((window as any).__google_initialized) {
        renderGoogleButton();
      } else {
        // Otherwise wait for the initializer to finish
        const checkInterval = setInterval(() => {
          if ((window as any).__google_initialized) {
            renderGoogleButton();
            clearInterval(checkInterval);
          }
        }, 100);

        return () => clearInterval(checkInterval);
      }
    }
  }, []);

  return (
    <div className="w-full flex justify-center">
      <div ref={containerRef}></div>
    </div>
  );
};
