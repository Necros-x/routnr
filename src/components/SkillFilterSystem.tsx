import React, { useState } from 'react';
import {
  X,
  SlidersHorizontal,
  RotateCcw,
  Zap,
  Activity,
  Dumbbell,
  Shield,
  Layers,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { DIFFICULTY_LEVELS, SKILL_TYPES, BODY_PART_FOCUSES, ELEMENT_GROUPS, resolveSkillType, resolveBodyPart } from '../data/mockSkills';
import { GymnasticSkill, SkillType, BodyPartFocus } from '../types/gymnastics';

export type FilterCategoryTab = 'value' | 'type' | 'bodyPart' | 'group';

export type SortOption = 'difficulty-desc' | 'difficulty-asc' | 'name-asc' | 'fig-asc';

interface SkillFilterSystemProps {
  selectedDifficulty: string;
  onSelectDifficulty: (letter: string) => void;
  selectedType: string;
  onSelectType: (type: string) => void;
  selectedBodyPart: string;
  onSelectBodyPart: (bodyPart: string) => void;
  selectedGroup: number | 'All';
  onSelectGroup: (group: number | 'All') => void;
  skills: GymnasticSkill[];
  totalFilteredCount: number;
  onResetAll: () => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SkillFilterSystem: React.FC<SkillFilterSystemProps> = ({
  selectedDifficulty,
  onSelectDifficulty,
  selectedType,
  onSelectType,
  selectedBodyPart,
  onSelectBodyPart,
  selectedGroup,
  onSelectGroup,
  skills,
  totalFilteredCount,
  onResetAll,
  sortOption,
  onSortChange,
}) => {
  const [activeTab, setActiveTab] = useState<FilterCategoryTab>('value');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Calculate counts for values
  const countByDifficulty = (letter: string) => {
    return skills.filter((s) => s.difficulty === letter).length;
  };

  // Calculate counts for types
  const countByType = (typeId: SkillType) => {
    return skills.filter((s) => resolveSkillType(s) === typeId).length;
  };

  // Calculate counts for body parts
  const countByBodyPart = (bpId: BodyPartFocus) => {
    return skills.filter((s) => resolveBodyPart(s) === bpId).length;
  };

  // Calculate counts for groups
  const countByGroup = (groupNumber: number) => {
    return skills.filter((s) => s.elementGroupNumber === groupNumber).length;
  };

  // Difficulty Tier Presets
  const setTier = (tier: 'all' | 'basic' | 'adv' | 'elite') => {
    if (tier === 'all') {
      onSelectDifficulty('All');
    } else if (tier === 'basic') {
      onSelectDifficulty('A-C');
    } else if (tier === 'adv') {
      onSelectDifficulty('D-E');
    } else if (tier === 'elite') {
      onSelectDifficulty('F-H');
    }
  };

  const hasActiveFilters =
    selectedDifficulty !== 'All' ||
    selectedType !== 'All' ||
    selectedBodyPart !== 'All' ||
    selectedGroup !== 'All';

  const activeFiltersCount = [
    selectedDifficulty !== 'All',
    selectedType !== 'All',
    selectedBodyPart !== 'All',
    selectedGroup !== 'All',
  ].filter(Boolean).length;

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.08] overflow-hidden transition-all duration-200">
      {/* Top Filter Bar Header */}
      <div className="p-3 sm:p-4 border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-xs font-semibold text-white tracking-tight hover:text-neutral-300 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
            <span>Element Filters</span>
            {activeFiltersCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-white text-black font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <span className="text-neutral-600 text-xs">|</span>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-xl border border-white/[0.06]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('value');
                setIsExpanded(true);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'value'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Value (A–H)
              {selectedDifficulty !== 'All' && (
                <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-black" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('type');
                setIsExpanded(true);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'type'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Skill Type
              {selectedType !== 'All' && (
                <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-black" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('bodyPart');
                setIsExpanded(true);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'bodyPart'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Body Part
              {selectedBodyPart !== 'All' && (
                <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-black" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('group');
                setIsExpanded(true);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all hidden sm:inline-block ${
                activeTab === 'group'
                  ? 'bg-white text-black font-semibold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Group (I–IV)
              {selectedGroup !== 'All' && (
                <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-black" />
              )}
            </button>
          </div>
        </div>

        {/* Sort & Toggle Controls */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400">
            <ArrowUpDown className="w-3 h-3 text-neutral-500" />
            <select
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-white/[0.04] text-neutral-200 border border-white/[0.08] rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-white/30 cursor-pointer"
            >
              <option value="difficulty-desc" className="bg-neutral-900 text-white">Value (High to Low)</option>
              <option value="difficulty-asc" className="bg-neutral-900 text-white">Value (Low to High)</option>
              <option value="name-asc" className="bg-neutral-900 text-white">Name (A–Z)</option>
              <option value="fig-asc" className="bg-neutral-900 text-white">FIG Code</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetAll}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Expanded Filter Panel */}
      {isExpanded && (
        <div className="p-3.5 sm:p-4 space-y-3.5 bg-black/20 animate-in fade-in duration-150">
          {/* TAB 1: VALUE (A-H) */}
          {activeTab === 'value' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  FIG Element Difficulty Values (A through H)
                </span>
                {/* Value Tier Quick Presets */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-neutral-500 text-[11px] font-mono">Presets:</span>
                  <button
                    type="button"
                    onClick={() => setTier('all')}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      selectedDifficulty === 'All'
                        ? 'bg-white text-black font-semibold'
                        : 'text-neutral-400 hover:text-white bg-white/[0.03]'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setTier('basic')}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      selectedDifficulty === 'A-C'
                        ? 'bg-white text-black font-semibold'
                        : 'text-neutral-400 hover:text-white bg-white/[0.03]'
                    }`}
                  >
                    A–C (0.1–0.3)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTier('adv')}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      selectedDifficulty === 'D-E'
                        ? 'bg-white text-black font-semibold'
                        : 'text-neutral-400 hover:text-white bg-white/[0.03]'
                    }`}
                  >
                    D–E (0.4–0.5)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTier('elite')}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                      selectedDifficulty === 'F-H'
                        ? 'bg-white text-black font-semibold'
                        : 'text-neutral-400 hover:text-white bg-white/[0.03]'
                    }`}
                  >
                    F–H (0.6–0.8+)
                  </button>
                </div>
              </div>

              {/* Grid of A-H Buttons */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {DIFFICULTY_LEVELS.map((diff) => {
                  const count = countByDifficulty(diff.letter);
                  const isSelected = selectedDifficulty === diff.letter;
                  return (
                    <button
                      key={diff.letter}
                      type="button"
                      onClick={() =>
                        onSelectDifficulty(isSelected ? 'All' : diff.letter)
                      }
                      className={`relative p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-white text-black border-white shadow-lg shadow-white/10 scale-[1.02]'
                          : 'bg-white/[0.03] text-neutral-300 border-white/[0.08] hover:bg-white/[0.07] hover:border-white/20'
                      }`}
                    >
                      <span className="text-base font-bold font-mono tracking-tight leading-none">
                        {diff.letter}
                      </span>
                      <span
                        className={`text-[10px] font-mono mt-1 ${
                          isSelected ? 'text-neutral-700 font-semibold' : 'text-neutral-400'
                        }`}
                      >
                        +{diff.value.toFixed(1)}
                      </span>
                      <span
                        className={`text-[9px] font-mono mt-1 px-1.5 py-0.2 rounded-full ${
                          isSelected
                            ? 'bg-black/10 text-black'
                            : 'bg-white/[0.06] text-neutral-400'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SKILL TYPE */}
          {activeTab === 'type' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  Select Element Movement Type
                </span>
                {selectedType !== 'All' && (
                  <button
                    type="button"
                    onClick={() => onSelectType('All')}
                    className="text-[11px] font-mono text-neutral-400 hover:text-white"
                  >
                    Show all types
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {SKILL_TYPES.map((type) => {
                  const count = countByType(type.id);
                  const isSelected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => onSelectType(isSelected ? 'All' : type.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-white text-black border-white shadow-sm'
                          : 'bg-white/[0.03] text-neutral-300 border-white/[0.08] hover:bg-white/[0.07] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold tracking-tight">
                          {type.label}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-black/10 text-black font-bold'
                              : 'bg-white/[0.06] text-neutral-400'
                          }`}
                        >
                          {count}
                        </span>
                      </div>
                      <p
                        className={`text-[11px] line-clamp-1 leading-snug ${
                          isSelected ? 'text-neutral-700' : 'text-neutral-400'
                        }`}
                      >
                        {type.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: BODY PART / ANATOMICAL FOCUS */}
          {activeTab === 'bodyPart' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  Target Anatomical Focus & Kinetic Demand
                </span>
                {selectedBodyPart !== 'All' && (
                  <button
                    type="button"
                    onClick={() => onSelectBodyPart('All')}
                    className="text-[11px] font-mono text-neutral-400 hover:text-white"
                  >
                    Show all body parts
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {BODY_PART_FOCUSES.map((bp) => {
                  const count = countByBodyPart(bp.id);
                  const isSelected = selectedBodyPart === bp.id;
                  return (
                    <button
                      key={bp.id}
                      type="button"
                      onClick={() => onSelectBodyPart(isSelected ? 'All' : bp.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-white text-black border-white shadow-sm'
                          : 'bg-white/[0.03] text-neutral-300 border-white/[0.08] hover:bg-white/[0.07] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          {bp.id === 'Upper Body' && <Dumbbell className="w-3.5 h-3.5" />}
                          {bp.id === 'Core & Trunk' && <Activity className="w-3.5 h-3.5" />}
                          {bp.id === 'Lower Body' && <Zap className="w-3.5 h-3.5" />}
                          {bp.id === 'Full Body' && <Sparkles className="w-3.5 h-3.5" />}
                          <span className="text-xs font-bold tracking-tight">
                            {bp.label}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-black/10 text-black font-bold'
                              : 'bg-white/[0.06] text-neutral-400'
                          }`}
                        >
                          {count}
                        </span>
                      </div>
                      <p
                        className={`text-[11px] leading-snug line-clamp-2 ${
                          isSelected ? 'text-neutral-700' : 'text-neutral-400'
                        }`}
                      >
                        {bp.description}
                      </p>
                      <div className="mt-2 pt-2 border-t border-current/10">
                        <span
                          className={`text-[10px] font-mono block truncate ${
                            isSelected ? 'text-neutral-600' : 'text-neutral-500'
                          }`}
                        >
                          {bp.muscles}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: GROUP */}
          {activeTab === 'group' && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400">
                  FIG Element Groups (Composition Requirements)
                </span>
                {selectedGroup !== 'All' && (
                  <button
                    type="button"
                    onClick={() => onSelectGroup('All')}
                    className="text-[11px] font-mono text-neutral-400 hover:text-white"
                  >
                    Show all groups
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {ELEMENT_GROUPS.map((grp) => {
                  const count = countByGroup(grp.id);
                  const isSelected = selectedGroup === grp.id;
                  return (
                    <button
                      key={grp.id}
                      type="button"
                      onClick={() => onSelectGroup(isSelected ? 'All' : grp.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-white text-black border-white shadow-sm'
                          : 'bg-white/[0.03] text-neutral-300 border-white/[0.08] hover:bg-white/[0.07] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold font-mono">
                          Group {['I', 'II', 'III', 'IV'][grp.id - 1]}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-black/10 text-black font-bold'
                              : 'bg-white/[0.06] text-neutral-400'
                          }`}
                        >
                          {count}
                        </span>
                      </div>
                      <p
                        className={`text-[11px] line-clamp-2 leading-tight ${
                          isSelected ? 'text-neutral-700' : 'text-neutral-400'
                        }`}
                      >
                        {grp.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Active Filter Tags Pill Bar */}
      {hasActiveFilters && (
        <div className="px-3.5 py-2.5 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono text-neutral-400">Active:</span>

            {selectedDifficulty !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-xs font-mono border border-white/15">
                <span>Value {selectedDifficulty}</span>
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

            {selectedType !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-xs font-mono border border-white/15">
                <span>Type: {selectedType}</span>
                <button
                  type="button"
                  onClick={() => onSelectType('All')}
                  className="hover:text-neutral-300 ml-0.5"
                  aria-label="Remove skill type filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedBodyPart !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-xs font-mono border border-white/15">
                <span>Body: {selectedBodyPart}</span>
                <button
                  type="button"
                  onClick={() => onSelectBodyPart('All')}
                  className="hover:text-neutral-300 ml-0.5"
                  aria-label="Remove body part filter"
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
                  aria-label="Remove element group filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-neutral-400">
              Found <strong className="text-white">{totalFilteredCount}</strong> matching elements
            </span>
            <button
              type="button"
              onClick={onResetAll}
              className="text-[11px] font-mono text-neutral-400 hover:text-white underline underline-offset-2"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
