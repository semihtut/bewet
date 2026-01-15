import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showPercentage?: boolean;
  unit?: string;
}

export function ProgressRing({
  value,
  max,
  size = 200,
  strokeWidth = 12,
  className,
  showPercentage = true,
  unit = 'ml',
}: ProgressRingProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValue = useRef(value);

  // Calculate dimensions
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  // Calculate percentage and offset
  const percentage = Math.min((animatedValue / max) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  // Animate value changes
  useEffect(() => {
    if (value === prevValue.current) return;

    setIsAnimating(true);
    const start = prevValue.current;
    const diff = value - start;
    const duration = 600;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(Math.round(start + diff * eased));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
        prevValue.current = value;
      }
    }

    requestAnimationFrame(animate);
  }, [value]);

  // Initialize with current value
  useEffect(() => {
    setAnimatedValue(value);
    prevValue.current = value;
  }, []);

  const isComplete = percentage >= 100;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        isAnimating && 'animate-ring-pulse',
        isComplete && 'animate-celebrate',
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#FFE4EC"
          strokeWidth={strokeWidth}
        />

        {/* Progress fill */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={isComplete ? '#34D399' : 'url(#progressGradient)'}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-text-primary">
          {animatedValue.toLocaleString()}
        </span>
        <span className="text-sm text-text-secondary mt-1">
          / {max.toLocaleString()} {unit}
        </span>
        {showPercentage && (
          <span
            className={cn(
              'text-lg font-semibold mt-2',
              isComplete ? 'text-success' : 'text-pink-500'
            )}
          >
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    </div>
  );
}
