import React from 'react';
import { NutritionDay, NutritionDaySnapshot } from '../../domain/types/nutrition.types';
import { MacroTargetDisplay } from './MacroTargetDisplay';
import { HydrationGoalDisplay } from './HydrationGoalDisplay';
import { MealCard } from './MealCard';
import { Copy, Edit2, Trash2 } from 'lucide-react';

interface NutritionDayCardProps {
  day: NutritionDay | NutritionDaySnapshot;
  onEdit?: () => void;
  onDelete?: () => void;
  onCopyDay?: () => void;
  isEditable?: boolean;
}

export const NutritionDayCard: React.FC<NutritionDayCardProps> = ({
  day,
  onEdit,
  onDelete,
  onCopyDay,
  isEditable = false,
}) => {
  const dayTitle = day.weekday
    ? `${day.weekday.charAt(0) + day.weekday.slice(1).toLowerCase()} Plan`
    : day.name || `Day ${day.dayNumber}`;

  const mealCount = day.meals?.length || 0;
  const calories = day.targetCalories || 0;
  const hydrationMl = day.hydrationGoal?.targetMl || 0;

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-5">
      {/* Day Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">{dayTitle}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {mealCount} {mealCount === 1 ? 'meal' : 'meals'}
            {calories > 0 ? ` • ${calories} kcal` : ''}
            {hydrationMl > 0 ? ` • ${hydrationMl} ml water` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onCopyDay && (
            <button
              type="button"
              onClick={onCopyDay}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              Copy Day
            </button>
          )}

          {isEditable && (
            <>
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Target Macros Inline */}
      {(day.targetCalories || day.dailyMacroTargets) && (
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-slate-700">Day Target:</span>
          <MacroTargetDisplay
            targetCalories={day.targetCalories}
            macros={day.dailyMacroTargets}
            size="sm"
          />
        </div>
      )}

      {/* Prescribed Meals List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Prescribed Meals ({mealCount})
          </span>
        </div>

        {mealCount === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
            No meals configured for this day.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {day.meals.map((meal, idx) => (
              <MealCard
                key={(meal as any).id || (meal as any).mealId || idx}
                meal={meal}
                isEditable={isEditable}
              />
            ))}
          </div>
        )}
      </div>

      {/* Hydration Goal if defined */}
      {day.hydrationGoal && (
        <HydrationGoalDisplay
          targetMl={day.hydrationGoal.targetMl}
          notes={day.hydrationGoal.notes}
        />
      )}

      {day.notes && (
        <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
          {day.notes}
        </p>
      )}
    </div>
  );
};
