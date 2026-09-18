import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  Award,
  RotateCcw,
  Sparkles,
  Check,
} from 'lucide-react';
import { DIFFICULTY_LEVELS, ELEMENT_GROUPS } from '../data/mockSkills';

interface SkillSearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedGroup: number | 'All';
  onSelectGroup: (group: number | 'All') => void;
  selectedDifficulty: string;
  onSelectDifficulty: (difficulty: string) => void;
  selectedApparatus?: string;
  onSelectApparatus?: (apparatus: string) => void;
  totalResultsCount: number;
  totalSkillsCount: number;
  onClearAll: () => void;
  showExtendedFilters: boolean;
  onToggleExtendedFilters: () => void;
}

export const SkillSearchFilterBar: React.FC<SkillSearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedGroup,
  onSelectGroup,
  selectedDifficulty,
  onSelectDifficulty,
  totalResultsCount,
  totalSkillsCount,
  onClearAll,
  showExtendedFilters,
  onToggleExtendedFilters,
}) => {
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);
  const [isDifficultyDropdownOpen, setIsDifficultyDropdownOpen] = useState(false);

  const groupDropdownRef = useRef<HTMLDivElement>(null);
  const diffDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        groupDropdownRef.current &&
        !groupDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGroupDropdownOpen(false);
      }
      if (
        diffDropdownRef.current &&
        !diffDropdownRef.current.contains(event.target as Node)
      ) {
        setIsDifficultyDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedGroup !== 'All' ||
    selectedDifficulty !== 'All';

  const activeGroupLabel =
    selectedGroup === 'All'
      ? 'All Groups'
      : `Group ${['I', 'II', 'III', 'IV'][(selectedGroup as number) - 1]}`;

  const activeDiffLabel =
    selectedDifficulty === 'All' ? 'All Difficulties' : `Level ${selectedDifficulty}`;

  return (
    <div className="w-full space-y-2.5">
      {/* Primary Search & Filter Bar Container */}
      <div className="p-2 sm:p-2.5 rounded-2xl bg-neutral-900/90 border border-white/[0.12] shadow-xl shadow-black/40 backdrop-blur-2xl transition-all">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
          {/* 1. Skill Name Search Input */}
          <div className="relative flex-1 min-w-[220px]">
            <div className="relative flex items-center w-full rounded-xl bg-white/[0.05] border border-white/[0.08] focus-within:border-white/35 focus-within:bg-white/[0.08] focus-within:ring-1 focus-within:ring-white/20 transition-all duration-150">
              <Search className="absolute left-3 h-4 w-4 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search skills by name (e.g. Tsukahara, Kovacs, Kasamatsu)..."
                className="w-full h-10 pl-9 pr-8 bg-transparent text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Clear search input"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Filter Selectors (Group & Difficulty Level) */}
          <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
            {/* 2. Group Selector Dropdown */}
            <div className="relative flex-1 sm:flex-initial" ref={groupDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsGroupDropdownOpen(!isGroupDropdownOpen);
                  setIsDifficultyDropdownOpen(false);
                }}
                className={`h-10 px-3 rounded-xl border text-xs font-medium flex items-center justify-between gap-2 w-full sm:w-auto transition-all ${
                  selectedGroup !== 'All'
                    ? 'bg-white text-black border-white font-semibold shadow-sm'
                    : 'bg-white/[0.05] text-neutral-200 border-white/[0.08] hover:bg-white/[0.09] hover:border-white/20'
                }`}
                aria-expanded={isGroupDropdownOpen}
                aria-haspopup="listbox"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Layers className={`w-3.5 h-3.5 ${selectedGroup !== 'All' ? 'text-black' : 'text-neutral-400'}`} />
                  <span className="truncate">{activeGroupLabel}</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                    isGroupDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Group Dropdown Menu */}
              {isGroupDropdownOpen && (
                <div className="absolute left-0 sm:left-auto sm:right-0 mt-1.5 w-72 sm:w-80 rounded-2xl bg-neutral-900 border border-white/15 p-1.5 shadow-2xl shadow-black/80 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 border-b border-white/[0.08] mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                      FIG Element Group Requirement
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectGroup('All');
                      setIsGroupDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      selectedGroup === 'All'
                        ? 'bg-white text-black font-semibold'
                        : 'text-neutral-300 hover:bg-white/[0.07] hover:text-white'
                    }`}
                  >
                    <span>All Element Groups</span>
                    {selectedGroup === 'All' && <Check className="w-3.5 h-3.5" />}
                  </button>

                  {ELEMENT_GROUPS.map((grp) => {
                    const isSelected = selectedGroup === grp.id;
                    return (
                      <button
                        key={grp.id}
                        type="button"
                        onClick={() => {
                          onSelectGroup(grp.id);
                          setIsGroupDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-start justify-between gap-2 transition-colors ${
                          isSelected
                            ? 'bg-white text-black font-semibold'
                            : 'text-neutral-300 hover:bg-white/[0.07] hover:text-white'
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="font-mono font-bold block">
                            Group {['I', 'II', 'III', 'IV'][grp.id - 1]}
                          </span>
                          <span
                            className={`text-[11px] line-clamp-1 ${
                              isSelected ? 'text-neutral-700' : 'text-neutral-400'
                            }`}
                          >
                            {grp.name}
                          </span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Difficulty Level Selector Dropdown */}
            <div className="relative flex-1 sm:flex-initial" ref={diffDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsDifficultyDropdownOpen(!isDifficultyDropdownOpen);
                  setIsGroupDropdownOpen(false);
                }}
                className={`h-10 px-3 rounded-xl border text-xs font-medium flex items-center justify-between gap-2 w-full sm:w-auto transition-all ${
                  selectedDifficulty !== 'All'
                    ? 'bg-white text-black border-white font-semibold shadow-sm'
                    : 'bg-white/[0.05] text-neutral-200 border-white/[0.08] hover:bg-white/[0.09] hover:border-white/20'
                }`}
                aria-expanded={isDifficultyDropdownOpen}
                aria-haspopup="listbox"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Award className={`w-3.5 h-3.5 ${selectedDifficulty !== 'All' ? 'text-black' : 'text-neutral-400'}`} />
                  <span className="truncate">{activeDiffLabel}</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
                    isDifficultyDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Difficulty Dropdown Menu */}
              {isDifficultyDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-64 rounded-2xl bg-neutral-900 border border-white/15 p-1.5 shadow-2xl shadow-black/80 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 border-b border-white/[0.08] mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                      FIG Difficulty Level (Value)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectDifficulty('All');
                      setIsDifficultyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      selectedDifficulty === 'All'
                        ? 'bg-white text-black font-semibold'
                        : 'text-neutral-300 hover:bg-white/[0.07] hover:text-white'
                    }`}
                  >
                    <span>All Difficulty Levels</span>
                    {selectedDifficulty === 'All' && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <div className="grid grid-cols-2 gap-1 pt-1">
                    {DIFFICULTY_LEVELS.map((diff) => {
                      const isSelected = selectedDifficulty === diff.letter;
                      return (
                        <button
                          key={diff.letter}
                          type="button"
                          onClick={() => {
                            onSelectDifficulty(diff.letter);
                            setIsDifficultyDropdownOpen(false);
                          }}
                          className={`px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                            isSelected
                              ? 'bg-white text-black font-bold'
                              : 'bg-white/[0.03] text-neutral-300 hover:bg-white/[0.08] hover:text-white'
                          }`}
                        >
                          <span className="font-mono font-bold">
                            Level {diff.letter}
                          </span>
                          <span
                            className={`font-mono text-[10px] ${
                              isSelected ? 'text-neutral-700' : 'text-neutral-400'
                            }`}
                          >
                            +{diff.value.toFixed(1)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 4. More Filters Toggle (Type & Body Part) */}
            <button
              type="button"
              onClick={onToggleExtendedFilters}
              className={`h-10 px-3 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all shrink-0 ${
                showExtendedFilters
                  ? 'bg-white text-black border-white font-semibold'
                  : 'bg-white/[0.05] text-neutral-300 border-white/[0.08] hover:bg-white/[0.09] hover:border-white/20'
              }`}
              title="Toggle extended type & anatomical filters"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Advanced</span>
            </button>
          </div>
        </div>

        {/* Integrated Quick-Pill Ribbon for Instant 1-Click Filtering */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {/* Quick Difficulty Pills */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider pl-1 pr-0.5">
              Diff:
            </span>
            <button
              type="button"
              onClick={() => onSelectDifficulty('All')}
              className={`h-6 px-2 rounded-lg text-[11px] font-mono transition-all ${
                selectedDifficulty === 'All'
                  ? 'bg-white text-black font-bold'
                  : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              All
            </button>
            {DIFFICULTY_LEVELS.map((diff) => {
              const isSelected = selectedDifficulty === diff.letter;
              return (
                <button
                  key={diff.letter}
                  type="button"
                  onClick={() =>
                    onSelectDifficulty(isSelected ? 'All' : diff.letter)
                  }
                  className={`h-6 px-2 rounded-lg text-[11px] font-mono transition-all ${
                    isSelected
                      ? 'bg-white text-black font-bold shadow-sm'
                      : 'bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-white/[0.08]'
                  }`}
                  title={`Filter by Difficulty ${diff.letter} (+${diff.value.toFixed(1)})`}
                >
                  {diff.letter}
                </button>
              );
            })}
          </div>

          <span className="text-neutral-700 text-xs shrink-0">|</span>

          {/* Quick Group Pills */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider pr-0.5">
              Group:
            </span>
            <button
              type="button"
              onClick={() => onSelectGroup('All')}
              className={`h-6 px-2 rounded-lg text-[11px] font-mono transition-all ${
                selectedGroup === 'All'
                  ? 'bg-white text-black font-bold'
                  : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              All
            </button>
            {[1, 2, 3, 4].map((grp) => {
              const isSelected = selectedGroup === grp;
              return (
                <button
                  key={grp}
                  type="button"
                  onClick={() => onSelectGroup(isSelected ? 'All' : (grp as 1 | 2 | 3 | 4))}
                  className={`h-6 px-2 rounded-lg text-[11px] font-mono transition-all ${
                    isSelected
                      ? 'bg-white text-black font-bold shadow-sm'
                      : 'bg-white/[0.04] text-neutral-300 hover:text-white hover:bg-white/[0.08]'
                  }`}
                  title={`Filter by Element Group ${['I', 'II', 'III', 'IV'][grp - 1]}`}
                >
                  Grp {['I', 'II', 'III', 'IV'][grp - 1]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Filter Tags & Results Bar */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between flex-wrap gap-2 px-1 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-neutral-400">Filtering:</span>

            {searchQuery.trim() && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-xs font-mono border border-white/15">
                <span>Name: &ldquo;{searchQuery.trim()}&rdquo;</span>
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="hover:text-neutral-300 ml-0.5"
                  aria-label="Remove search query filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedGroup !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-xs font-mono border border-white/15">
                <span>Group {['I', 'II', 'III', 'IV'][(selectedGroup as number) - 1]}</span>
                <button
                  type="button"
                  onClick={() => onSelectGroup('All')}
                  className="hover:text-neutral-300 ml-0.5"
                  aria-label="Remove group filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedDifficulty !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-xs font-mono border border-white/15">
                <span>Level {selectedDifficulty}</span>
                <button
                  type="button"
                  onClick={() => onSelectDifficulty('All')}
                  className="hover:text-neutral-300 ml-0.5"
                  aria-label="Remove difficulty filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={onClearAll}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-white transition-colors ml-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>

          <div className="text-[11px] font-mono text-neutral-400">
            <span>
              Found <strong className="text-white">{totalResultsCount}</strong> of {totalSkillsCount} skills
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
