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
  Legend,
} from 'recharts';
import { Dumbbell, TrendingUp } from 'lucide-react';
import { WorkoutProgressBucket } from '../../domain/types/progress.types';

interface WorkoutProgressChartProps {
  data: WorkoutProgressBucket[];
}

export const WorkoutProgressChart: React.FC<WorkoutProgressChartProps> = ({ data }) => {
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
      volumeKg: b.totalVolumeLiftedKg,
      completed: b.sessionsCompleted,
      missed: b.sessionsMissed,
      sets: b.totalSets,
      energy: b.avgEnergyLevel,
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
              <span className="text-[var(--color-text-secondary)]">Completed:</span>
              <span className="font-bold text-emerald-500">{p.completed} sessions</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Missed:</span>
              <span className="font-bold text-rose-500">{p.missed} sessions</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Volume:</span>
              <span className="font-bold text-amber-500">{p.volumeKg.toLocaleString()} kg</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-secondary)]">Sets:</span>
              <span className="font-semibold text-[var(--color-heading)]">{p.sets}</span>
            </div>
            {p.energy !== null && (
              <div className="flex items-center justify-between">
                <span className="text-[var(--color-text-secondary)]">Energy:</span>
                <span className="font-semibold text-sky-400">{p.energy} / 10</span>
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
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
            <Dumbbell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--color-heading)]">
              Workout Volume & Adherence
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Total volume lifted (kg) and session consistency
            </p>
          </div>
        </div>

        {chartData.length > 0 && (
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-amber-500">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span>Volume (kg)</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Sessions Completed</span>
            </div>
          </div>
        )}
      </div>

      {chartData.length === 0 ? (
        <div className="h-[280px] w-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-[var(--color-border)] rounded-xl">
          <Dumbbell className="w-8 h-8 text-[var(--color-text-muted)] mb-2 opacity-50" />
          <p className="text-sm font-medium text-[var(--color-heading)]">
            No workout sessions recorded
          </p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1 max-w-sm">
            No completed or missed workout records found for this period. Data will appear once
            workout sessions are executed.
          </p>
        </div>
      ) : (
        <div className="h-[280px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
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
                yAxisId="volume"
                stroke="var(--color-text-muted, #71717a)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`)}
              />

              <YAxis
                yAxisId="sessions"
                orientation="right"
                stroke="var(--color-text-muted, #71717a)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                yAxisId="volume"
                type="monotone"
                dataKey="volumeKg"
                name="Volume (kg)"
                stroke="#f59e0b"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#volumeGradient)"
                connectNulls={false}
              />

              <Area
                yAxisId="sessions"
                type="monotone"
                dataKey="completed"
                name="Completed Sessions"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#completedGradient)"
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
