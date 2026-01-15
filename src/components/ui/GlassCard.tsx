import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'flat';
  onClick?: () => void;
}

export function GlassCard({
  children,
  className,
  variant = 'default',
  onClick,
}: GlassCardProps) {
  const baseStyles = `
    rounded-md
    border border-pink-200/30
    backdrop-blur-xl
    transition-all duration-200
  `;

  const variants = {
    default: 'bg-white/70 shadow-lg',
    elevated: 'bg-white/80 shadow-lg hover:shadow-xl',
    flat: 'bg-white/60 shadow-sm',
  };

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
