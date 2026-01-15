import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useI18n, getDayKey } from '@/lib/i18n';
import type { DailySummary } from '@/types';

interface WeekChartProps {
  data: DailySummary[];
  goal: number;
}

export function WeekChart({ data, goal }: WeekChartProps) {
  const { t } = useI18n();

  // Find max value for scaling
  const maxValue = useMemo(() => {
    const dataMax = Math.max(...data.map((d) => d.total), 0);
    return Math.max(dataMax, goal);
  }, [data, goal]);

  // Get today's date string
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full">
      {/* Chart container */}
      <div className="relative h-40 flex items-end justify-between gap-2 px-2">
        {/* Goal line */}
        <div
          className="absolute left-0 right-0 border-t border-dashed border-text-muted/40"
          style={{
            bottom: `${(goal / maxValue) * 100}%`,
          }}
        />

        {/* Bars */}
        {data.map((day, index) => {
          const height = maxValue > 0 ? (day.total / maxValue) * 100 : 0;
          const isToday = day.date === today;
          const reachedGoal = day.total >= goal;

          return (
            <div
              key={day.date}
              className="flex-1 flex flex-col items-center"
            >
              {/* Bar container */}
              <div className="relative w-full h-32 flex items-end justify-center">
                <div
                  className={cn(
                    'w-full max-w-[32px] rounded-t-md origin-bottom',
                    'animate-bar-rise',
                    reachedGoal
                      ? 'bg-gradient-to-t from-success to-emerald-300'
                      : 'bg-gradient-to-t from-pink-500 to-pink-300',
                    isToday && 'ring-2 ring-pink-400 ring-offset-2'
                  )}
                  style={{
                    height: `${Math.max(height, 2)}%`,
                    animationDelay: `${index * 50}ms`,
                  }}
                />
              </div>

              {/* Day label */}
              <span
                className={cn(
                  'text-xs mt-2 font-medium',
                  isToday ? 'text-pink-500' : 'text-text-secondary'
                )}
              >
                {t(getDayKey(new Date(day.date)))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
