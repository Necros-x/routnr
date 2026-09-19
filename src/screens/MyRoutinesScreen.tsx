import React, { useMemo, useState } from 'react';
import { Crown, MoreHorizontal, Plus } from 'lucide-react';
import { AllAroundSummaryCard } from '../components/AllAroundSummaryCard';
import { RoutineActionsSheet } from '../components/RoutineActionsSheet';
import { MAG_APPARATUS_CODES, MAG_APPARATUS_ORDER } from '../config/mag';
import { useGymnasticsStore } from '../hooks/useGymnasticsStore';

interface MyRoutinesScreenProps {
  onOpenBuilder: (routineId: string) => void;
}

export const MyRoutinesScreen: React.FC<MyRoutinesScreenProps> = ({
  onOpenBuilder,
}) => {
  const {
    routines,
    deleteRoutine,
    duplicateRoutine,
    openCreateRoutineModal,
    setPrimaryRoutine,
    isPrimaryRoutine,
    getAllAroundSummary,
  } = useGymnasticsStore();

  const [actionRoutineId, setActionRoutineId] = useState<string | null>(null);

  const allAround = getAllAroundSummary();
  const actionRoutine = useMemo(
    () => routines.find((routine) => routine.id === actionRoutineId) ?? null,
    [actionRoutineId, routines],
  );

  return (
    <div className="space-y-7">
      <section className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-[var(--text-tertiary)]">
            Main routines build your AA summary
          </p>
          <h1 className="font-display mt-2 text-3xl font-semibold uppercase leading-none tracking-[-0.05em] sm:text-4xl">
            Your routines.
          </h1>
        </div>

        <button
          type="button"
          onClick={() => openCreateRoutineModal()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[20px] bg-[var(--accent)] text-white"
          aria-label="Create routine"
        >
          <Plus className="h-4 w-4" />
        </button>
      </section>

      <AllAroundSummaryCard summary={allAround} />

      <div className="space-y-8">
        {MAG_APPARATUS_ORDER.map((apparatus) => {
          const eventRoutines = routines.filter(
            (routine) => routine.apparatus === apparatus,
          );

          return (
            <section key={apparatus}>
              <div className="mb-3 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--text-tertiary)]">
                    {MAG_APPARATUS_CODES[apparatus]}
                  </p>
                  <h2 className="mt-1 text-base font-semibold tracking-[-0.025em]">
                    {apparatus}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[var(--text-tertiary)]">
                    {eventRoutines.length} routine
                    {eventRoutines.length === 1 ? '' : 's'}
                  </span>
                  <button
                    type="button"
                    onClick={() => openCreateRoutineModal(apparatus)}
                    className="flex h-8 w-8 items-center justify-center rounded-[16px] border border-[var(--border-medium)] bg-white text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    aria-label={`Add ${apparatus} routine`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {eventRoutines.length === 0 ? (
                <button
                  type="button"
                  onClick={() => openCreateRoutineModal(apparatus)}
                  className="flex min-h-[110px] w-full items-center justify-center rounded-[22px] border border-dashed border-[var(--border-medium)] bg-white/55 px-4 text-xs font-medium text-[var(--text-tertiary)]"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add a {apparatus} routine
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                  {eventRoutines.map((routine) => {
                    const primary = isPrimaryRoutine(routine.id);

                    return (
                      <div
                        key={routine.id}
                        className={`group relative min-h-[160px] rounded-[22px] border bg-white p-4 transition-colors sm:min-h-[180px] ${
                          primary
                            ? 'border-[var(--border-strong)]'
                            : 'border-[var(--border-medium)]'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => onOpenBuilder(routine.id)}
                          className="flex h-full w-full flex-col pr-9 text-left"
                        >
                          <div>
                            {primary && (
                              <span className="inline-flex rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)]">
                                Main AA
                              </span>
                            )}

                            <h3 className="mt-3 line-clamp-2 text-sm font-semibold leading-5 tracking-[-0.02em] sm:text-base">
                              {routine.name}
                            </h3>

                            <p className="mt-2 text-[10px] text-[var(--text-tertiary)]">
                              {routine.skills.length} elements
                            </p>
                          </div>

                          <div className="mt-auto grid grid-cols-3 gap-2 pt-5">
                            <div>
                              <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                                DV
                              </p>
                              <p className="mt-1 text-xs font-semibold">
                                {routine.summary.difficultyValue.toFixed(1)}
                              </p>
                            </div>
                            <div>
                              <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                                G
                              </p>
                              <p className="mt-1 text-xs font-semibold">
                                {routine.summary.elementGroupValue.toFixed(1)}
                              </p>
                            </div>
                            <div>
                              <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
                                D
                              </p>
                              <p className="mt-1 text-xs font-semibold">
                                {routine.summary.totalDScore.toFixed(1)}
                              </p>
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setPrimaryRoutine(routine.id)}
                          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-[16px] border transition-colors ${
                            primary
                              ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                              : 'border-[var(--border-medium)] bg-white text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
                          }`}
                          aria-label={
                            primary
                              ? `${routine.name} is the main ${apparatus} routine`
                              : `Set ${routine.name} as main ${apparatus} routine`
                          }
                          title={
                            primary
                              ? 'Used in All Around summary'
                              : 'Set as main routine'
                          }
                        >
                          <Crown
                            className="h-3.5 w-3.5"
                            fill={primary ? 'currentColor' : 'none'}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => setActionRoutineId(routine.id)}
                          className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-[16px] text-[var(--text-tertiary)] transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]"
                          aria-label={`More actions for ${routine.name}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>

      <RoutineActionsSheet
        routine={actionRoutine}
        isOpen={Boolean(actionRoutine)}
        onClose={() => setActionRoutineId(null)}
        onOpen={onOpenBuilder}
        onDuplicate={(routineId) => {
          duplicateRoutine(routineId);
        }}
        onDelete={deleteRoutine}
      />
    </div>
  );
};
