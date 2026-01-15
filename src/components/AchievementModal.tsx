import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/Button';
import { getAchievement, type AchievementId } from '@/lib/achievements';
import { useI18n } from '@/lib/i18n';

interface AchievementModalProps {
  achievementId: AchievementId | null;
  onClose: () => void;
}

export function AchievementModal({ achievementId, onClose }: AchievementModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { language } = useI18n();

  const achievement = achievementId ? getAchievement(achievementId) : null;

  useEffect(() => {
    if (achievementId) {
      setIsVisible(true);
    }
  }, [achievementId]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!achievementId || !achievement) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'relative bg-white rounded-lg p-6 max-w-sm w-full',
          'shadow-xl border border-amber-200',
          'transform transition-all duration-300',
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        )}
      >
        {/* Trophy icon */}
        <div className="text-center mb-2">
          <span className="text-5xl">🏆</span>
        </div>

        {/* Title */}
        <h2 className="text-center text-lg font-bold text-amber-600 mb-2">
          {language === 'en' ? 'Achievement Unlocked!' : 'Достижение разблокировано!'}
        </h2>

        {/* Achievement emoji */}
        <div className="text-center mb-3">
          <span className="text-6xl">{achievement.emoji}</span>
        </div>

        {/* Achievement name */}
        <h3 className="text-center text-xl font-bold text-text-primary mb-2">
          {achievement.name[language]}
        </h3>

        {/* Description */}
        <p className="text-center text-text-secondary mb-6">
          {achievement.description[language]}
        </p>

        {/* Sparkles */}
        <div className="absolute -top-2 -left-2 text-2xl animate-bounce">✨</div>
        <div className="absolute -top-2 -right-2 text-2xl animate-bounce" style={{ animationDelay: '0.15s' }}>✨</div>
        <div className="absolute -bottom-2 -left-2 text-2xl animate-bounce" style={{ animationDelay: '0.3s' }}>✨</div>
        <div className="absolute -bottom-2 -right-2 text-2xl animate-bounce" style={{ animationDelay: '0.45s' }}>✨</div>

        {/* Close button */}
        <Button fullWidth onClick={handleClose}>
          {language === 'en' ? 'Awesome!' : 'Круто!'}
        </Button>
      </div>
    </div>
  );
}
