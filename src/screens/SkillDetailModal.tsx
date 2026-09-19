import React, { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  ExternalLink,
  Image as ImageIcon,
  Plus,
  X,
} from 'lucide-react';
import { useGymnasticsStore } from '../hooks/useGymnasticsStore';
import { resolveBodyPart, resolveSkillType } from '../data/mockSkills';
import {
  CODE_FIGURE_BASE_PATH,
  MAG_CODE_PDF_URL,
} from '../config/code';

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
  const [figureMissing, setFigureMissing] = useState(false);

  const matchingRoutines = useMemo(
    () =>
      selectedSkill
        ? routines.filter(
            (routine) => routine.apparatus === selectedSkill.apparatus,
          )
        : [],
    [routines, selectedSkill],
  );

  useEffect(() => {
    if (!selectedSkill) return;
    setSelectedRoutineId(matchingRoutines[0]?.id ?? '');
    setFigureMissing(false);
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
  const selectedRoutine = matchingRoutines.find(
    (routine) => routine.id === selectedRoutineId,
  );

  const related = skills
    .filter(
      (skill) =>
        skill.id !== selectedSkill.id &&
        skill.apparatus === selectedSkill.apparatus,
    )
    .slice(0, 3);

  const figureSrc =
    selectedSkill.codeFigure?.src ??
    `${CODE_FIGURE_BASE_PATH}/${selectedSkill.id}.webp`;

  const figureAlt =
    selectedSkill.codeFigure?.alt ??
    `${selectedSkill.name} Code of Points illustration`;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-end justify-center bg-black/20 p-0 backdrop-blur-[5px] sm:items-center sm:p-5"
      onMouseDown={() => setSelectedSkill(null)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={selectedSkill.name}
        onMouseDown={(event) => event.stopPropagation()}
        className="glass-float backdrop-blur-[2px] max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] p-4 sm:max-w-2xl sm:rounded-[28px]"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
            {selectedSkill.apparatus}
          </p>

          <button
            type="button"
            onClick={() => setSelectedSkill(null)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[18px] bg-white/45 text-[var(--text-secondary)] hover:bg-white/65 hover:text-[var(--text-primary)]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-3 overflow-hidden rounded-[12px] bg-white/45">
          {!figureMissing ? (
            <div className="relative aspect-[4/3] w-full bg-white/70">
              <img
                src={figureSrc}
                alt={figureAlt}
                onError={() => setFigureMissing(true)}
                className="h-full w-full object-contain p-4"
              />
            </div>
          ) : (
            <div className="flex aspect-[4/3] w-full flex-col items-center justify-center px-6 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-[22px] bg-white/70 text-[var(--text-secondary)]">
                <ImageIcon className="h-4.5 w-4.5" />
              </span>
              <p className="mt-3 text-xs font-semibold">
                Code illustration not installed yet
              </p>
              <p className="mt-1 max-w-xs text-[10px] leading-4 text-[var(--text-tertiary)]">
                This slot uses the official Code figure pack. It will display automatically once this skill’s figure is imported.
              </p>
              <a
                href={MAG_CODE_PDF_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                Open official Code PDF
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}

          {selectedSkill.codeFigure?.sourcePage && !figureMissing && (
            <div className="border-t border-[var(--border-subtle)] px-3 py-2 text-[9px] font-medium text-[var(--text-tertiary)]">
              Code page {selectedSkill.codeFigure.sourcePage}
              {selectedSkill.codeFigure.elementNumber
                ? ` · Element ${selectedSkill.codeFigure.elementNumber}`
                : ''}
            </div>
          )}
        </div>

        <div className="mt-4">
          <h2 className="font-display text-xl font-semibold leading-tight sm:text-2xl">
            {selectedSkill.name}
          </h2>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-[var(--accent)] px-3 py-1.5 text-[10px] font-bold text-white">
              Difficulty {selectedSkill.difficulty} · {selectedSkill.difficultyValue.toFixed(1)}
            </span>
            <span className="rounded-full bg-white/55 px-3 py-1.5 text-[10px] font-semibold text-[var(--text-secondary)]">
              Group {selectedSkill.elementGroupNumber}
            </span>
            <span className="rounded-full bg-white/55 px-3 py-1.5 text-[10px] font-semibold text-[var(--text-secondary)]">
              FIG {selectedSkill.figCode}
            </span>
          </div>

          <p className="mt-3 text-[11px] leading-5 text-[var(--text-secondary)]">
            {selectedSkill.elementGroup}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="rounded-[12px] bg-white/45 p-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
              Type
            </p>
            <p className="mt-1.5 text-[11px] font-semibold">
              {resolveSkillType(selectedSkill)}
            </p>
          </div>

          <div className="rounded-[12px] bg-white/45 p-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
              Body focus
            </p>
            <p className="mt-1.5 text-[11px] font-semibold">
              {resolveBodyPart(selectedSkill)}
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-[12px] bg-white/45 p-4">
          <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
            Technical definition
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">
            {selectedSkill.description}
          </p>
        </div>

        {selectedSkill.aliases.length > 0 && (
          <div className="mt-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
              Also known as
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedSkill.aliases.map((alias) => (
                <span
                  key={alias}
                  className="rounded-full border border-[var(--border-subtle)] bg-white/55 px-3 py-1.5 text-[10px] text-[var(--text-secondary)]"
                >
                  {alias}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-5 border-t border-[var(--border-subtle)] pt-4">
          {matchingRoutines.length > 0 ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                value={selectedRoutineId}
                onChange={(event) => setSelectedRoutineId(event.target.value)}
                className="h-11 min-w-0 flex-1 rounded-[12px] border border-[var(--border-subtle)] bg-white/55 px-3 text-xs outline-none"
              >
                {matchingRoutines.map((routine) => (
                  <option key={routine.id} value={routine.id}>
                    {routine.name} · D {routine.summary.totalDScore.toFixed(2)}
                  </option>
                ))}
              </select>

              <button
                type="button"
                disabled={!selectedRoutine}
                onClick={() =>
                  selectedRoutine &&
                  addSkillToRoutine(selectedRoutine.id, selectedSkill)
                }
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[22px] bg-[var(--accent)] px-5 text-xs font-semibold text-white disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
                Add to routine
              </button>

              <button
                type="button"
                onClick={() => toggleFavorite(selectedSkill.id)}
                className={`flex h-11 w-11 items-center justify-center self-center rounded-[22px] border ${
                  isFavorite
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                    : 'border-[var(--border-medium)] bg-white/55 text-[var(--text-secondary)]'
                }`}
                aria-label="Toggle saved skill"
              >
                <Bookmark
                  className="h-4 w-4"
                  fill={isFavorite ? 'currentColor' : 'none'}
                />
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 rounded-[12px] bg-white/45 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-[var(--text-secondary)]">
                Create a {selectedSkill.apparatus} routine before adding this element.
              </p>
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
          <div className="mt-5 border-t border-[var(--border-subtle)] pt-4">
            <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
              More on {selectedSkill.apparatus}
            </p>

            <div className="mt-2 space-y-1">
              {related.map((skill) => (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => setSelectedSkill(skill)}
                  className="flex w-full items-center gap-3 rounded-[12px] px-3 py-3 text-left hover:bg-white/45"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-white/60 text-[10px] font-bold">
                    {skill.difficulty}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs font-semibold">
                    {skill.name}
                  </span>
                  <span className="text-[9px] text-[var(--text-tertiary)]">
                    FIG {skill.figCode}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
