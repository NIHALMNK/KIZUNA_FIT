import React from 'react';
import {
  NutritionCompletionStatus,
  MealCompletionStatus,
} from '../../domain/types/nutrition.types';
import { CheckCircle2, Clock, AlertTriangle, XCircle, Minus, HelpCircle } from 'lucide-react';

interface NutritionCompletionStatusBadgeProps {
  status: NutritionCompletionStatus | string;
  className?: string;
  size?: 'sm' | 'md';
}

export const NutritionCompletionStatusBadge: React.FC<NutritionCompletionStatusBadgeProps> = ({
  status,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  switch (status) {
    case NutritionCompletionStatus.IN_PROGRESS:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs ${sizeClasses} ${className}`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          In Progress
        </span>
      );
    case NutritionCompletionStatus.COMPLETED:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs ${sizeClasses} ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          Completed
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs ${sizeClasses} ${className}`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {status}
        </span>
      );
  }
};

interface MealCompletionStatusBadgeProps {
  status?: MealCompletionStatus | 'NOT_TRACKED' | string | null;
  className?: string;
  size?: 'sm' | 'md';
}

export const MealCompletionStatusBadge: React.FC<MealCompletionStatusBadgeProps> = ({
  status,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  switch (status) {
    case MealCompletionStatus.COMPLETED:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs ${sizeClasses} ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          Completed
        </span>
      );
    case MealCompletionStatus.PARTIALLY_COMPLETED:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs ${sizeClasses} ${className}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          Partial
        </span>
      );
    case MealCompletionStatus.SKIPPED:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs ${sizeClasses} ${className}`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          Skipped
        </span>
      );
    case 'NOT_TRACKED':
    case undefined:
    case null:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-slate-50 text-slate-600 border border-slate-200 shadow-2xs ${sizeClasses} ${className}`}
        >
          <Minus className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          Not Tracked
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs ${sizeClasses} ${className}`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {status}
        </span>
      );
  }
};
