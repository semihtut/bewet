import { useState } from 'react';
import { GlassCard } from './ui/GlassCard';
import { Button } from './ui/Button';
import { useI18n } from '@/lib/i18n';
import { dismissA2HS } from '@/lib/utils';

interface A2HSCardProps {
  onDismiss?: () => void;
}

export function A2HSCard({ onDismiss }: A2HSCardProps) {
  const { t } = useI18n();
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    dismissA2HS();
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) return null;

  return (
    <GlassCard className="mx-4 p-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">📱</span>

        <div className="flex-1">
          <h3 className="font-semibold text-text-primary">
            {t('a2hs.title')}
          </h3>
          <p className="text-sm text-text-secondary mt-0.5 mb-3">
            {t('a2hs.subtitle')}
          </p>

          <ol className="space-y-1.5 text-sm text-text-primary">
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-600 text-xs flex items-center justify-center font-medium">
                1
              </span>
              {t('a2hs.step1')} <span className="text-lg">⎙</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-600 text-xs flex items-center justify-center font-medium">
                2
              </span>
              {t('a2hs.step2')}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-600 text-xs flex items-center justify-center font-medium">
                3
              </span>
              {t('a2hs.step3')}
            </li>
            <li className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-600 text-xs flex items-center justify-center font-medium">
                4
              </span>
              {t('a2hs.step4')}
            </li>
          </ol>

          <div className="flex gap-2 mt-4">
            <Button
              variant="primary"
              size="sm"
              onClick={handleDismiss}
            >
              {t('a2hs.done')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
            >
              {t('a2hs.skip')}
            </Button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
