import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'subtle' | 'elevated' | 'interactive' | 'active';
  className?: string;
  onClick?: () => void;
  id?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  variant = 'subtle',
  className = '',
  onClick,
  id,
  ...props
}) => {
  const baseClasses =
    'relative overflow-hidden rounded-[22px] border backdrop-blur-[18px] transition-[transform,background-color,border-color,box-shadow] duration-200';

  const variantClasses = {
    subtle:
      'border-white/[0.075] bg-white/[0.028] shadow-[0_16px_50px_rgba(0,0,0,0.16)]',
    elevated:
      'border-white/[0.11] bg-white/[0.05] shadow-[0_20px_60px_rgba(0,0,0,0.26)]',
    interactive:
      'cursor-pointer border-white/[0.08] bg-white/[0.035] shadow-[0_14px_42px_rgba(0,0,0,0.18)] hover:border-white/[0.14] hover:bg-white/[0.06] active:scale-[0.99]',
    active:
      'border-white/[0.2] bg-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.22)]',
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent" />
      {children}
    </div>
  );
};
