import { cn } from '@/lib/utils';
import type { ChangeEvent } from 'react';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  showValue?: boolean;
  valueLabel?: string;
  className?: string;
}

export function Slider({
  value,
  min,
  max,
  step = 100,
  onChange,
  label,
  showValue = true,
  valueLabel,
  className,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-3">
          {label && (
            <span className="text-base font-medium text-text-primary">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-lg font-bold text-pink-500">
              {value.toLocaleString()} {valueLabel}
            </span>
          )}
        </div>
      )}

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className={cn(
            'w-full h-2 rounded-full appearance-none cursor-pointer',
            'bg-pink-100',
            '[&::-webkit-slider-thumb]:appearance-none',
            '[&::-webkit-slider-thumb]:w-6',
            '[&::-webkit-slider-thumb]:h-6',
            '[&::-webkit-slider-thumb]:rounded-full',
            '[&::-webkit-slider-thumb]:bg-gradient-to-br',
            '[&::-webkit-slider-thumb]:from-pink-500',
            '[&::-webkit-slider-thumb]:to-pink-400',
            '[&::-webkit-slider-thumb]:shadow-glow',
            '[&::-webkit-slider-thumb]:cursor-pointer',
            '[&::-webkit-slider-thumb]:transition-transform',
            '[&::-webkit-slider-thumb]:active:scale-110',
            '[&::-moz-range-thumb]:w-6',
            '[&::-moz-range-thumb]:h-6',
            '[&::-moz-range-thumb]:rounded-full',
            '[&::-moz-range-thumb]:bg-pink-500',
            '[&::-moz-range-thumb]:border-none',
            '[&::-moz-range-thumb]:cursor-pointer'
          )}
          style={{
            background: `linear-gradient(to right, #EC4899 0%, #EC4899 ${percentage}%, #FFE4EC ${percentage}%, #FFE4EC 100%)`,
          }}
        />

        {/* Min/Max labels */}
        <div className="flex justify-between mt-2 text-sm text-text-muted">
          <span>{min.toLocaleString()}</span>
          <span>{max.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
