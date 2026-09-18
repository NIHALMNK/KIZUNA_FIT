'use client';

import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Utensils } from 'lucide-react';
import { NutritionProgressBucket } from '../../domain/types/progress.types';

interface NutritionProgressChartProps {
  data: NutritionProgressBucket[];
}

export const NutritionProgressChart: React.FC<NutritionProgressChartProps> = ({ data }) => {
  const chartData = data.map((b) => {
    const label = (() => {
      try {
        const d = new Date(b.bucketStart);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } catch {
        return b.bucketStart;
      }
    })();

    return {
      date: label,
      fullStart: b.bucketStart,
      fullEnd: b.bucketEnd,
      daysCompleted: b.daysCompleted,
      daysLogged: b.daysLogged,
      mealsCompleted: b.mealsCompleted,
      mealsTracked: b.mealsTracked,
      calories: b.avgCaloriesConsumed,
      hydration: b.avgHydrationMl,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="p-3.5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-xl text-xs space-y-2 min-w-[180px]">
          <p className="font-bold text-[var(--color-heading)] border-b border-[var(--color-border)] pb-1.5">
            {p.fullStart} – {p.fullEnd}
          </p>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Days Completed:</span>
              <span className="font-bold text-sky-500">{p.daysCompleted} days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Days Logged:</span>
              <span className="font-semibold text-[var(--color-heading)]">{p.daysLogged} days</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Meals Completed:</span>
              <span className="font-semibold text-emerald-400">
                {p.mealsCompleted} / {p.mealsTracked}
              </span>
            </div>
            {p.calories !== null && p.calories !== undefined ? (
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">Avg Calories:</span>
                <span className="font-bold text-amber-400">{p.calories} kcal</span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">Avg Calories:</span>
                <span className="italic text-[var(--color-text-muted)]">Not logged</span>
              </div>
            )}
            {p.hydration !== null && p.hydration !== undefined ? (
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">Avg Hydration:</span>
                <span className="font-semibold text-blue-400">{p.hydration} ml</span>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">Avg Hydration:</span>
                <span className="italic text-[var(--color-text-muted)]">Not logged</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--color-heading)]">
              Nutrition Adherence & Calories
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Prescribed days completed and average daily calorie intake
            </p>
          </div>
        </div>

        {chartData.length > 0 && (
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-sky-500">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
              <span>Days Completed</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-500">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>Avg Calories</span>
            </div>
          </div>
        )}
      </div>

      {chartData.length === 0 ? (
        <div className="h-[280px] w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-[var(--color-border)] rounded-xl">
          <Utensils className="w-8 h-8 text-[var(--color-text-muted)] mb-2 opacity-50" />
          <p className="text-sm font-medium text-[var(--color-heading)]">
            No nutrition logs recorded
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-sm">
            No nutrition completion records found for this period. Data will appear once meals or
            hydration are logged.
          </p>
        </div>
      ) : (
        <div className="h-[280px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="nutritionDaysGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="nutritionCaloriesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--color-border, #27272a)"
                opacity={0.6}
              />

              <XAxis
                dataKey="date"
                stroke="var(--color-text-muted, #71717a)"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: 'var(--color-border, #27272a)' }}
              />

              <YAxis
                yAxisId="days"
                stroke="var(--color-text-muted, #71717a)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />

              <YAxis
                yAxisId="calories"
                orientation="right"
                stroke="var(--color-text-muted, #71717a)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`)}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                yAxisId="days"
                type="monotone"
                dataKey="daysCompleted"
                name="Days Completed"
                stroke="#0ea5e9"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#nutritionDaysGradient)"
              />

              <Area
                yAxisId="calories"
                type="monotone"
                dataKey="calories"
                name="Avg Calories"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#nutritionCaloriesGradient)"
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
