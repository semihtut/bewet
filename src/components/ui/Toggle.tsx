import { cn } from '@/lib/utils';
import { haptic } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
}: ToggleProps) {
  const handleChange = () => {
    if (!disabled) {
      haptic();
      onChange(!checked);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={handleChange}
      className={cn(
        'flex items-center justify-between w-full py-3',
        'text-left transition-opacity',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <div className="flex-1 mr-4">
        {label && (
          <span className="block text-base font-medium text-text-primary">
            {label}
          </span>
        )}
        {description && (
          <span className="block text-sm text-text-secondary mt-0.5">
            {description}
          </span>
        )}
      </div>

      <div
        className={cn(
          'relative w-12 h-7 rounded-full transition-colors duration-200',
          checked ? 'bg-pink-500' : 'bg-gray-200'
        )}
      >
        <div
          className={cn(
            'absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm',
            'transition-transform duration-200',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          )}
        />
      </div>
    </button>
  );
}
