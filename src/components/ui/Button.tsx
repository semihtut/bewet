import { cn } from '@/lib/utils';
import { haptic } from '@/lib/utils';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  onClick,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = `
    relative overflow-hidden
    font-semibold
    rounded-sm
    transition-all duration-150
    active:scale-[0.97]
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
    focus:outline-none focus:ring-2 focus:ring-pink-400/50 focus:ring-offset-2
  `;

  const variants = {
    primary: `
      bg-gradient-to-br from-pink-500 to-pink-400
      text-white
      shadow-glow
      hover:from-pink-600 hover:to-pink-500
      active:shadow-md
    `,
    secondary: `
      bg-pink-50
      text-pink-600
      border border-pink-100
      hover:bg-pink-100
    `,
    ghost: `
      bg-transparent
      text-pink-500
      hover:bg-pink-50
    `,
    danger: `
      bg-error/10
      text-error
      border border-error/20
      hover:bg-error/20
    `,
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-5 py-3 text-base min-h-[48px]',
    lg: 'px-6 py-4 text-lg min-h-[56px]',
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      haptic();
      onClick?.(e);
    }
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {children}

      {/* Ripple effect overlay */}
      <span
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <span className="absolute inset-0 bg-white/20 opacity-0 active:animate-ripple" />
      </span>
    </button>
  );
}
