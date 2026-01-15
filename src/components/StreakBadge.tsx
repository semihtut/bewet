import { cn } from '@/lib/utils';
import { useStreakStore, getStreakLevel, getStreakEmoji, getStreakTitle } from '@/lib/streak';
import { useI18n } from '@/lib/i18n';

interface StreakBadgeProps {
  className?: string;
  showTitle?: boolean;
}

export function StreakBadge({ className, showTitle = true }: StreakBadgeProps) {
  const { currentStreak, longestStreak } = useStreakStore();
  const { language } = useI18n();

  const level = getStreakLevel(currentStreak);
  const emoji = getStreakEmoji(level);
  const title = getStreakTitle(level, language);

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-full',
        'bg-gradient-to-r from-amber-50 to-orange-50',
        'border border-amber-200/50',
        className
      )}
    >
      <span className="text-xl">{emoji}</span>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-amber-700">
          {currentStreak} {language === 'en' ? 'days' : 'дн.'}
        </span>
        {showTitle && (
          <span className="text-xs text-amber-600">{title}</span>
        )}
      </div>
      {currentStreak > 0 && currentStreak === longestStreak && (
        <span className="text-xs">🏆</span>
      )}
    </div>
  );
}
