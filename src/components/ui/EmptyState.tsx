import React from 'react';
import { PillButton } from './PillButton';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center rounded-[22px] border border-dashed border-white/[0.1] bg-white/[0.02] p-8 text-center ${className}`}>
      <div className="mb-3.5 flex h-12 w-12 items-center justify-center rounded-[15px] border border-white/[0.08] bg-white/[0.045] text-neutral-300">
        {icon}
      </div>
      <h4 className="mb-1 text-sm font-semibold tracking-tight text-white">{title}</h4>
      <p className="mb-4 max-w-xs text-xs leading-relaxed text-neutral-500">{description}</p>
      {actionText && onAction && (
        <PillButton variant="secondary" size="sm" onClick={onAction}>
          {actionText}
        </PillButton>
      )}
    </div>
  );
};
