import React from 'react';
import { ArrowRight, Plus, Trash2 } from 'lucide-react';
import { useGymnasticsStore } from '../hooks/useGymnasticsStore';

interface MyRoutinesScreenProps {
  onOpenBuilder: (routineId: string) => void;
}

export const MyRoutinesScreen: React.FC<MyRoutinesScreenProps> = ({ onOpenBuilder }) => {
  const { routines, deleteRoutine, setCreateRoutineModalOpen } = useGymnasticsStore();

  return (
    <div className="space-y-7">
      <section className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[var(--text-tertiary)]">Saved locally</p>
          <h1 className="font-display mt-2 text-4xl font-semibold uppercase leading-none tracking-[-0.05em]">
            Your routines.
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setCreateRoutineModalOpen(true)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white"
          aria-label="Create routine"
        >
          <Plus className="h-4 w-4" />
        </button>
      </section>

      {routines.length === 0 ? (
        <button
          type="button"
          onClick={() => setCreateRoutineModalOpen(true)}
          className="flex min-h-[260px] w-full flex-col items-center justify-center rounded-[26px] border border-dashed border-[var(--border-strong)] bg-white text-center"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-white">
            <Plus className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-sm font-semibold">Create your first routine</h2>
          <p className="mt-1 text-xs text-[var(--text-tertiary)]">Choose an apparatus and start building</p>
        </button>
      ) : (
        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {routines.map((routine) => (
            <div
              key={routine.id}
              className="group relative min-h-[175px] rounded-[24px] border border-[var(--border-medium)] bg-white p-4 sm:min-h-[205px] sm:p-5"
            >
              <button
                type="button"
                onClick={() => onOpenBuilder(routine.id)}
                className="flex h-full w-full flex-col text-left"
              >
                <div className="flex items-start justify-between gap-3 pr-8">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                    {routine.apparatus}
                  </span>
                  <span className="text-lg font-semibold tracking-[-0.05em]">
                    {routine.summary.totalDScore.toFixed(2)}
                  </span>
                </div>

                <div className="mt-auto pt-8">
                  <h2 className="line-clamp-2 text-base font-semibold leading-5 tracking-[-0.025em] sm:text-lg">
                    {routine.name}
                  </h2>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-[10px] text-[var(--text-tertiary)]">
                      {routine.skills.length} elements
                    </p>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-white transition-transform group-hover:translate-x-0.5">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete “${routine.name}”?`)) deleteRoutine(routine.id);
                }}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-tertiary)] opacity-100 transition-colors hover:bg-[#fff1f1] hover:text-[var(--danger)] sm:opacity-0 sm:group-hover:opacity-100"
                aria-label={`Delete ${routine.name}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setCreateRoutineModalOpen(true)}
            className="flex min-h-[175px] items-center justify-center rounded-[24px] border border-dashed border-[var(--border-strong)] bg-white/50 text-[var(--text-tertiary)] sm:min-h-[205px]"
          >
            <Plus className="h-5 w-5" />
          </button>
        </section>
      )}
    </div>
  );
};
