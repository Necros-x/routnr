import React from 'react';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';
import { useGymnasticsStore } from '../hooks/useGymnasticsStore';

interface MyRoutinesScreenProps {
  onOpenBuilder: (routineId: string) => void;
}

export const MyRoutinesScreen: React.FC<MyRoutinesScreenProps> = ({ onOpenBuilder }) => {
  const { routines, deleteRoutine, setCreateRoutineModalOpen } = useGymnasticsStore();

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">Workspace</p>
          <h2 className="font-display mt-1 text-3xl font-semibold sm:text-4xl">Your routines.</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">Open one to edit the sequence, search matching skills, and track the D score.</p>
        </div>
        <button
          type="button"
          onClick={() => setCreateRoutineModalOpen(true)}
          className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          New routine
        </button>
      </section>

      {routines.length === 0 ? (
        <section className="surface rounded-[28px] px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[var(--accent-soft)]">
            <Plus className="h-5 w-5" />
          </div>
          <h3 className="mt-5 text-lg font-semibold">No routines yet</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">Create your first apparatus routine and start adding skills from the library.</p>
          <button
            type="button"
            onClick={() => setCreateRoutineModalOpen(true)}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" /> Create first routine
          </button>
        </section>
      ) : (
        <section className="surface overflow-hidden rounded-[28px]">
          {routines.map((routine, index) => (
            <div
              key={routine.id}
              className={`group flex items-center gap-3 p-4 sm:gap-5 sm:p-5 ${index > 0 ? 'border-t border-[var(--border-subtle)]' : ''}`}
            >
              <button
                type="button"
                onClick={() => onOpenBuilder(routine.id)}
                className="flex min-w-0 flex-1 items-center gap-4 text-left"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[var(--accent-soft)] text-[11px] font-black tracking-[-0.03em]">
                  {routine.apparatus
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold sm:text-base">{routine.name}</span>
                  <span className="mt-1 block truncate text-[11px] text-[var(--text-secondary)]">
                    {routine.apparatus} · {routine.skills.length} elements · {routine.lastEdited}
                  </span>
                </span>
                <span className="hidden shrink-0 text-right sm:block">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">D score</span>
                  <span className="mt-1 block text-xl font-semibold tracking-[-0.04em]">{routine.summary.totalDScore.toFixed(2)}</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete “${routine.name}”?`)) deleteRoutine(routine.id);
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--text-tertiary)] transition-colors hover:bg-[#fff0f0] hover:text-[var(--danger)]"
                aria-label={`Delete ${routine.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpenBuilder(routine.id)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white transition-transform group-hover:translate-x-0.5"
                aria-label={`Open ${routine.name}`}
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
