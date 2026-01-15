import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/Button';

interface LoveNoteModalProps {
  isOpen: boolean;
  message: string;
  milestone: number;
  onClose: () => void;
}

export function LoveNoteModal({ isOpen, message, milestone, onClose }: LoveNoteModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!isOpen && !isVisible) return null;

  const getMilestoneEmoji = () => {
    switch (milestone) {
      case 25: return '🌟';
      case 50: return '⭐';
      case 75: return '🌈';
      case 100: return '🎉';
      default: return '💧';
    }
  };

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
          'shadow-xl border border-pink-100',
          'transform transition-all duration-300',
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        )}
      >
        {/* Celebration emoji */}
        <div className="text-center mb-4">
          <span className="text-6xl">{getMilestoneEmoji()}</span>
        </div>

        {/* Milestone badge */}
        <div className="text-center mb-3">
          <span className="inline-block px-4 py-1 bg-pink-100 text-pink-600 rounded-full font-bold">
            {milestone}%
          </span>
        </div>

        {/* Love message */}
        <p className="text-center text-xl font-medium text-text-primary mb-6">
          {message}
        </p>

        {/* Decorative hearts */}
        <div className="absolute -top-2 -left-2 text-2xl animate-bounce">💕</div>
        <div className="absolute -top-2 -right-2 text-2xl animate-bounce" style={{ animationDelay: '0.2s' }}>💕</div>

        {/* Close button */}
        <Button fullWidth onClick={handleClose}>
          💖
        </Button>
      </div>
    </div>
  );
}
