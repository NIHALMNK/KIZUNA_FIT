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
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-4 text-center">
      <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-red-100 text-red-600 mb-3 font-bold">
        !
      </div>
      <h3 className="text-sm font-semibold text-red-800">{mapped.title}</h3>
      <p className="mt-1 text-xs text-red-600 max-w-sm mx-auto">{mapped.message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center px-3 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
