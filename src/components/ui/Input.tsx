import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  suffix?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, suffix, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm text-text-secondary mb-1"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-3.5',
              'bg-white border-[1.5px] border-pink-100 rounded-md',
              'text-base text-text-primary',
              'placeholder:text-text-muted',
              'transition-all duration-200',
              'focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/15',
              error && 'border-error focus:border-error focus:ring-error/15',
              suffix && 'pr-12',
              className
            )}
            {...props}
          />

          {suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">
              {suffix}
            </span>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
