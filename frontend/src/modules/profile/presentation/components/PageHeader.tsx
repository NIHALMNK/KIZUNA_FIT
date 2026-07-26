import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  role?: 'CLIENT' | 'TRAINER';
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action, role = 'CLIENT' }) => {
  const badgeBg = role === 'TRAINER' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800';

  return (
    <div className="bg-white border-b border-gray-200 py-6 px-4 sm:px-6 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full uppercase tracking-wider ${badgeBg}`}>
              {role}
            </span>
          </div>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {action && <div className="flex items-center gap-3">{action}</div>}
      </div>
    </div>
  );
};
