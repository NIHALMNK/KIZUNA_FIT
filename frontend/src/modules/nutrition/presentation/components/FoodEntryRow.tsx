import React from 'react';
import { FoodEntry } from '../../domain/types/nutrition.types';
import { Trash2 } from 'lucide-react';

interface FoodEntryRowProps {
  entry: FoodEntry;
  onRemove?: () => void;
  isEditable?: boolean;
}

export const FoodEntryRow: React.FC<FoodEntryRowProps> = ({
  entry,
  onRemove,
  isEditable = false,
}) => {
  return (
    <div className="flex items-center justify-between py-1.5 text-xs group">
      <div className="flex items-baseline gap-1.5 flex-1 min-w-0 pr-2">
        <span className="text-slate-300 font-bold">•</span>
        <span className="font-medium text-slate-800 truncate">{entry.name}</span>
        <span className="text-slate-500 font-normal shrink-0">
          ({entry.quantity} {entry.unit})
        </span>
      </div>

      <div className="flex items-center gap-2.5 shrink-0 text-slate-600">
        {entry.calories !== undefined && entry.calories !== null && (
          <span className="font-semibold text-slate-900">{entry.calories} kcal</span>
        )}

        <div className="hidden sm:flex items-center gap-1.5 text-[11px]">
          {entry.protein !== undefined && entry.protein !== null && (
            <span className="text-blue-600 font-medium">P {entry.protein}g</span>
          )}
          {entry.carbohydrates !== undefined && entry.carbohydrates !== null && (
            <span className="text-amber-600 font-medium">C {entry.carbohydrates}g</span>
          )}
          {entry.fats !== undefined && entry.fats !== null && (
            <span className="text-rose-600 font-medium">F {entry.fats}g</span>
          )}
        </div>

        {isEditable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors ml-1"
            title="Remove item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {entry.alternatives && entry.alternatives.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 pl-4 pt-1 w-full">
          <span className="font-semibold text-slate-600">Alternatives:</span>
          {entry.alternatives.map((alt, aIdx) => (
            <span
              key={alt.id || aIdx}
              className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
            >
              {alt.name} ({alt.quantity} {alt.unit}){alt.calories ? ` · ${alt.calories} kcal` : ''}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
