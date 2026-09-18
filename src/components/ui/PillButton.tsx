import React from 'react';

interface PillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
}

export const PillButton: React.FC<PillButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-9 px-3.5 text-xs gap-1.5 font-medium',
    md: 'h-11 px-4.5 text-sm gap-2 font-semibold',
    lg: 'h-12 px-5.5 text-sm gap-2.5 font-semibold',
  };

  const variantClasses = {
    primary:
      'bg-white text-black hover:bg-neutral-200 shadow-[0_8px_24px_rgba(255,255,255,0.08)]',
    secondary:
      'border border-white/[0.1] bg-white/[0.06] text-white hover:bg-white/[0.1]',
    outline:
      'border border-white/[0.14] bg-transparent text-neutral-200 hover:border-white/[0.24] hover:bg-white/[0.035]',
    ghost:
      'bg-transparent text-neutral-400 hover:bg-white/[0.05] hover:text-white',
    danger:
      'border border-red-400/20 bg-red-400/10 text-red-300 hover:bg-red-400/15',
  };

  return (
    <button
      disabled={disabled}
      className={`relative inline-flex items-center justify-center rounded-[14px] whitespace-nowrap transition-[transform,background-color,border-color,color] duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="flex shrink-0 items-center">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="flex shrink-0 items-center">{icon}</span>}
    </button>
  );
};
