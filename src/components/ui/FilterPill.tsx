import React from 'react';

interface FilterPillProps {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  id?: string;
}

export const FilterPill: React.FC<FilterPillProps> = ({
  label,
  active,
  onClick,
  count,
  icon,
  size = 'md',
  id,
}) => {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-[13px] border font-medium transition-all duration-150 ${
        size === 'sm' ? 'h-8 px-3 text-xs' : 'h-9 px-3.5 text-xs sm:text-sm'
      } ${
        active
          ? 'border-white bg-white text-black shadow-sm'
          : 'border-white/[0.08] bg-white/[0.035] text-neutral-400 hover:border-white/[0.13] hover:bg-white/[0.06] hover:text-white'
      }`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
      {typeof count === 'number' && (
        <span
          className={`rounded-md px-1.5 py-0.5 text-[9px] font-mono ${
            active ? 'bg-black/[0.07] text-black' : 'bg-white/[0.06] text-neutral-500'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};
