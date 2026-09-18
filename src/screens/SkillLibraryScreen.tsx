import React, { useMemo, useState } from 'react';
import { Bookmark, Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import { useGymnasticsStore } from '../hooks/useGymnasticsStore';
import { ALL_APPARATUS, DIFFICULTY_LEVELS } from '../data/mockSkills';

export const SkillLibraryScreen: React.FC = () => {
  const {
    skills,
    setSelectedSkill,
    favoriteSkillIds,
    toggleFavorite,
    routines,
    addSkillToRoutine,
    markSkillViewed,
  } = useGymnasticsStore();

  const [query, setQuery] = useState('');
  const [apparatus, setApparatus] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const filteredSkills = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return skills.filter((skill) => {
      const matchesQuery =
        !normalized ||
        skill.name.toLowerCase().includes(normalized) ||
        skill.figCode.toLowerCase().includes(normalized) ||
        skill.aliases.some((alias) => alias.toLowerCase().includes(normalized)) ||
        skill.tags.some((tag) => tag.toLowerCase().includes(normalized));
      const matchesApparatus = apparatus === 'All' || skill.apparatus === apparatus;
      const matchesDifficulty = difficulty === 'All' || skill.difficulty === difficulty;
      const matchesFavorite = !favoritesOnly || favoriteSkillIds.includes(skill.id);
      return matchesQuery && matchesApparatus && matchesDifficulty && matchesFavorite;
    });
  }, [apparatus, difficulty, favoriteSkillIds, favoritesOnly, query, skills]);

  const resetFilters = () => {
    setQuery('');
    setApparatus('All');
    setDifficulty('All');
    setFavoritesOnly(false);
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">Code of Points</p>
          <h2 className="font-display mt-1 text-3xl font-semibold sm:text-4xl">Find a skill fast.</h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--text-secondary)]">
            Search by element name, alias, FIG code, apparatus, or difficulty.
          </p>
        </div>
        <p className="text-xs font-medium text-[var(--text-tertiary)]">{filteredSkills.length} elements shown</p>
      </section>

      <section className="surface rounded-[26px] p-3 sm:p-4">
        <div className="flex min-h-14 items-center gap-3 rounded-[18px] bg-[var(--surface-soft)] px-4">
          <Search className="h-5 w-5 shrink-0 text-[var(--text-tertiary)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search skills, aliases or FIG code…"
            className="h-14 min-w-0 flex-1 bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-tertiary)] hover:bg-white hover:text-[var(--text-primary)]"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setApparatus('All')}
            className={`h-9 shrink-0 rounded-full px-4 text-xs font-semibold transition-colors ${
              apparatus === 'All'
                ? 'bg-[var(--accent)] text-white'
                : 'border border-[var(--border-subtle)] bg-white text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
            }`}
          >
            All apparatus
          </button>
          {ALL_APPARATUS.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setApparatus(item.name)}
              className={`h-9 shrink-0 rounded-full px-4 text-xs font-semibold transition-colors ${
                apparatus === item.name
                  ? 'bg-[var(--accent)] text-white'
                  : 'border border-[var(--border-subtle)] bg-white text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]'
              }`}
            >
              {item.code}
            </button>
          ))}
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-[var(--border-subtle)] pt-3">
          <span className="mr-1 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[var(--text-tertiary)]">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Difficulty
          </span>
          <button
            type="button"
            onClick={() => setDifficulty('All')}
            className={`h-8 rounded-full px-3 text-[11px] font-semibold ${difficulty === 'All' ? 'bg-[var(--accent-soft)] text-[var(--text-primary)]' : 'text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)]'}`}
          >
            All
          </button>
          {DIFFICULTY_LEVELS.map((level) => (
            <button
              key={level.letter}
              type="button"
              onClick={() => setDifficulty(level.letter)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-bold ${difficulty === level.letter ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]'}`}
            >
              {level.letter}
            </button>
          ))}
          <span className="mx-1 hidden h-5 w-px bg-[var(--border-subtle)] sm:block" />
          <button
            type="button"
            onClick={() => setFavoritesOnly((value) => !value)}
            className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[11px] font-semibold ${favoritesOnly ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--surface-soft)]'}`}
          >
            <Bookmark className="h-3.5 w-3.5" fill={favoritesOnly ? 'currentColor' : 'none'} />
            Saved
          </button>
          {(query || apparatus !== 'All' || difficulty !== 'All' || favoritesOnly) && (
            <button
              type="button"
              onClick={resetFilters}
              className="ml-auto text-[11px] font-semibold text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              Reset filters
            </button>
          )}
        </div>
      </section>

      <section className="surface overflow-hidden rounded-[26px]">
        {filteredSkills.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Search className="mx-auto h-6 w-6 text-[var(--text-tertiary)]" />
            <h3 className="mt-4 text-base font-semibold">No matching skills</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Try another search term or clear a filter.</p>
          </div>
        ) : (
          filteredSkills.map((skill, index) => {
            const isFavorite = favoriteSkillIds.includes(skill.id);
            const targetRoutine = routines.find((routine) => routine.apparatus === skill.apparatus);

            return (
              <div
                key={skill.id}
                className={`group flex items-center gap-3 p-3 sm:gap-4 sm:p-4 ${index > 0 ? 'border-t border-[var(--border-subtle)]' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => {
                    markSkillViewed(skill);
                    setSelectedSkill(skill);
                  }}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left sm:gap-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[var(--accent-soft)] text-sm font-bold text-[var(--text-primary)]">
                    {skill.difficulty}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="truncate text-sm font-semibold text-[var(--text-primary)]">{skill.name}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">FIG {skill.figCode}</span>
                    </span>
                    <span className="mt-1 block truncate text-[11px] text-[var(--text-secondary)]">
                      {skill.apparatus} · Group {skill.elementGroupNumber} · {skill.difficultyValue.toFixed(1)} DV
                    </span>
                  </span>
                </button>

                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggleFavorite(skill.id)}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${isFavorite ? 'bg-[var(--accent-soft)] text-[var(--text-primary)]' : 'text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]'}`}
                    aria-label={isFavorite ? 'Remove from saved skills' : 'Save skill'}
                  >
                    <Bookmark className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    type="button"
                    disabled={!targetRoutine}
                    onClick={() => targetRoutine && addSkillToRoutine(targetRoutine.id, skill)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent)] text-white transition-transform hover:-translate-y-0.5 disabled:bg-[var(--accent-soft)] disabled:text-[var(--text-tertiary)] disabled:hover:translate-y-0"
                    aria-label={targetRoutine ? `Add to ${targetRoutine.name}` : 'Create a matching routine first'}
                    title={targetRoutine ? `Add to ${targetRoutine.name}` : 'Create a matching apparatus routine first'}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};
