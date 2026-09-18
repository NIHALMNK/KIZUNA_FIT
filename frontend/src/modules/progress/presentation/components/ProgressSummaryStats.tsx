'use client';

import React from 'react';
import { Dumbbell, Flame, Droplet, CheckCircle2, TrendingUp, Award } from 'lucide-react';
import { ProgressAnalytics } from '../../domain/types/progress.types';

interface ProgressSummaryStatsProps {
  data: ProgressAnalytics;
}

export const ProgressSummaryStats: React.FC<ProgressSummaryStatsProps> = ({ data }) => {
  const totalWorkoutsCompleted = data.workout.reduce((sum, b) => sum + b.sessionsCompleted, 0);
  const totalWorkoutsMissed = data.workout.reduce((sum, b) => sum + b.sessionsMissed, 0);
  const totalVolumeKg = data.workout.reduce((sum, b) => sum + b.totalVolumeLiftedKg, 0);
  const totalSets = data.workout.reduce((sum, b) => sum + b.totalSets, 0);

  const totalNutritionDaysLogged = data.nutrition.reduce((sum, b) => sum + b.daysLogged, 0);
  const totalNutritionDaysCompleted = data.nutrition.reduce((sum, b) => sum + b.daysCompleted, 0);

  const validCalories = data.nutrition
    .filter((b) => b.avgCaloriesConsumed !== null)
    .map((b) => b.avgCaloriesConsumed as number);
  const avgCalories =
    validCalories.length > 0
      ? Math.round(validCalories.reduce((a, b) => a + b, 0) / validCalories.length)
      : null;

  const validHydration = data.nutrition
    .filter((b) => b.avgHydrationMl !== null)
    .map((b) => b.avgHydrationMl as number);
  const avgHydration =
    validHydration.length > 0
      ? Math.round(validHydration.reduce((a, b) => a + b, 0) / validHydration.length)
      : null;

  const hasWorkoutData = totalWorkoutsCompleted + totalWorkoutsMissed > 0;
  const workoutRate = hasWorkoutData
    ? Math.round((totalWorkoutsCompleted / (totalWorkoutsCompleted + totalWorkoutsMissed)) * 100)
    : null;

  const hasNutritionData = totalNutritionDaysLogged > 0;
  const nutritionAdherenceRate = hasNutritionData
    ? Math.round((totalNutritionDaysCompleted / totalNutritionDaysLogged) * 100)
    : null;

  const stats = [
    {
      label: 'Workouts Completed',
      value: hasWorkoutData ? `${totalWorkoutsCompleted}` : '—',
      subtext: hasWorkoutData
        ? `${workoutRate}% adherence (${totalWorkoutsMissed} missed)`
        : 'No workout records logged',
      icon: Dumbbell,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      label: 'Total Volume Lifted',
      value: totalWorkoutsCompleted > 0 ? `${Math.round(totalVolumeKg).toLocaleString()} kg` : '—',
      subtext: totalWorkoutsCompleted > 0 ? `${totalSets} sets performed` : 'No volume recorded',
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Nutrition Adherence',
      value: hasNutritionData ? `${totalNutritionDaysCompleted} days` : '—',
      subtext: hasNutritionData
        ? `${totalNutritionDaysLogged} days logged (${nutritionAdherenceRate}% rate)`
        : 'No nutrition records logged',
      icon: Award,
      color: 'text-sky-500',
      bg: 'bg-sky-500/10',
    },
    {
      label: 'Avg Energy & Hydration',
      value: avgCalories ? `${avgCalories} kcal` : '—',
      subtext: avgHydration ? `${avgHydration} ml/day average` : 'No dietary intake logged',
      icon: Droplet,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                {stat.label}
              </span>
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-[var(--color-heading)] tracking-tight">
                {stat.value}
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-medium">
                {stat.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
