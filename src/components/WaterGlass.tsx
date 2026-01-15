import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface WaterGlassProps {
  percentage: number;
  value: number;
  max: number;
  className?: string;
}

export function WaterGlass({ percentage, value, max, className }: WaterGlassProps) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Animate percentage changes
  useEffect(() => {
    setIsAnimating(true);
    const duration = 800;
    const startTime = performance.now();
    const startValue = animatedPercentage;
    const diff = percentage - startValue;

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPercentage(startValue + diff * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    }

    requestAnimationFrame(animate);
  }, [percentage]);

  const fillHeight = Math.min(animatedPercentage, 100);
  const isComplete = percentage >= 100;

  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      {/* Glass container */}
      <div className="relative w-40 h-56">
        {/* Glass shape */}
        <svg viewBox="0 0 160 224" className="w-full h-full">
          <defs>
            {/* Water gradient */}
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isComplete ? '#34D399' : '#60A5FA'} />
              <stop offset="100%" stopColor={isComplete ? '#10B981' : '#3B82F6'} />
            </linearGradient>

            {/* Glass gradient */}
            <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
            </linearGradient>

            {/* Clip path for water */}
            <clipPath id="glassClip">
              <path d="M20 20 L25 204 Q30 214 80 214 Q130 214 135 204 L140 20 Q140 10 80 10 Q20 10 20 20 Z" />
            </clipPath>
          </defs>

          {/* Glass background */}
          <path
            d="M20 20 L25 204 Q30 214 80 214 Q130 214 135 204 L140 20 Q140 10 80 10 Q20 10 20 20 Z"
            fill="rgba(255,255,255,0.2)"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
          />

          {/* Water fill */}
          <g clipPath="url(#glassClip)">
            <rect
              x="15"
              y={214 - (fillHeight * 1.94)}
              width="130"
              height={fillHeight * 1.94 + 10}
              fill="url(#waterGradient)"
              className="transition-all duration-300"
            />

            {/* Animated waves */}
            <g className={cn(isAnimating && 'animate-pulse')}>
              <path
                d={`M15 ${214 - (fillHeight * 1.94)}
                    Q40 ${210 - (fillHeight * 1.94)} 80 ${214 - (fillHeight * 1.94)}
                    Q120 ${218 - (fillHeight * 1.94)} 145 ${214 - (fillHeight * 1.94)}`}
                fill="url(#waterGradient)"
                opacity="0.8"
              >
                <animate
                  attributeName="d"
                  dur="2s"
                  repeatCount="indefinite"
                  values={`
                    M15 ${214 - (fillHeight * 1.94)} Q40 ${210 - (fillHeight * 1.94)} 80 ${214 - (fillHeight * 1.94)} Q120 ${218 - (fillHeight * 1.94)} 145 ${214 - (fillHeight * 1.94)};
                    M15 ${214 - (fillHeight * 1.94)} Q40 ${218 - (fillHeight * 1.94)} 80 ${214 - (fillHeight * 1.94)} Q120 ${210 - (fillHeight * 1.94)} 145 ${214 - (fillHeight * 1.94)};
                    M15 ${214 - (fillHeight * 1.94)} Q40 ${210 - (fillHeight * 1.94)} 80 ${214 - (fillHeight * 1.94)} Q120 ${218 - (fillHeight * 1.94)} 145 ${214 - (fillHeight * 1.94)}
                  `}
                />
              </path>
            </g>

            {/* Bubbles when animating */}
            {isAnimating && (
              <>
                <circle cx="50" cy="180" r="4" fill="rgba(255,255,255,0.6)">
                  <animate attributeName="cy" from="200" to="50" dur="1s" repeatCount="1" />
                  <animate attributeName="opacity" from="0.6" to="0" dur="1s" repeatCount="1" />
                </circle>
                <circle cx="80" cy="160" r="3" fill="rgba(255,255,255,0.5)">
                  <animate attributeName="cy" from="200" to="30" dur="1.2s" repeatCount="1" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="1.2s" repeatCount="1" />
                </circle>
                <circle cx="110" cy="170" r="5" fill="rgba(255,255,255,0.4)">
                  <animate attributeName="cy" from="200" to="40" dur="0.8s" repeatCount="1" />
                  <animate attributeName="opacity" from="0.4" to="0" dur="0.8s" repeatCount="1" />
                </circle>
              </>
            )}
          </g>

          {/* Glass shine */}
          <path
            d="M30 30 L32 180 Q32 185 35 185 L35 30 Q35 25 30 25 Z"
            fill="url(#glassGradient)"
            opacity="0.6"
          />

          {/* Glass rim highlight */}
          <ellipse
            cx="80"
            cy="15"
            rx="55"
            ry="8"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />
        </svg>

        {/* Percentage markers */}
        <div className="absolute right-0 top-4 bottom-4 flex flex-col justify-between text-xs text-text-muted pr-1">
          <span>100%</span>
          <span>75%</span>
          <span>50%</span>
          <span>25%</span>
          <span>0%</span>
        </div>
      </div>

      {/* Value display */}
      <div className="mt-4 text-center">
        <span className={cn(
          'text-4xl font-bold',
          isComplete ? 'text-success' : 'text-pink-500'
        )}>
          {Math.round(animatedPercentage)}%
        </span>
        <p className="text-text-secondary mt-1">
          {value.toLocaleString()} / {max.toLocaleString()} ml
        </p>
      </div>
    </div>
  );
}
