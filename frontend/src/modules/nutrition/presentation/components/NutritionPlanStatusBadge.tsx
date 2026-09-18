import React from 'react';
import { NutritionPlanStatus } from '../../domain/types/nutrition.types';
import {
  CheckCircle2,
  Edit3,
  Archive,
  HelpCircle,
  Clock,
  AlertTriangle,
  XCircle,
} from 'lucide-react';

export interface NutritionPlanStatusBadgeProps {
  status: NutritionPlanStatus | string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const NutritionPlanStatusBadge: React.FC<NutritionPlanStatusBadgeProps> = ({
  status,
  label,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  if (status === 'HISTORY_ONLY') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs ${sizeClasses} ${className}`}
      >
        <Archive className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        {label || 'Plan History'}
      </span>
    );
  }

  switch (status) {
    case NutritionPlanStatus.ACTIVE:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs ${sizeClasses} ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          {label || 'Active'}
        </span>
      );
    case NutritionPlanStatus.DRAFT:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs ${sizeClasses} ${className}`}
        >
          <Edit3 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {label || 'Draft'}
        </span>
      );
    case NutritionPlanStatus.PENDING_APPROVAL:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs ${sizeClasses} ${className}`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          {label || 'Pending Approval'}
        </span>
      );
    case NutritionPlanStatus.DELETION_PENDING:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs ${sizeClasses} ${className}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          {label || 'Retirement Pending'}
        </span>
      );
    case NutritionPlanStatus.COMPLETED:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs ${sizeClasses} ${className}`}
        >
          <Archive className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {label || 'Completed'}
        </span>
      );
    case NutritionPlanStatus.CANCELLED:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs ${sizeClasses} ${className}`}
        >
          <XCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {label || 'Retired'}
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs ${sizeClasses} ${className}`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {label || status}
        </span>
      );
  }
};
