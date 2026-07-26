import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action, icon }) => {
  return (
    <div className="bg-white border border-dashed border-gray-300 rounded-lg p-8 sm:p-12 text-center my-4 shadow-sm">
      {icon ? (
        <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center mb-4">{icon}</div>
      ) : (
        <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4 font-semibold text-lg">
          ?
        </div>
      )}
      <h3 className="text-base font-bold text-gray-900">{title}</h3>
      {description && <p className="mt-1 text-xs text-gray-500 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};
