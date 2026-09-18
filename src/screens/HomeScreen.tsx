import React from 'react';
import { ArrowRight, Plus } from 'lucide-react';
import { useGymnasticsStore } from '../hooks/useGymnasticsStore';

export const HomeScreen: React.FC = () => {
  const {
    routines,
    setActiveTab,
    openRoutineInBuilder,
    setCreateRoutineModalOpen,
  } = useGymnasticsStore();

  const latestRoutine = routines[0] ?? null;
  const visibleRoutines = routines.slice(0, 4);

  return (
    <div className="space-y-9">
      <section>
        <p className="text-xs font-medium text-[var(--text-tertiary)]">Name —</p>
        <h1 className="font-display mt-2 text-3xl font-semibold uppercase leading-none tracking-[-0.05em] sm:text-4xl">
          Welcome back.
        </h1>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-[-0.03em]">Continue Building</h2>
          {routines.length > 1 && (
            <button
              type="button"
              onClick={() => setActiveTab('routines')}
              className="text-xs font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              View all
            </button>
          )}
        </div>

        {latestRoutine ? (
          <button
            type="button"
            onClick={() => openRoutineInBuilder(latestRoutine.id)}
            className="group w-full rounded-[26px] border border-[var(--border-medium)] bg-white p-5 text-left sm:p-6"
          >
            <div className="flex min-h-[170px] flex-col justify-between sm:min-h-[210px]">
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full bg-[var(--surface-soft)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.11em] text-[var(--text-secondary)]">
                  {latestRoutine.apparatus}
                </span>
                <div className="text-right">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">
                    D Score
                  </p>
                  <p className="mt-1 text-xl font-semibold tracking-[-0.05em]">
                    {latestRoutine.summary.totalDScore.toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold tracking-[-0.035em] sm:text-xl">
                  {latestRoutine.name}
                </h3>
                <div className="mt-3 flex items-center justify-between gap-4">
                  <p className="text-xs text-[var(--text-secondary)]">
                    {latestRoutine.skills.length} elements · {latestRoutine.lastEdited}
                  </p>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-white transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </div>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setCreateRoutineModalOpen(true)}
            className="flex min-h-[190px] w-full flex-col items-center justify-center rounded-[26px] border border-dashed border-[var(--border-strong)] bg-white text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-white">
              <Plus className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-sm font-semibold">Create your first routine</h3>
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">Choose an apparatus and start building</p>
          </button>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-[-0.03em]">Your Routines</h2>
          <button
            type="button"
            onClick={() => setCreateRoutineModalOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-medium)] bg-white text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            aria-label="Create routine"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {visibleRoutines.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {visibleRoutines.map((routine) => (
              <button
                key={routine.id}
                type="button"
                onClick={() => openRoutineInBuilder(routine.id)}
                className="min-h-[145px] rounded-[22px] border border-[var(--border-medium)] bg-white p-4 text-left transition-transform hover:-translate-y-0.5 sm:min-h-[170px] sm:p-5"
              >
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.11em] text-[var(--text-tertiary)]">
                      {routine.apparatus
                        .split(' ')
                        .map((word) => word[0])
                        .join('')
                        .slice(0, 2)}
                    </span>
                    <span className="text-xs font-semibold">{routine.summary.totalDScore.toFixed(2)}</span>
                  </div>

                  <div className="mt-8">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-5 tracking-[-0.02em] sm:text-base">
                      {routine.name}
                    </h3>
                    <p className="mt-2 text-[10px] text-[var(--text-tertiary)]">
                      {routine.skills.length} elements
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setCreateRoutineModalOpen(true)}
                className="flex min-h-[135px] items-center justify-center rounded-[22px] border border-dashed border-[var(--border-medium)] bg-white/60 text-[var(--text-tertiary)]"
              >
                <Plus className="h-4 w-4" />
              </button>
            ))}
          </div>
        )}

        {routines.length > 4 && (
          <button
            type="button"
            onClick={() => setActiveTab('routines')}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            See all {routines.length} routines
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        )}
      </section>
    </div>
  );
};
