import { GlassCard } from '@/components/ui';
import { WeekChart } from '@/components/WeekChart';
import { useI18n } from '@/lib/i18n';
import { useHydration } from '@/hooks/useHydration';
import { formatRelativeDate, cn } from '@/lib/utils';

interface HistoryProps {
  goal: number;
}

export function History({ goal }: HistoryProps) {
  const { t } = useI18n();
  const { weekData, weeklyAverage, daysAtGoal, isLoading } = useHydration(goal);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">{t('history.noData')}</div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6 pb-24 animate-page-in">
      {/* Header */}
      <h1 className="text-2xl font-semibold text-text-primary mb-6">
        {t('history.title')}
      </h1>

      {/* Chart Card */}
      <GlassCard className="p-4 mb-6">
        <WeekChart data={weekData} goal={goal} />
      </GlassCard>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <GlassCard className="p-4 text-center">
          <p className="text-sm text-text-secondary mb-1">
            {t('history.weeklyAvg')}
          </p>
          <p className="text-2xl font-bold text-pink-500">
            {weeklyAverage.toLocaleString()}
            <span className="text-sm font-normal ml-1">{t('units.ml')}</span>
          </p>
        </GlassCard>

        <GlassCard className="p-4 text-center">
          <p className="text-sm text-text-secondary mb-1">
            {t('history.daysAtGoal')}
          </p>
          <p className="text-2xl font-bold text-success">
            {daysAtGoal}
            <span className="text-sm font-normal text-text-secondary ml-1">/ 7</span>
          </p>
        </GlassCard>
      </div>

      {/* Daily list */}
      <GlassCard className="divide-y divide-pink-100/50">
        {weekData
          .slice()
          .reverse()
          .map((day) => (
            <div
              key={day.date}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-text-primary font-medium">
                {formatRelativeDate(day.date, t)}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    'font-semibold',
                    day.goalReached ? 'text-success' : 'text-text-primary'
                  )}
                >
                  {day.total.toLocaleString()} {t('units.ml')}
                </span>
                {day.goalReached && <span>✓</span>}
              </div>
            </div>
          ))}
      </GlassCard>
    </div>
  );
}
