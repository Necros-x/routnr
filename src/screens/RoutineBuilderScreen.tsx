import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Info,
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

  const availableSkills = useMemo(() => {
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
      <div className="surface rounded-[28px] px-6 py-16 text-center">
        <h2 className="text-lg font-semibold">Routine not found</h2>
        <button type="button" onClick={onBack} className="mt-5 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white">
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
    <div className="space-y-5">
      <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="mb-4 inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to routines
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
              {routine.apparatus}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">{routine.skills.length} elements</span>
          </div>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            onBlur={saveTitle}
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.currentTarget.blur();
            }}
            className="font-display mt-2 w-full max-w-3xl bg-transparent text-3xl font-semibold tracking-[-0.04em] outline-none sm:text-4xl"
            aria-label="Routine title"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            ['DV', routine.summary.difficultyValue],
            ['EG', routine.summary.elementGroupValue],
            ['CV', routine.summary.connectionBonus],
          ].map(([label, value]) => (
            <div key={label as string} className="surface-soft min-w-[86px] rounded-[18px] px-4 py-3">
              <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--text-tertiary)]">{label}</p>
              <p className="mt-1 text-lg font-semibold tracking-[-0.04em]">{Number(value).toFixed(1)}</p>
            </div>
          ))}
          <div className="min-w-[108px] rounded-[18px] bg-[var(--accent)] px-4 py-3 text-white">
            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-white/60">D score</p>
            <p className="mt-1 text-2xl font-semibold tracking-[-0.05em]">{routine.summary.totalDScore.toFixed(2)}</p>
          </div>
        </div>
      </section>

      <section className="grid min-h-[620px] gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
        <div className="surface overflow-hidden rounded-[28px]">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-4 py-4 sm:px-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-tertiary)]">Sequence</p>
              <h3 className="mt-0.5 text-base font-semibold">Routine order</h3>
            </div>
            <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-[10px] font-semibold text-[var(--text-secondary)]">
              Top to bottom
            </span>
          </div>

          {routine.skills.length === 0 ? (
            <div className="flex min-h-[470px] flex-col items-center justify-center px-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[var(--accent-soft)]">
                <Plus className="h-5 w-5" />
              </div>
              <h4 className="mt-5 text-base font-semibold">Start with your first element</h4>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
                Search the {routine.apparatus} library on the right and add skills directly into this sequence.
              </p>
            </div>
          ) : (
            <div>
              {routine.skills.map((item, index) => {
                const bonus = item.connectionBonus || 0;
                return (
                  <div
                    key={item.instanceId}
                    className={`flex items-center gap-3 px-3 py-3 sm:gap-4 sm:px-5 sm:py-4 ${index > 0 ? 'border-t border-[var(--border-subtle)]' : ''}`}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[var(--surface-soft)] text-[11px] font-bold text-[var(--text-tertiary)]">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <button
                      type="button"
                      onClick={() => {
                        markSkillViewed(item.skill);
                        setSelectedSkill(item.skill);
                      }}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-sm font-semibold">{item.skill.name}</span>
                        <span className="rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[9px] font-bold">{item.skill.difficulty}</span>
                      </div>
                      <p className="mt-1 truncate text-[11px] text-[var(--text-secondary)]">
                        Group {item.skill.elementGroupNumber} · FIG {item.skill.figCode} · {item.skill.difficultyValue.toFixed(1)} DV
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const next = bonus === 0 ? 0.1 : bonus === 0.1 ? 0.2 : 0;
                        updateSkillConnectionBonus(routine.id, item.instanceId, next);
                      }}
                      className={`hidden h-8 items-center gap-1 rounded-full px-2.5 text-[10px] font-semibold sm:inline-flex ${bonus > 0 ? 'bg-[var(--accent)] text-white' : 'bg-[var(--surface-soft)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'}`}
                      title="Cycle connection value: 0, +0.1, +0.2"
                    >
                      <Link2 className="h-3.5 w-3.5" />
                      {bonus > 0 ? `+${bonus.toFixed(1)}` : 'CV'}
                    </button>

                    <div className="flex shrink-0 items-center gap-0.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveSkillOrder(routine.id, index, 'up')}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)] disabled:opacity-20"
                        aria-label="Move skill up"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled={index === routine.skills.length - 1}
                        onClick={() => moveSkillOrder(routine.id, index, 'down')}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)] disabled:opacity-20"
                        aria-label="Move skill down"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSkillFromRoutine(routine.id, item.instanceId)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-tertiary)] hover:bg-[#fff0f0] hover:text-[var(--danger)]"
                        aria-label="Remove skill"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="border-t border-[var(--border-subtle)] p-4 sm:p-5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--text-tertiary)]">Routine notes</label>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              onBlur={saveNotes}
              rows={3}
              placeholder="Landing cues, connection options, training notes…"
              className="mt-2 w-full resize-none rounded-[16px] border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-3 text-sm leading-6 outline-none transition-colors placeholder:text-[var(--text-tertiary)] focus:border-[var(--border-strong)]"
            />
          </div>
        </div>

        <aside className="surface flex min-h-[620px] flex-col overflow-hidden rounded-[28px]">
          <div className="border-b border-[var(--border-subtle)] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-tertiary)]">Skill library</p>
                <h3 className="mt-0.5 text-base font-semibold">{routine.apparatus}</h3>
              </div>
              <span className="text-[10px] font-semibold text-[var(--text-tertiary)]">{availableSkills.length} found</span>
            </div>

            <div className="mt-4 flex h-11 items-center gap-2.5 rounded-[15px] bg-[var(--surface-soft)] px-3.5">
              <Search className="h-4 w-4 text-[var(--text-tertiary)]" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search this apparatus…"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-tertiary)]"
              />
            </div>

            <div className="mt-3 flex gap-1 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setDifficulty('All')}
                className={`h-8 shrink-0 rounded-full px-3 text-[10px] font-semibold ${difficulty === 'All' ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)]'}`}
              >
                All
              </button>
              {DIFFICULTY_LEVELS.map((level) => (
                <button
                  key={level.letter}
                  type="button"
                  onClick={() => setDifficulty(level.letter)}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${difficulty === level.letter ? 'bg-[var(--accent)] text-white' : 'text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)]'}`}
                >
                  {level.letter}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {availableSkills.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Search className="mx-auto h-5 w-5 text-[var(--text-tertiary)]" />
                <p className="mt-3 text-sm font-semibold">No matching elements</p>
                <p className="mt-1 text-xs text-[var(--text-secondary)]">Try a different term or difficulty.</p>
              </div>
            ) : (
              availableSkills.map((skill, index) => (
                <div
                  key={skill.id}
                  className={`flex items-center gap-3 p-3.5 ${index > 0 ? 'border-t border-[var(--border-subtle)]' : ''}`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      markSkillViewed(skill);
                      setSelectedSkill(skill);
                    }}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[var(--accent-soft)] text-xs font-bold">{skill.difficulty}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-semibold">{skill.name}</span>
                      <span className="mt-1 block truncate text-[10px] text-[var(--text-tertiary)]">G{skill.elementGroupNumber} · FIG {skill.figCode}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      markSkillViewed(skill);
                      setSelectedSkill(skill);
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]"
                    aria-label={`View ${skill.name}`}
                  >
                    <Info className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => addSkillToRoutine(routine.id, skill)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-white transition-transform hover:-translate-y-0.5"
                    aria-label={`Add ${skill.name}`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </aside>
      </section>
    </div>
  );
};
