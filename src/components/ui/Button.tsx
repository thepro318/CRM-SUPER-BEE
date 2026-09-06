import { ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'font-medium rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
        {
          // Variants
          'bg-navy-600 text-white hover:bg-navy-700 disabled:bg-navy-300 focus-visible:outline-navy-600':
            variant === 'primary',
          'bg-slate-200 text-slate-900 hover:bg-slate-300 disabled:bg-slate-100 focus-visible:outline-slate-400':
            variant === 'secondary',
          'bg-transparent text-navy-600 hover:bg-navy-50 disabled:text-slate-400 focus-visible:outline-navy-600':
            variant === 'ghost',
          'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 focus-visible:outline-red-600':
            variant === 'danger',
        },
        {
          // Sizes
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        fullWidth && 'w-full',
        disabled && 'cursor-not-allowed opacity-60',
        className
      )}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
};
