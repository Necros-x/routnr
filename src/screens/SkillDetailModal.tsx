import React, { useEffect, useMemo, useState } from 'react';
import { Bookmark, Plus, X } from 'lucide-react';
import { useGymnasticsStore } from '../hooks/useGymnasticsStore';
import { resolveBodyPart, resolveSkillType } from '../data/mockSkills';

export const SkillDetailModal: React.FC = () => {
  const {
    selectedSkill,
    setSelectedSkill,
    favoriteSkillIds,
    toggleFavorite,
    routines,
    addSkillToRoutine,
    setCreateRoutineModalOpen,
    skills,
  } = useGymnasticsStore();
  const [selectedRoutineId, setSelectedRoutineId] = useState('');

  const matchingRoutines = useMemo(
    () => (selectedSkill ? routines.filter((routine) => routine.apparatus === selectedSkill.apparatus) : []),
    [routines, selectedSkill]
  );

  useEffect(() => {
    if (!selectedSkill) return;
    setSelectedRoutineId(matchingRoutines[0]?.id ?? '');
  }, [matchingRoutines, selectedSkill]);

  useEffect(() => {
    if (!selectedSkill) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedSkill(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedSkill, setSelectedSkill]);

  if (!selectedSkill) return null;

  const isFavorite = favoriteSkillIds.includes(selectedSkill.id);
  const selectedRoutine = matchingRoutines.find((routine) => routine.id === selectedRoutineId);
  const related = skills
    .filter((skill) => skill.id !== selectedSkill.id && skill.apparatus === selectedSkill.apparatus)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/20 p-0 backdrop-blur-[3px] sm:items-center sm:p-5" onMouseDown={() => setSelectedSkill(null)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={selectedSkill.name}
        onMouseDown={(event) => event.stopPropagation()}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-[30px] border border-[var(--border-subtle)] bg-white p-5 shadow-[var(--shadow-float)] sm:max-w-2xl sm:rounded-[30px] sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[var(--accent)] px-2.5 py-1 text-[10px] font-bold text-white">{selectedSkill.difficulty} · {selectedSkill.difficultyValue.toFixed(1)}</span>
              <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--text-secondary)]">FIG {selectedSkill.figCode}</span>
              <span className="rounded-full bg-[var(--surface-soft)] px-2.5 py-1 text-[10px] font-semibold text-[var(--text-secondary)]">Group {selectedSkill.elementGroupNumber}</span>
            </div>
            <h2 className="font-display mt-4 text-2xl font-semibold leading-tight sm:text-3xl">{selectedSkill.name}</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">{selectedSkill.apparatus}</p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedSkill(null)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--surface-soft)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="surface-soft rounded-[18px] p-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Type</p>
            <p className="mt-2 text-xs font-semibold">{resolveSkillType(selectedSkill)}</p>
          </div>
          <div className="surface-soft rounded-[18px] p-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Body focus</p>
            <p className="mt-2 text-xs font-semibold">{resolveBodyPart(selectedSkill)}</p>
          </div>
          <div className="surface-soft rounded-[18px] p-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Element group</p>
            <p className="mt-2 text-xs font-semibold">Group {selectedSkill.elementGroupNumber}</p>
          </div>
        </div>

        <div className="mt-5 rounded-[20px] border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-4 sm:p-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Technical definition</p>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{selectedSkill.description}</p>
        </div>

        {selectedSkill.aliases.length > 0 && (
          <div className="mt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Also known as</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedSkill.aliases.map((alias) => (
                <span key={alias} className="rounded-full border border-[var(--border-subtle)] bg-white px-3 py-1.5 text-[11px] text-[var(--text-secondary)]">{alias}</span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 border-t border-[var(--border-subtle)] pt-5">
          {matchingRoutines.length > 0 ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={selectedRoutineId}
                onChange={(event) => setSelectedRoutineId(event.target.value)}
                className="h-11 min-w-0 flex-1 rounded-[14px] border border-[var(--border-subtle)] bg-[var(--surface-soft)] px-3 text-xs outline-none"
              >
                {matchingRoutines.map((routine) => (
                  <option key={routine.id} value={routine.id}>{routine.name} · D {routine.summary.totalDScore.toFixed(2)}</option>
                ))}
              </select>
              <button
                type="button"
                disabled={!selectedRoutine}
                onClick={() => selectedRoutine && addSkillToRoutine(selectedRoutine.id, selectedSkill)}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-5 text-xs font-semibold text-white disabled:opacity-40"
              >
                <Plus className="h-4 w-4" /> Add to routine
              </button>
              <button
                type="button"
                onClick={() => toggleFavorite(selectedSkill.id)}
                className={`flex h-11 w-11 items-center justify-center self-center rounded-full border ${isFavorite ? 'border-[var(--accent)] bg-[var(--accent)] text-white' : 'border-[var(--border-medium)] bg-white text-[var(--text-secondary)]'}`}
                aria-label="Toggle saved skill"
              >
                <Bookmark className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 rounded-[18px] bg-[var(--surface-soft)] p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-[var(--text-secondary)]">Create a {selectedSkill.apparatus} routine before adding this element.</p>
              <button
                type="button"
                onClick={() => {
                  setSelectedSkill(null);
                  setCreateRoutineModalOpen(true);
                }}
                className="shrink-0 rounded-full bg-[var(--accent)] px-4 py-2.5 text-xs font-semibold text-white"
              >
                Create routine
              </button>
            </div>
          )}
        </div>

        {related.length > 0 && (
          <div className="mt-6 border-t border-[var(--border-subtle)] pt-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">More on {selectedSkill.apparatus}</p>
            <div className="mt-2 space-y-1">
              {related.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => setSelectedSkill(skill)}
                  className="flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-left hover:bg-[var(--surface-soft)]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--accent-soft)] text-[10px] font-bold">{skill.difficulty}</span>
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold">{skill.name}</span>
                  <span className="text-[10px] text-[var(--text-tertiary)]">FIG {skill.figCode}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
