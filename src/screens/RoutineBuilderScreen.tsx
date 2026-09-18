import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Link2,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { useGymnasticsStore } from '../hooks/useGymnasticsStore';
import { DIFFICULTY_LEVELS } from '../data/mockSkills';

interface RoutineBuilderScreenProps {
  onBack: () => void;
}

export const RoutineBuilderScreen: React.FC<RoutineBuilderScreenProps> = ({ onBack }) => {
  const {
    getActiveRoutine,
    skills,
    addSkillToRoutine,
    removeSkillFromRoutine,
    updateSkillConnectionBonus,
    moveSkillOrder,
    updateRoutineTitle,
    updateRoutineNotes,
    setSelectedSkill,
    markSkillViewed,
  } = useGymnasticsStore();

  const routine = getActiveRoutine();

  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [title, setTitle] = useState(routine?.name ?? '');
  const [notes, setNotes] = useState(routine?.notes ?? '');

  useEffect(() => {
    setTitle(routine?.name ?? '');
    setNotes(routine?.notes ?? '');
  }, [routine?.id, routine?.name, routine?.notes]);

  const matchingSkills = useMemo(() => {
    if (!routine) return [];

    const normalized = query.trim().toLowerCase();

    return skills.filter((skill) => {
      const matchesApparatus = skill.apparatus === routine.apparatus;
      const matchesDifficulty = difficulty === 'All' || skill.difficulty === difficulty;
      const matchesQuery =
        !normalized ||
        skill.name.toLowerCase().includes(normalized) ||
        skill.figCode.toLowerCase().includes(normalized) ||
        skill.aliases.some((alias) => alias.toLowerCase().includes(normalized));

      return matchesApparatus && matchesDifficulty && matchesQuery;
    });
  }, [difficulty, query, routine, skills]);

  if (!routine) {
    return (
      <div className="rounded-[24px] border border-[var(--border-medium)] bg-white p-8 text-center">
        <p className="text-sm font-semibold">Routine not found</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 rounded-full bg-[var(--accent)] px-5 py-2.5 text-xs font-semibold text-white"
        >
          Back to routines
        </button>
      </div>
    );
  }

  const saveTitle = () => {
    const next = title.trim() || routine.name;
    setTitle(next);
    if (next !== routine.name) updateRoutineTitle(routine.id, next);
  };

  const saveNotes = () => {
    if (notes !== (routine.notes ?? '')) updateRoutineNotes(routine.id, notes);
  };

  return (
    <div className="space-y-6">
      <section>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Routines
        </button>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full border border-[var(--border-medium)] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
            {routine.apparatus}
          </span>
          <span className="text-[10px] font-medium text-[var(--text-tertiary)]">
            {routine.skills.length} elements
          </span>
        </div>

        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onBlur={saveTitle}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur();
          }}
          className="font-display mt-3 w-full bg-transparent text-4xl font-semibold tracking-[-0.05em] outline-none"
          aria-label="Routine title"
        />
      </section>

      <section className="grid grid-cols-4 gap-2">
        <div className="rounded-[18px] border border-[var(--border-medium)] bg-white p-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">DV</p>
          <p className="mt-1 text-lg font-semibold">{routine.summary.difficultyValue.toFixed(1)}</p>
        </div>
        <div className="rounded-[18px] border border-[var(--border-medium)] bg-white p-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">EG</p>
          <p className="mt-1 text-lg font-semibold">{routine.summary.elementGroupValue.toFixed(1)}</p>
        </div>
        <div className="rounded-[18px] border border-[var(--border-medium)] bg-white p-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">CV</p>
          <p className="mt-1 text-lg font-semibold">{routine.summary.connectionBonus.toFixed(1)}</p>
        </div>
        <div className="rounded-[18px] bg-[var(--accent)] p-3 text-white">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/60">D</p>
          <p className="mt-1 text-lg font-semibold">{routine.summary.totalDScore.toFixed(2)}</p>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-[-0.03em]">Routine</h2>
          <span className="text-[10px] font-medium text-[var(--text-tertiary)]">Tap a skill for details</span>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-[var(--border-medium)] bg-white">
          {routine.skills.length === 0 ? (
            <div className="flex min-h-[190px] flex-col items-center justify-center px-6 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                <Plus className="h-4 w-4" />
              </span>
              <p className="mt-4 text-sm font-semibold">Add your first skill</p>
              <p className="mt-1 text-xs text-[var(--text-tertiary)]">Use the search section below.</p>
            </div>
          ) : (
            routine.skills.map((item, index) => {
              const connectionBonus = item.connectionBonus || 0;

              return (
                <div
                  key={item.instanceId}
                  className={`flex items-center gap-3 p-3.5 sm:p-4 ${
                    index > 0 ? 'border-t border-[var(--border-subtle)]' : ''
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[var(--surface-soft)] text-[10px] font-bold text-[var(--text-tertiary)]">
                    {index + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      markSkillViewed(item.skill);
                      setSelectedSkill(item.skill);
                    }}
                    className="min-w-0 flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold">{item.skill.name}</span>
                      <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[9px] font-bold">
                        {item.skill.difficulty}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-[10px] text-[var(--text-tertiary)]">
                      FIG {item.skill.figCode} · Group {item.skill.elementGroupNumber}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const next =
                        connectionBonus === 0
                          ? 0.1
                          : connectionBonus === 0.1
                            ? 0.2
                            : 0;

                      updateSkillConnectionBonus(routine.id, item.instanceId, next);
                    }}
                    className={`hidden h-8 shrink-0 items-center gap-1 rounded-full px-2.5 text-[10px] font-semibold sm:inline-flex ${
                      connectionBonus > 0
                        ? 'bg-[var(--accent)] text-white'
                        : 'bg-[var(--surface-soft)] text-[var(--text-tertiary)]'
                    }`}
                    title="Cycle connection value"
                  >
                    <Link2 className="h-3.5 w-3.5" />
                    {connectionBonus > 0 ? `+${connectionBonus.toFixed(1)}` : 'CV'}
                  </button>

                  <div className="flex shrink-0 items-center">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveSkillOrder(routine.id, index, 'up')}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)] disabled:opacity-20"
                      aria-label="Move up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === routine.skills.length - 1}
                      onClick={() => moveSkillOrder(routine.id, index, 'down')}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)] disabled:opacity-20"
                      aria-label="Move down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSkillFromRoutine(routine.id, item.instanceId)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-tertiary)] hover:bg-[#fff1f1] hover:text-[var(--danger)]"
                      aria-label="Remove skill"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold tracking-[-0.03em]">Add Skills</h2>

        <div className="rounded-[24px] border border-[var(--border-medium)] bg-white p-3">
          <div className="flex h-12 items-center gap-3 rounded-[16px] bg-[var(--surface-soft)] px-4">
            <Search className="h-4 w-4 text-[var(--text-tertiary)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${routine.apparatus}`}
              className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-tertiary)]"
            />
          </div>

          <div className="mt-2 flex gap-1 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setDifficulty('All')}
              className={`h-8 shrink-0 rounded-full px-3 text-[10px] font-bold ${
                difficulty === 'All'
                  ? 'bg-[var(--accent)] text-white'
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
        </div>

        <div className="mt-3 overflow-hidden rounded-[24px] border border-[var(--border-medium)] bg-white">
          {matchingSkills.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Search className="mx-auto h-5 w-5 text-[var(--text-tertiary)]" />
              <p className="mt-3 text-sm font-semibold">No matching skills</p>
            </div>
          ) : (
            matchingSkills.map((skill, index) => (
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
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[var(--accent-soft)] text-xs font-bold">
                    {skill.difficulty}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{skill.name}</span>
                    <span className="mt-1 block truncate text-[10px] text-[var(--text-tertiary)]">
                      FIG {skill.figCode} · Group {skill.elementGroupNumber}
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => addSkillToRoutine(routine.id, skill)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white"
                  aria-label={`Add ${skill.name}`}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section>
        <label className="text-sm font-semibold">Notes</label>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          onBlur={saveNotes}
          rows={3}
          placeholder="Routine notes…"
          className="mt-3 w-full resize-none rounded-[22px] border border-[var(--border-medium)] bg-white p-4 text-sm leading-6 outline-none placeholder:text-[var(--text-tertiary)]"
        />
      </section>
    </div>
  );
};
