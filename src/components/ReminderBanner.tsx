import { useI18n } from '@/lib/i18n';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';

interface ReminderBannerProps {
  onSnooze: () => void;
  onDismiss: () => void;
}

export function ReminderBanner({ onSnooze, onDismiss }: ReminderBannerProps) {
  const { t } = useI18n();

  return (
    <div
      className={cn(
        'mx-4 mb-4 p-4',
        'bg-gradient-to-r from-amber-50 to-yellow-50',
        'border-l-4 border-warning',
        'rounded-sm shadow-md',
        'animate-slide-in-down animate-gentle-pulse'
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">💧</span>

        <div className="flex-1">
          <h3 className="font-semibold text-text-primary">
            {t('reminder.title')}
          </h3>
          <p className="text-sm text-text-secondary mt-0.5">
            {t('reminder.subtitle')}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-3 ml-9">
        <Button
          variant="secondary"
          size="sm"
          onClick={onSnooze}
        >
          {t('reminder.snooze')}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
        >
          {t('reminder.dismiss')}
        </Button>
      </div>
    </div>
  );
}
