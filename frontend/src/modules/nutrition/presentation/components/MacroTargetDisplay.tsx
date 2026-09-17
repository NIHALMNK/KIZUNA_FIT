import React from 'react';
import { MacroNutrients } from '../../domain/types/nutrition.types';
import { Flame } from 'lucide-react';

interface MacroTargetDisplayProps {
  macros?: MacroNutrients | null;
  targetCalories?: number | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  consumedMacros?: MacroNutrients | null;
  consumedCalories?: number | null;
  variant?: 'inline' | 'rings' | 'summary-row';
}

export const MacroTargetDisplay: React.FC<MacroTargetDisplayProps> = ({
  macros,
  targetCalories,
  size = 'md',
  className = '',
  consumedMacros,
  consumedCalories,
  variant = 'inline',
}) => {
  const calories = targetCalories ?? macros?.calories ?? 0;
  const protein = macros?.protein ?? 0;
  const carbs = macros?.carbohydrates ?? 0;
  const fats = macros?.fats ?? 0;

  const isCompare = consumedMacros !== undefined || consumedCalories !== undefined;

  // Ring Variant for Daily Nutrition Targets widget
  if (variant === 'rings') {
    const items = [
      {
        label: 'Calories',
        value: isCompare ? `${consumedCalories ?? 0}` : `${calories}`,
        unit: 'kcal',
        color: '#059669', // Emerald
        bgTrack: '#E2E8F0',
        percent:
          isCompare && calories > 0
            ? Math.min(100, Math.round(((consumedCalories ?? 0) / calories) * 100))
            : 100,
      },
      {
        label: 'Protein',
        value: isCompare ? `${consumedMacros?.protein ?? 0}` : `${protein}`,
        unit: 'g',
        color: '#2563EB', // Blue
        bgTrack: '#E2E8F0',
        percent:
          isCompare && protein > 0
            ? Math.min(100, Math.round(((consumedMacros?.protein ?? 0) / protein) * 100))
            : 100,
      },
      {
        label: 'Carbs',
        value: isCompare ? `${consumedMacros?.carbohydrates ?? 0}` : `${carbs}`,
        unit: 'g',
        color: '#D97706', // Amber
        bgTrack: '#E2E8F0',
        percent:
          isCompare && carbs > 0
            ? Math.min(100, Math.round(((consumedMacros?.carbohydrates ?? 0) / carbs) * 100))
            : 100,
      },
      {
        label: 'Fats',
        value: isCompare ? `${consumedMacros?.fats ?? 0}` : `${fats}`,
        unit: 'g',
        color: '#E11D48', // Rose
        bgTrack: '#E2E8F0',
        percent:
          isCompare && fats > 0
            ? Math.min(100, Math.round(((consumedMacros?.fats ?? 0) / fats) * 100))
            : 100,
      },
    ];

    return (
      <div className={`grid grid-cols-4 gap-2 ${className}`}>
        {items.map((item) => {
          const radius = 26;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (item.percent / 100) * circumference;

          return (
            <div key={item.label} className="flex flex-col items-center text-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-16 h-16 -rotate-90 transform" viewBox="0 0 64 64">
                  <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    stroke={item.bgTrack}
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r={radius}
                    stroke={item.color}
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-slate-900 leading-none">
                    {item.value}
                  </span>
                  <span className="text-[9px] font-medium text-slate-500 leading-none mt-0.5">
                    {item.unit}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-600 mt-1.5">{item.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  // Summary Row (clean horizontal blocks)
  if (variant === 'summary-row') {
    return (
      <div className={`flex flex-wrap items-center gap-3 ${className}`}>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
          <Flame className="w-4 h-4 text-emerald-600" />
          <span>{isCompare ? `${consumedCalories ?? 0} / ${calories}` : calories} kcal</span>
        </div>
        <span className="text-slate-300">•</span>
        <div className="text-xs font-medium text-slate-600">
          <span className="font-bold text-blue-600">P</span>{' '}
          {isCompare ? `${consumedMacros?.protein ?? 0} / ${protein}` : protein}g
        </div>
        <span className="text-slate-300">•</span>
        <div className="text-xs font-medium text-slate-600">
          <span className="font-bold text-amber-600">C</span>{' '}
          {isCompare ? `${consumedMacros?.carbohydrates ?? 0} / ${carbs}` : carbs}g
        </div>
        <span className="text-slate-300">•</span>
        <div className="text-xs font-medium text-slate-600">
          <span className="font-bold text-rose-600">F</span>{' '}
          {isCompare ? `${consumedMacros?.fats ?? 0} / ${fats}` : fats}g
        </div>
      </div>
    );
  }

  // Default Inline Variant (Clean, high readability, subtle colors)
  const textSize = size === 'sm' ? 'text-xs' : 'text-xs sm:text-sm';

  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${textSize} ${className}`}>
      {/* Calories */}
      <div className="flex items-center gap-1 text-slate-900 font-bold">
        <Flame className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>{isCompare ? `${consumedCalories ?? 0} / ${calories}` : calories} kcal</span>
      </div>

      <span className="text-slate-300">•</span>

      {/* Protein */}
      <div className="flex items-center gap-1">
        <span className="font-bold text-blue-600">P</span>
        <span className="font-semibold text-slate-700">
          {isCompare ? `${consumedMacros?.protein ?? 0} / ${protein}` : protein}g
        </span>
      </div>

      <span className="text-slate-300">•</span>

      {/* Carbs */}
      <div className="flex items-center gap-1">
        <span className="font-bold text-amber-600">C</span>
        <span className="font-semibold text-slate-700">
          {isCompare ? `${consumedMacros?.carbohydrates ?? 0} / ${carbs}` : carbs}g
        </span>
      </div>

      <span className="text-slate-300">•</span>

      {/* Fats */}
      <div className="flex items-center gap-1">
        <span className="font-bold text-rose-600">F</span>
        <span className="font-semibold text-slate-700">
          {isCompare ? `${consumedMacros?.fats ?? 0} / ${fats}` : fats}g
        </span>
      </div>
    </div>
  );
};
