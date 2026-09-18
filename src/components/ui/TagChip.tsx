import React from 'react';

interface TagChipProps {
  children: React.ReactNode;
  variant?: 'default' | 'difficulty' | 'group' | 'subtle' | 'accent';
  size?: 'xs' | 'sm';
  className?: string;
}

export const TagChip: React.FC<TagChipProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-[11px]',
  };

  const variantClasses = {
    default: 'border-white/[0.08] bg-white/[0.045] text-neutral-300',
    difficulty: 'border-white bg-white text-black font-bold',
    group: 'border-white/[0.09] bg-white/[0.045] text-neutral-300',
    subtle: 'border-white/[0.07] bg-transparent text-neutral-500',
    accent: 'border-white/[0.13] bg-white/[0.08] text-white',
  };

  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-[9px] border font-mono font-medium tracking-tight ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
