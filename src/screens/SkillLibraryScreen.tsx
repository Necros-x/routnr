import React, { useMemo, useState } from 'react';
import { Bookmark, Plus, Search, X } from 'lucide-react';
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

  const filteredSkills = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return skills.filter((skill) => {
      const searchMatch =
        !normalized ||
        skill.name.toLowerCase().includes(normalized) ||
        skill.figCode.toLowerCase().includes(normalized) ||
        skill.aliases.some((alias) => alias.toLowerCase().includes(normalized));

      const apparatusMatch = apparatus === 'All' || skill.apparatus === apparatus;
      const difficultyMatch = difficulty === 'All' || skill.difficulty === difficulty;

      return searchMatch && apparatusMatch && difficultyMatch;
    });
  }, [apparatus, difficulty, query, skills]);

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-medium text-[var(--text-tertiary)]">FIG 2025–2028</p>
        <h1 className="font-display mt-2 text-4xl font-semibold uppercase leading-none tracking-[-0.05em]">
          Search skills.
        </h1>
      </section>

      <section className="rounded-[24px] border border-[var(--border-medium)] bg-white p-3">
        <div className="flex h-13 items-center gap-3 rounded-[17px] bg-[var(--surface-soft)] px-4">
          <Search className="h-4.5 w-4.5 shrink-0 text-[var(--text-tertiary)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Skill name, alias or FIG code"
            className="h-13 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-tertiary)]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-tertiary)] hover:bg-white"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setApparatus('All')}
            className={`h-9 shrink-0 rounded-full px-4 text-xs font-semibold ${
              apparatus === 'All'
                ? 'bg-[var(--accent)] text-white'
                : 'border border-[var(--border-subtle)] bg-white text-[var(--text-secondary)]'
            }`}
          >
            All
          </button>
          {ALL_APPARATUS.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => setApparatus(item.name)}
              className={`h-9 shrink-0 rounded-full px-4 text-xs font-semibold ${
                apparatus === item.name
                  ? 'bg-[var(--accent)] text-white'
                  : 'border border-[var(--border-subtle)] bg-white text-[var(--text-secondary)]'
              }`}
            >
              {item.code}
            </button>
          ))}
        </div>

        <div className="mt-2 flex gap-1 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setDifficulty('All')}
            className={`flex h-8 min-w-10 shrink-0 items-center justify-center rounded-full px-2 text-[10px] font-bold ${
              difficulty === 'All'
                ? 'bg-[var(--accent-soft)] text-[var(--text-primary)]'
                : 'text-[var(--text-tertiary)]'
            }`}
          >
            All
          </button>
          {DIFFICULTY_LEVELS.map((level) => (
            <button
              key={level.letter}
              type="button"
              onClick={() => setDifficulty(level.letter)}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                difficulty === level.letter
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)]'
              }`}
            >
              {level.letter}
            </button>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Results</h2>
        <span className="text-[10px] font-medium text-[var(--text-tertiary)]">{filteredSkills.length} skills</span>
      </div>

      <section className="overflow-hidden rounded-[24px] border border-[var(--border-medium)] bg-white">
        {filteredSkills.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <Search className="mx-auto h-5 w-5 text-[var(--text-tertiary)]" />
            <p className="mt-3 text-sm font-semibold">No matching skills</p>
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">Try a different search or filter.</p>
          </div>
        ) : (
          filteredSkills.map((skill, index) => {
            const isFavorite = favoriteSkillIds.includes(skill.id);
            const targetRoutine = routines.find((routine) => routine.apparatus === skill.apparatus);

            return (
              <div
                key={skill.id}
                className={`flex items-center gap-3 p-3.5 sm:p-4 ${
                  index > 0 ? 'border-t border-[var(--border-subtle)]' : ''
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    markSkillViewed(skill);
                    setSelectedSkill(skill);
                  }}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[var(--accent-soft)] text-xs font-bold">
                    {skill.difficulty}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{skill.name}</span>
                    <span className="mt-1 block truncate text-[10px] text-[var(--text-tertiary)]">
                      {skill.apparatus} · FIG {skill.figCode} · Group {skill.elementGroupNumber}
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleFavorite(skill.id)}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    isFavorite
                      ? 'bg-[var(--accent-soft)] text-[var(--text-primary)]'
                      : 'text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)]'
                  }`}
                  aria-label="Save skill"
                >
                  <Bookmark className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} />
                </button>

                <button
                  type="button"
                  disabled={!targetRoutine}
                  onClick={() => targetRoutine && addSkillToRoutine(targetRoutine.id, skill)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white disabled:bg-[var(--accent-soft)] disabled:text-[var(--text-tertiary)]"
                  title={targetRoutine ? `Add to ${targetRoutine.name}` : 'Create a matching routine first'}
                  aria-label="Add skill to routine"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};
