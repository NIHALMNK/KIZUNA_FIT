import React from 'react';
import { mapApiError } from '../../utils/errorMapper';

interface ErrorStateProps {
  error?: unknown;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, title, message, onRetry }) => {
  const mapped = error ? mapApiError(error) : { title: title || 'An error occurred', message: message || 'Something went wrong. Please try again.', isNotFound: false, isForbidden: false };

  return (
    <div className="bg-[var(--color-danger-bg)] border border-[var(--color-danger)]/30 rounded-xl p-6 my-4 text-center">
      <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-[var(--color-danger)]/20 text-[var(--color-danger)] mb-3 font-bold">
        !
      </div>
      <h3 className="text-sm font-semibold text-[var(--color-danger)]">{mapped.title}</h3>
      <p className="mt-1 text-xs opacity-90 max-w-sm mx-auto">{mapped.message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center px-3.5 py-1.5 border border-[var(--color-danger)]/40 text-xs font-medium rounded-lg text-[var(--color-danger)] bg-[var(--color-card)] hover:bg-[var(--color-surface-alt)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

