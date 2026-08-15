import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action, icon }) => {
  return (
    <div className="bg-[var(--color-card)] border border-dashed border-[var(--color-border)] rounded-xl p-8 sm:p-12 text-center my-4 shadow-sm">
      {icon ? (
        <div className="mx-auto h-12 w-12 text-[var(--color-text-muted)] flex items-center justify-center mb-4">{icon}</div>
      ) : (
        <div className="mx-auto h-12 w-12 rounded-full bg-[var(--color-surface-alt)] flex items-center justify-center text-[var(--color-text-secondary)] mb-4 font-semibold text-lg">
          ?
        </div>
      )}
      <h3 className="text-base font-bold text-[var(--color-heading)]">{title}</h3>
      {description && <p className="mt-1 text-xs text-[var(--color-text-secondary)] max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

