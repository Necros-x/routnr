import React, { useState, useMemo } from 'react';
import { Filter, LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react';
import { useGymnasticsStore } from '../hooks/useGymnasticsStore';
import { ALL_APPARATUS, resolveSkillType, resolveBodyPart } from '../data/mockSkills';
import { FilterPill } from '../components/ui/FilterPill';
import { SkillCard } from '../components/SkillCard';
import { EmptyState } from '../components/ui/EmptyState';
import { GymnasticSkill } from '../types/gymnastics';
import { SkillFilterSystem, SortOption } from '../components/SkillFilterSystem';
import { SkillSearchFilterBar } from '../components/SkillSearchFilterBar';

export const SkillLibraryScreen: React.FC = () => {
  const {
    skills,
    setSelectedSkill,
    favoriteSkillIds,
    toggleFavorite,
    addSkillToRoutine,
    activeRoutineId,
    routines,
    markSkillViewed,
  } = useGymnasticsStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApparatus, setSelectedApparatus] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedBodyPart, setSelectedBodyPart] = useState<string>('All');
  const [selectedGroup, setSelectedGroup] = useState<number | 'All'>('All');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortOption, setSortOption] = useState<SortOption>('difficulty-desc');
  const [showExtendedFilters, setShowExtendedFilters] = useState(false);

  // Active routine for quick add check
  const activeRoutine = routines.find((r) => r.id === activeRoutineId) || routines[0] || null;

  // Filter skills
  const filteredSkills = useMemo(() => {
    const list = skills.filter((skill) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = skill.name.toLowerCase().includes(query);
        const matchesFig = skill.figCode.toLowerCase().includes(query);
        const matchesDesc = skill.description.toLowerCase().includes(query);
        const matchesAliases = skill.aliases.some((a) => a.toLowerCase().includes(query));
        const matchesTags = skill.tags.some((t) => t.toLowerCase().includes(query));
        const matchesType = resolveSkillType(skill).toLowerCase().includes(query);
        const matchesBody = resolveBodyPart(skill).toLowerCase().includes(query);
        if (
          !matchesName &&
          !matchesFig &&
          !matchesDesc &&
          !matchesAliases &&
          !matchesTags &&
          !matchesType &&
          !matchesBody
        ) {
          return false;
        }
      }

      // Apparatus
      if (selectedApparatus !== 'All' && skill.apparatus !== selectedApparatus) {
        return false;
      }

      // Difficulty Value (A-H or Tier)
      if (selectedDifficulty !== 'All') {
        if (selectedDifficulty === 'A-C') {
          if (!['A', 'B', 'C'].includes(skill.difficulty)) return false;
        } else if (selectedDifficulty === 'D-E') {
          if (!['D', 'E'].includes(skill.difficulty)) return false;
        } else if (selectedDifficulty === 'F-H') {
          if (!['F', 'G', 'H'].includes(skill.difficulty)) return false;
        } else if (skill.difficulty !== selectedDifficulty) {
          return false;
        }
      }

      // Skill Type
      if (selectedType !== 'All') {
        if (resolveSkillType(skill) !== selectedType) {
          return false;
        }
      }

      // Body Part / Anatomical Focus
      if (selectedBodyPart !== 'All') {
        if (resolveBodyPart(skill) !== selectedBodyPart) {
          return false;
        }
      }

      // Element Group
      if (selectedGroup !== 'All' && skill.elementGroupNumber !== selectedGroup) {
        return false;
      }

      // Favorites only
      if (onlyFavorites && !favoriteSkillIds.includes(skill.id)) {
        return false;
      }

      return true;
    });

    // Sorting
    return [...list].sort((a, b) => {
      if (sortOption === 'difficulty-desc') {
        return b.difficultyValue - a.difficultyValue;
      }
      if (sortOption === 'difficulty-asc') {
        return a.difficultyValue - b.difficultyValue;
      }
      if (sortOption === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortOption === 'fig-asc') {
        return a.figCode.localeCompare(b.figCode);
      }
      return 0;
    });
  }, [
    skills,
    searchQuery,
    selectedApparatus,
    selectedDifficulty,
    selectedType,
    selectedBodyPart,
    selectedGroup,
    onlyFavorites,
    favoriteSkillIds,
    sortOption,
  ]);

  const handleSelectSkill = (skill: GymnasticSkill) => {
    markSkillViewed(skill);
    setSelectedSkill(skill);
  };

  const handleAddToRoutine = (skill: GymnasticSkill) => {
    if (activeRoutine) {
      addSkillToRoutine(activeRoutine.id, skill);
    }
  };

  const clearAllFilters = () => {
    setSelectedApparatus('All');
    setSelectedDifficulty('All');
    setSelectedType('All');
    setSelectedBodyPart('All');
    setSelectedGroup('All');
    setOnlyFavorites(false);
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedApparatus !== 'All' ||
    selectedDifficulty !== 'All' ||
    selectedType !== 'All' ||
    selectedBodyPart !== 'All' ||
    selectedGroup !== 'All' ||
    onlyFavorites ||
    searchQuery.length > 0;

  return (
    <div className="space-y-4 pb-28">
      {/* Header */}
      <div>
        <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-neutral-400 block">
          Skill reference
        </span>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-white font-display">
            Skill Library
          </h1>
          <div className="flex items-center gap-1 bg-white/[0.06] p-0.5 rounded-full border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-full text-xs transition-colors ${
                viewMode === 'list' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
              }`}
              title="List view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-full text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
              }`}
              title="Grid view"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Unified Search and Filter Bar */}
      <div className="space-y-3">
        <SkillSearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedGroup={selectedGroup}
          onSelectGroup={setSelectedGroup}
          selectedDifficulty={selectedDifficulty}
          onSelectDifficulty={setSelectedDifficulty}
          totalResultsCount={filteredSkills.length}
          totalSkillsCount={skills.length}
          onClearAll={clearAllFilters}
          showExtendedFilters={showExtendedFilters}
          onToggleExtendedFilters={() => setShowExtendedFilters(!showExtendedFilters)}
        />

        {/* Primary Apparatus Filter Horizontal Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <FilterPill
            label="All Apparatus"
            active={selectedApparatus === 'All'}
            onClick={() => setSelectedApparatus('All')}
            count={skills.length}
          />
          {ALL_APPARATUS.map((app) => {
            const count = skills.filter((s) => s.apparatus === app.name).length;
            return (
              <FilterPill
                key={app.name}
                label={`${app.code} · ${app.name}`}
                active={selectedApparatus === app.name}
                onClick={() => setSelectedApparatus(app.name)}
                count={count}
              />
            );
          })}
        </div>

        {/* Extended Type & Body Part Filter System (Collapsible) */}
        {showExtendedFilters && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-150">
            <SkillFilterSystem
              selectedDifficulty={selectedDifficulty}
              onSelectDifficulty={setSelectedDifficulty}
              selectedType={selectedType}
              onSelectType={setSelectedType}
              selectedBodyPart={selectedBodyPart}
              onSelectBodyPart={setSelectedBodyPart}
              selectedGroup={selectedGroup}
              onSelectGroup={setSelectedGroup}
              skills={selectedApparatus === 'All' ? skills : skills.filter((s) => s.apparatus === selectedApparatus)}
              totalFilteredCount={filteredSkills.length}
              onResetAll={clearAllFilters}
              sortOption={sortOption}
              onSortChange={setSortOption}
            />
          </div>
        )}

        {/* Secondary Bar for Favorites & Active Count */}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-medium border transition-colors ${
                onlyFavorites
                  ? 'bg-white text-black border-white font-semibold'
                  : 'bg-white/[0.05] text-neutral-300 border-white/[0.08] hover:bg-white/10'
              }`}
            >
              <span>Saved Elements</span>
              <span className="font-mono text-[10px] opacity-75">
                ({favoriteSkillIds.length})
              </span>
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full text-xs text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <X className="w-3 h-3" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>

          <span className="text-xs font-mono text-neutral-400 shrink-0">
            Showing <strong className="text-white">{filteredSkills.length}</strong> of {skills.length}
          </span>
        </div>
      </div>

      {/* Skills Results List or Grid */}
      {filteredSkills.length === 0 ? (
        <EmptyState
          icon={<Filter className="w-6 h-6" />}
          title="No skills match your filters"
          description="Try broadening your criteria, switching apparatus, or resetting value, type, and body part filters."
          actionText="Clear all filters"
          onAction={clearAllFilters}
        />
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5'
              : 'grid grid-cols-1 md:grid-cols-2 gap-2.5'
          }
        >
          {filteredSkills.map((skill) => {
            const isInActiveRoutine =
              activeRoutine?.skills.some((s) => s.skillId === skill.id) || false;
            return (
              <SkillCard
                key={skill.id}
                skill={skill}
                onSelect={handleSelectSkill}
                isFavorite={favoriteSkillIds.includes(skill.id)}
                onToggleFavorite={toggleFavorite}
                onAddToRoutine={handleAddToRoutine}
                isInRoutine={isInActiveRoutine}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
