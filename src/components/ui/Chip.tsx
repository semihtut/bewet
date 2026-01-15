import { cn } from '@/lib/utils';
import { haptic } from '@/lib/utils';
import type { ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  selected?: boolean;
  variant?: 'default' | 'outline';
  onClick?: () => void;
  className?: string;
}

export function Chip({
  children,
  selected = false,
  variant = 'default',
  onClick,
  className,
}: ChipProps) {
  const baseStyles = `
    inline-flex items-center justify-center
    px-5 py-3
    min-w-[72px]
    rounded-full
    font-semibold text-base
    transition-all duration-150
    active:scale-[0.95]
    select-none
    cursor-pointer
  `;

  const variants = {
    default: cn(
      'bg-white border-[1.5px]',
      selected
        ? 'border-pink-400 bg-pink-50 text-pink-600'
        : 'border-pink-100 text-text-primary hover:border-pink-200'
    ),
    outline: cn(
      'bg-transparent border-[1.5px] border-dashed',
      selected
        ? 'border-pink-400 text-pink-600'
        : 'border-pink-200 text-text-secondary hover:border-pink-300'
    ),
  };

  const handleClick = () => {
    haptic();
    onClick?.();
  };

  return (
    <button
      type="button"
      className={cn(baseStyles, variants[variant], className)}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}
