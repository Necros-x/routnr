import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  id?: string;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search skills, FIG codes, or elements...',
  onClear,
  id,
  autoFocus = false,
}) => {
  return (
    <div className="relative w-full">
      <div className="relative flex w-full items-center rounded-[17px] border border-white/[0.085] bg-white/[0.04] backdrop-blur-xl transition-all duration-200 focus-within:border-white/[0.2] focus-within:bg-white/[0.06]">
        <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-neutral-500" />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="h-11 w-full bg-transparent pl-10 pr-10 text-sm text-neutral-100 outline-none placeholder:text-neutral-600"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              onClear?.();
            }}
            className="absolute right-2.5 flex h-7 w-7 items-center justify-center rounded-[10px] text-neutral-500 transition-colors hover:bg-white/[0.06] hover:text-white"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
