import React from 'react';
import { Meal, PrescribedMealSnapshot, MealType } from '../../domain/types/nutrition.types';
import { FoodEntryRow } from './FoodEntryRow';
import { Clock, Sun, Utensils, Moon, Coffee, Edit2, Trash2 } from 'lucide-react';

interface MealCardProps {
  meal: Meal | PrescribedMealSnapshot;
  onEdit?: () => void;
  onDelete?: () => void;
  isEditable?: boolean;
}

function getMealIcon(type?: MealType | string) {
  const t = (type || '').toUpperCase();
  if (t.includes('BREAKFAST')) return <Sun className="w-4 h-4 text-amber-500" />;
  if (t.includes('LUNCH')) return <Utensils className="w-4 h-4 text-emerald-600" />;
  if (t.includes('DINNER')) return <Moon className="w-4 h-4 text-indigo-500" />;
  return <Coffee className="w-4 h-4 text-slate-500" />;
}

export const MealCard: React.FC<MealCardProps> = ({
  meal,
  onEdit,
  onDelete,
  isEditable = false,
}) => {
  const calories = meal.targetCalories || 0;
  const protein = meal.targetMacros?.protein || 0;
  const carbs = meal.targetMacros?.carbohydrates || 0;
  const fats = meal.targetMacros?.fats || 0;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-slate-300 transition-colors space-y-3.5">
      {/* Header Row: Icon + Name + Time on Left, Calories + Macros + Actions on Right */}
      <div className="flex flex-wrap items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
            {getMealIcon(meal.mealType)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">{meal.name}</h4>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                {meal.mealType}
              </span>
            </div>
            {meal.timeOfDay && (
              <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                <Clock className="w-3 h-3" />
                <span>{meal.timeOfDay}</span>
              </div>
            )}
          </div>
        </div>

        {/* Nutrition Summary + Actions */}
        <div className="flex items-center gap-3 ml-auto">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-900">{calories} kcal</span>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold">
              <span className="text-blue-600">P {protein}g</span>
              <span className="text-slate-300">·</span>
              <span className="text-amber-600">C {carbs}g</span>
              <span className="text-slate-300">·</span>
              <span className="text-rose-600">F {fats}g</span>
            </div>
          </div>

          {isEditable && (
            <div className="flex items-center gap-1 border-l border-slate-100 pl-2">
              {onEdit && (
                <button
                  type="button"
                  onClick={onEdit}
                  className="p-1 text-slate-400 hover:text-emerald-600 rounded transition-colors"
                  title="Edit meal"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                  title="Delete meal"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Food Items List */}
      {meal.foodEntries && meal.foodEntries.length > 0 ? (
        <div className="space-y-1 divide-y divide-slate-50">
          {meal.foodEntries.map((entry, idx) => (
            <FoodEntryRow key={`${entry.name}-${idx}`} entry={entry} isEditable={false} />
          ))}
        </div>
      ) : (
        <div className="text-xs text-slate-400 italic py-1">No food items itemized.</div>
      )}

      {meal.notes && (
        <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          {meal.notes}
        </p>
      )}
    </div>
  );
};
