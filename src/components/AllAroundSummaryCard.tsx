'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { AllAroundSummary } from '../types/gymnastics';

interface AllAroundSummaryCardProps {
  summary: AllAroundSummary;
}

export function AllAroundSummaryCard({
  summary,
}: AllAroundSummaryCardProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className="overflow-hidden rounded-[24px] border border-[var(--border-medium)] bg-white">
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        className="flex w-full items-start justify-between gap-4 p-4 text-left sm:p-5"
        aria-expanded={expanded}
      >
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-[82px] w-[96px] shrink-0 flex-col items-center justify-center rounded-[16px] bg-[var(--accent-soft)] px-3">
            <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
              Σ D
            </span>
            <span className="mt-1 text-2xl font-semibold tracking-[-0.05em]">
              {summary.totalDScore.toFixed(1)}
            </span>
          </div>

          <div className="min-w-0 pt-1">
            <h2 className="text-xl font-semibold tracking-[-0.04em] sm:text-2xl">
              All Around
            </h2>
            <p className="mt-1 text-sm font-semibold text-[var(--text-secondary)]">
              {summary.totalDifficulty.toFixed(1)} difficulty
            </p>
            <p className="mt-1 text-[10px] text-[var(--text-tertiary)]">
              {summary.completedEvents}/6 main routines selected
              {summary.totalConnectionBonus > 0
                ? ` · +${summary.totalConnectionBonus.toFixed(1)} CV`
                : ''}
            </p>
          </div>
        </div>

        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[18px] bg-[var(--surface-soft)] text-[var(--text-secondary)]">
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-[var(--border-subtle)] px-4 pb-4 sm:px-5 sm:pb-5">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]">
                  <th className="px-2 py-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                    App.
                  </th>
                  <th className="px-2 py-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                    Routine
                  </th>
                  <th className="px-2 py-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                    Skills
                  </th>
                  <th className="px-2 py-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                    D
                  </th>
                  <th className="px-2 py-3 text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
                    G
                  </th>
                </tr>
              </thead>

              <tbody>
                {summary.rows.map((row) => (
                  <tr
                    key={row.code}
                    className="border-b border-[var(--border-subtle)] last:border-b-0"
                  >
                    <td className="px-2 py-3 text-[11px] font-semibold">
                      {row.code}
                    </td>
                    <td className="max-w-[220px] px-2 py-3">
                      <p
                        className={`truncate text-[11px] ${
                          row.routineId
                            ? 'font-medium text-[var(--text-primary)]'
                            : 'text-[var(--text-tertiary)]'
                        }`}
                      >
                        {row.routineName}
                      </p>
                    </td>
                    <td className="px-2 py-3 text-[11px] text-[var(--text-secondary)]">
                      {row.routineId ? row.skills : '—'}
                    </td>
                    <td className="px-2 py-3 text-[11px] text-[var(--text-secondary)]">
                      {row.routineId ? row.difficultyValue.toFixed(1) : '—'}
                    </td>
                    <td className="px-2 py-3 text-[11px] text-[var(--text-secondary)]">
                      {row.routineId ? row.groupValue.toFixed(1) : '—'}
                    </td>
                  </tr>
                ))}

                <tr className="border-t border-[var(--border-medium)]">
                  <td className="px-2 pt-3 text-[11px] font-bold">AA</td>
                  <td className="px-2 pt-3 text-[10px] font-medium text-[var(--text-tertiary)]">
                    Main routines
                  </td>
                  <td className="px-2 pt-3 text-[11px] font-bold">
                    {summary.totalSkills}
                  </td>
                  <td className="px-2 pt-3 text-[11px] font-bold">
                    {summary.totalDifficulty.toFixed(1)}
                  </td>
                  <td className="px-2 pt-3 text-[11px] font-bold">
                    {summary.totalGroup.toFixed(1)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-[9px] leading-4 text-[var(--text-tertiary)]">
            Σ D is the combined ROUTNR D-score of the selected main routines.
            Execution scores are not tracked yet, so this is not a full competition
            all-around total.
          </p>
        </div>
      )}
    </section>
  );
}
