import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
  count?: number | string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionText,
  onAction,
  count,
  className = '',
}) => {
  return (
    <div className={`mb-3.5 flex items-baseline justify-between gap-3 ${className}`}>
      <div className="flex min-w-0 items-center gap-2">
        <h2 className="truncate text-base font-semibold tracking-[-0.02em] text-white">{title}</h2>
        {count !== undefined && (
          <span className="rounded-md border border-white/[0.07] bg-white/[0.04] px-2 py-0.5 text-[10px] font-mono text-neutral-500">
            {count}
          </span>
        )}
        {subtitle && <span className="hidden truncate text-xs text-neutral-500 sm:inline">· {subtitle}</span>}
      </div>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 text-xs font-medium text-neutral-500 transition-colors hover:text-white"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
