import { cn } from '@/lib/utils';
import { ACHIEVEMENTS, useAchievementsStore } from '@/lib/achievements';
import { useI18n } from '@/lib/i18n';

interface AchievementBadgeProps {
  className?: string;
}

export function AchievementBadge({ className }: AchievementBadgeProps) {
  const { unlockedIds } = useAchievementsStore();
  const { language } = useI18n();

  const unlockedCount = unlockedIds.length;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Progress header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-secondary">
          {language === 'en' ? 'Achievements' : 'Достижения'}
        </span>
        <span className="text-sm text-text-muted">
          {unlockedCount}/{totalCount}
        </span>
      </div>

      {/* Achievement grid */}
      <div className="grid grid-cols-3 gap-3">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlockedIds.includes(achievement.id);

          return (
            <div
              key={achievement.id}
              className={cn(
                'flex flex-col items-center p-3 rounded-xl',
                'transition-all duration-300',
                isUnlocked
                  ? 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200'
                  : 'bg-gray-100 border border-gray-200 opacity-50'
              )}
            >
              <span
                className={cn(
                  'text-2xl mb-1',
                  !isUnlocked && 'grayscale'
                )}
              >
                {achievement.emoji}
              </span>
              <span
                className={cn(
                  'text-xs text-center font-medium',
                  isUnlocked ? 'text-amber-700' : 'text-gray-400'
                )}
              >
                {achievement.name[language]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
