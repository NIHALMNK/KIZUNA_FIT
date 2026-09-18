import React from 'react';
import { Droplets } from 'lucide-react';

interface HydrationGoalDisplayProps {
  targetMl?: number | null;
  loggedMl?: number | null;
  notes?: string | null;
  className?: string;
  onLogWater?: () => void;
  showLogButton?: boolean;
}

export const HydrationGoalDisplay: React.FC<HydrationGoalDisplayProps> = ({
  targetMl,
  loggedMl,
  notes,
  className = '',
  onLogWater,
  showLogButton = false,
}) => {
  if (targetMl === undefined || targetMl === null) {
    return null;
  }

  const isCompare = loggedMl !== undefined && loggedMl !== null;
  const currentMl = isCompare ? loggedMl! : 0;
  const percentage = targetMl > 0 ? Math.min(100, Math.round((currentMl / targetMl) * 100)) : 0;

  return (
    <div
      className={`p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Droplets className="w-4 h-4 shrink-0" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Hydration Target</div>
            <div className="text-[11px] text-slate-500">Stay hydrated throughout the day</div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-base font-bold text-slate-900">{targetMl} ml</span>
        </div>
      </div>

      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-600">
            {isCompare ? `${currentMl} / ${targetMl} ml` : `0 / ${targetMl} ml`}
          </span>
          <span className="font-semibold text-blue-600">{percentage}%</span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {showLogButton && onLogWater && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onLogWater}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
          >
            Log Water
          </button>
        </div>
      )}

      {notes && (
        <p className="text-xs text-slate-500 italic pt-1 border-t border-slate-100">{notes}</p>
      )}
    </div>
  );
};
