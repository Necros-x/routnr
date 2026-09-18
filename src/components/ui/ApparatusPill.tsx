import React from 'react';
import { Apparatus } from '../../types/gymnastics';

interface ApparatusPillProps {
  apparatus: Apparatus;
  size?: 'sm' | 'md';
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export const getApparatusCode = (apparatus: Apparatus): string => {
  switch (apparatus) {
    case 'Floor Exercise': return 'FX';
    case 'Pommel Horse': return 'PH';
    case 'Still Rings': return 'SR';
    case 'Vault': return 'VT';
    case 'Parallel Bars': return 'PB';
    case 'High Bar': return 'HB';
    case 'Balance Beam': return 'BB';
    case 'Uneven Bars': return 'UB';
    default: return 'GYM';
  }
};

export const ApparatusPill: React.FC<ApparatusPillProps> = ({
  apparatus,
  size = 'md',
  active = false,
  onClick,
  className = '',
}) => {
  const code = getApparatusCode(apparatus);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`inline-flex items-center gap-1.5 rounded-[12px] border font-medium transition-all duration-150 ${
        size === 'sm' ? 'h-7 px-2.5 text-xs' : 'h-8 px-3 text-xs'
      } ${
        active
          ? 'border-white bg-white text-black shadow-sm'
          : 'border-white/[0.08] bg-white/[0.04] text-neutral-400 hover:border-white/[0.13] hover:bg-white/[0.065] hover:text-white'
      } ${!onClick ? 'cursor-default' : 'cursor-pointer'} ${className}`}
    >
      <span className="font-mono text-[9px] font-bold opacity-70">{code}</span>
      <span className="truncate">{apparatus}</span>
    </button>
  );
};
