import React, { useState, useMemo } from 'react';
import { Plus, Search, Check, SlidersHorizontal, X } from 'lucide-react';
import { useGymnasticsStore } from '../hooks/useGymnasticsStore';
import { ModalSheet } from '../components/ui/ModalSheet';
import { SearchBar } from '../components/ui/SearchBar';
import { FilterPill } from '../components/ui/FilterPill';
import { TagChip } from '../components/ui/TagChip';
import { GlassCard } from '../components/ui/GlassCard';
import { GymnasticSkill } from '../types/gymnastics';
import { DIFFICULTY_LEVELS, SKILL_TYPES, BODY_PART_FOCUSES, resolveSkillType, resolveBodyPart } from '../data/mockSkills';

interface SkillPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSkill: (skill: GymnasticSkill) => void;
  routineApparatus?: string;
  alreadyAddedSkillIds?: string[];
  initialElementGroup?: number | null;
}

export const SkillPickerModal: React.FC<SkillPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectSkill,
  routineApparatus,
  alreadyAddedSkillIds = [],
  initialElementGroup = null,
}) => {
  const { skills } = useGymnasticsStore();
  const [search, setSearch] = useState('');
  const [filterApparatus, setFilterApparatus] = useState<string>(
    routineApparatus || 'All'
  );
  const [filterGroup, setFilterGroup] = useState<number | 'All'>(
    initialElementGroup || 'All'
  );
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterBodyPart, setFilterBodyPart] = useState<string>('All');
  const [activeSubFilter, setActiveSubFilter] = useState<'none' | 'value' | 'type' | 'body'>('none');

  // Sync initialElementGroup when modal is opened
  React.useEffect(() => {
    if (isOpen && initialElementGroup) {
      setFilterGroup(initialElementGroup);
    }
  }, [isOpen, initialElementGroup]);

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          skill.name.toLowerCase().includes(q) ||
          skill.figCode.toLowerCase().includes(q) ||
          skill.elementGroup.toLowerCase().includes(q) ||
          resolveSkillType(skill).toLowerCase().includes(q) ||
          resolveBodyPart(skill).toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (filterApparatus !== 'All' && skill.apparatus !== filterApparatus) {
        return false;
      }
      if (filterGroup !== 'All' && skill.elementGroupNumber !== filterGroup) {
        return false;
      }
      if (filterDifficulty !== 'All' && skill.difficulty !== filterDifficulty) {
        return false;
      }
      if (filterType !== 'All' && resolveSkillType(skill) !== filterType) {
        return false;
      }
      if (filterBodyPart !== 'All' && resolveBodyPart(skill) !== filterBodyPart) {
        return false;
      }
      return true;
    });
  }, [skills, search, filterApparatus, filterGroup, filterDifficulty, filterType, filterBodyPart]);

  const hasExtraFilters =
    filterDifficulty !== 'All' || filterType !== 'All' || filterBodyPart !== 'All';

  const resetAllFilters = () => {
    setFilterDifficulty('All');
    setFilterType('All');
    setFilterBodyPart('All');
    setFilterGroup('All');
    setSearch('');
  };

  return (
    <ModalSheet
      isOpen={isOpen}
      onClose={onClose}
      title="Add Skill to Routine"
      subtitle="Select an element from the FIG Code of Points"
      maxHeight="max-h-[85vh]"
    >
      <div className="space-y-3 pb-6">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Filter skills by name, value, type, or muscle..."
          autoFocus={false}
        />

        {/* Quick filter apparatus pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {routineApparatus && (
            <FilterPill
              size="sm"
              label={`Match (${routineApparatus})`}
              active={filterApparatus === routineApparatus}
              onClick={() => setFilterApparatus(routineApparatus)}
            />
          )}
          <FilterPill
            size="sm"
            label="All Apparatus"
            active={filterApparatus === 'All'}
            onClick={() => setFilterApparatus('All')}
          />
          <FilterPill
            size="sm"
            label="All Groups"
            active={filterGroup === 'All'}
            onClick={() => setFilterGroup('All')}
          />
          {[1, 2, 3, 4].map((grp) => (
            <FilterPill
              key={grp}
              size="sm"
              label={`Grp ${['I', 'II', 'III', 'IV'][grp - 1]}`}
              active={filterGroup === grp}
              onClick={() => setFilterGroup(grp as 1 | 2 | 3 | 4)}
            />
          ))}
        </div>

        {/* Value, Type, Body Part Filter Tabs Strip */}
        <div className="flex items-center justify-between gap-1.5 bg-white/[0.03] p-1.5 rounded-xl border border-white/[0.08] flex-wrap">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() =>
                setActiveSubFilter(activeSubFilter === 'value' ? 'none' : 'value')
              }
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeSubFilter === 'value' || filterDifficulty !== 'All'
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white bg-white/[0.03]'
              }`}
            >
              Value: {filterDifficulty}
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSubFilter(activeSubFilter === 'type' ? 'none' : 'type')
              }
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeSubFilter === 'type' || filterType !== 'All'
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white bg-white/[0.03]'
              }`}
            >
              Type: {filterType}
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveSubFilter(activeSubFilter === 'body' ? 'none' : 'body')
              }
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                activeSubFilter === 'body' || filterBodyPart !== 'All'
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white bg-white/[0.03]'
              }`}
            >
              Body: {filterBodyPart}
            </button>
          </div>

          {(hasExtraFilters || filterGroup !== 'All') && (
            <button
              type="button"
              onClick={resetAllFilters}
              className="text-[11px] font-mono text-neutral-400 hover:text-white px-2 py-0.5"
            >
              Reset
            </button>
          )}
        </div>

        {/* Sub-filter expansion rows */}
        {activeSubFilter === 'value' && (
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <FilterPill
              size="sm"
              label="All Values"
              active={filterDifficulty === 'All'}
              onClick={() => setFilterDifficulty('All')}
            />
            {DIFFICULTY_LEVELS.map((d) => (
              <FilterPill
                key={d.letter}
                size="sm"
                label={`${d.letter} (+${d.value.toFixed(1)})`}
                active={filterDifficulty === d.letter}
                onClick={() => setFilterDifficulty(d.letter)}
              />
            ))}
          </div>
        )}

        {activeSubFilter === 'type' && (
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <FilterPill
              size="sm"
              label="All Types"
              active={filterType === 'All'}
              onClick={() => setFilterType('All')}
            />
            {SKILL_TYPES.map((t) => (
              <FilterPill
                key={t.id}
                size="sm"
                label={t.label}
                active={filterType === t.id}
                onClick={() => setFilterType(t.id)}
              />
            ))}
          </div>
        )}

        {activeSubFilter === 'body' && (
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <FilterPill
              size="sm"
              label="All Targets"
              active={filterBodyPart === 'All'}
              onClick={() => setFilterBodyPart('All')}
            />
            {BODY_PART_FOCUSES.map((b) => (
              <FilterPill
                key={b.id}
                size="sm"
                label={b.label}
                active={filterBodyPart === b.id}
                onClick={() => setFilterBodyPart(b.id)}
              />
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-xs font-mono text-neutral-400 px-1">
          <span>{filteredSkills.length} matches found</span>
        </div>

        {/* Skills list */}
        <div className="space-y-2 mt-2 max-h-[50vh] overflow-y-auto pr-1">
          {filteredSkills.map((skill) => {
            const isAdded = alreadyAddedSkillIds.includes(skill.id);
            const skillType = resolveSkillType(skill);
            const bodyPart = resolveBodyPart(skill);
            return (
              <GlassCard
                key={skill.id}
                variant="interactive"
                onClick={() => {
                  onSelectSkill(skill);
                }}
                className="p-3 flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    <TagChip variant="difficulty" size="xs">
                      Val {skill.difficulty} (+{skill.difficultyValue.toFixed(1)})
                    </TagChip>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {skill.apparatus}
                    </span>
                    <span className="text-[10px] font-medium text-neutral-300 px-1.5 py-0.2 rounded bg-white/[0.05]">
                      {skillType}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {bodyPart}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500 hidden sm:inline">
                      FIG {skill.figCode}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white truncate">
                    {skill.name}
                  </h4>
                  <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                    {skill.description}
                  </p>
                </div>

                <div className="shrink-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isAdded
                        ? 'bg-neutral-800 text-neutral-400 border border-white/10'
                        : 'bg-white text-black group-hover:scale-105'
                    }`}
                  >
                    {isAdded ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </ModalSheet>
  );
};
