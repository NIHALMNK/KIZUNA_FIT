import React from 'react';

interface InfoCardProps {
  label: string;
  value?: React.ReactNode | string | number | null;
  fallback?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ label, value, fallback = 'Not specified' }) => {
  const displayValue = value !== undefined && value !== null && value !== '' ? value : fallback;
  const isFallback = displayValue === fallback;

  return (
    <div className="bg-gray-50 rounded-md p-3 border border-gray-100">
      <span className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </span>
      <div className={`text-sm font-medium ${isFallback ? 'text-gray-400 italic' : 'text-gray-900'}`}>
        {displayValue}
      </div>
    </div>
  );
};
