import React from 'react';

interface LoadingStateProps {
  message?: string;
  count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading profile data...', count = 3 }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 my-4 animate-pulse">
      <div className="flex items-center space-x-4 mb-6">
        <div className="rounded-full bg-gray-200 h-16 w-16"></div>
        <div className="flex-1 space-y-2 py-1">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
        ))}
      </div>
      <p className="mt-4 text-xs text-gray-400 text-center">{message}</p>
    </div>
  );
};
