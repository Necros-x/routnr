import React from 'react';
import {
  ArrowRight,
  Plus,
  Search,
  ListChecks,
  Star,
  Activity,
} from 'lucide-react';
import { useGymnasticsStore } from '../hooks/useGymnasticsStore';
import { ALL_APPARATUS } from '../data/mockSkills';
import { APP_CONFIG } from '../config/app';

export const HomeScreen: React.FC = () => {
  const {
    routines,
    setActiveTab,
    openRoutineInBuilder,
    recentlyViewedSkills,
    setSelectedSkill,
    setCreateRoutineModalOpen,
    favoriteSkillIds,
    markSkillViewed,
  } = useGymnasticsStore();

  const latestRoutine = routines[0] || null;
  const highestScore = Math.max(...routines.map((routine) => routine.summary.totalDScore), 0);

  return (
    <div className="space-y-8">
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)]">
        <div className="rounded-[28px] border border-[var(--border-subtle)] bg-[var(--surface-soft)] p-6 sm:p-8 lg:p-10">
          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
            {APP_CONFIG.eyebrow} · {APP_CONFIG.codeCycle}
          </p>
          <h2 className="font-display max-w-3xl text-4xl font-semibold leading-[0.98] text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
            Build the routine. Find the skill. Keep moving.
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-6 text-[var(--text-secondary)] sm:text-base">
            A focused gymnastics workspace for searching elements and assembling competition routines without the extra noise.
          </p>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <button
              type="button"
              onClick={() => setCreateRoutineModalOpen(true)}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              Create routine
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('skills')}
              className="inline-flex h-12 items-center gap-2 rounded-full border border-[var(--border-medium)] bg-white px-5 text-sm font-semibold text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-hover)]"
            >
              <Search className="h-4 w-4" />
              Search skills
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <div className="surface rounded-[24px] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[var(--accent-soft)] text-[var(--text-primary)]">
                <ListChecks className="h-4.5 w-4.5" />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">Routines</span>
            </div>
            <p className="mt-8 text-3xl font-semibold tracking-[-0.05em]">{routines.length}</p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">Saved locally on this device</p>
          </div>

          <div className="surface rounded-[24px] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[var(--accent-soft)] text-[var(--text-primary)]">
                <Activity className="h-4.5 w-4.5" />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">Best D</span>
            </div>
            <p className="mt-8 text-3xl font-semibold tracking-[-0.05em]">{highestScore.toFixed(2)}</p>
            <p className="mt-1 text-xs text-[var(--text-secondary)]">Highest calculated routine</p>
          </div>
        </div>
      </section>

      {latestRoutine && (
        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">Continue</p>
              <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Latest routine</h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('routines')}
              className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              View all
            </button>
          </div>

          <button
            type="button"
            onClick={() => openRoutineInBuilder(latestRoutine.id)}
            className="surface group flex w-full flex-col gap-5 rounded-[26px] p-5 text-left transition-transform hover:-translate-y-0.5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--text-secondary)]">
                  {latestRoutine.apparatus}
                </span>
                <span className="text-[11px] text-[var(--text-tertiary)]">{latestRoutine.lastEdited}</span>
              </div>
              <h4 className="mt-3 truncate text-xl font-semibold tracking-[-0.03em] sm:text-2xl">{latestRoutine.name}</h4>
              <p className="mt-2 text-xs text-[var(--text-secondary)]">
                {latestRoutine.skills.length} elements · DV {latestRoutine.summary.difficultyValue.toFixed(1)} · EG {latestRoutine.summary.elementGroupValue.toFixed(1)}
              </p>
            </div>

            <div className="flex w-full items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-4 sm:w-auto sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[var(--text-tertiary)]">D score</p>
                <p className="mt-1 text-3xl font-semibold tracking-[-0.05em]">{latestRoutine.summary.totalDScore.toFixed(2)}</p>
              </div>
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-white transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </button>
        </section>
      )}

      <section>
        <div className="mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">Explore</p>
          <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Apparatus</h3>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 xl:grid-cols-6">
          {ALL_APPARATUS.map((apparatus) => (
            <button
              key={apparatus.name}
              type="button"
              onClick={() => setActiveTab('skills')}
              className="surface group rounded-[20px] p-4 text-left transition-colors hover:bg-[var(--surface-soft)]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-black tracking-[-0.04em]">{apparatus.code}</span>
                <ArrowRight className="h-3.5 w-3.5 text-[var(--text-tertiary)] transition-transform group-hover:translate-x-0.5" />
              </div>
              <p className="mt-6 text-xs font-medium leading-4 text-[var(--text-secondary)]">{apparatus.name}</p>
            </button>
          ))}
        </div>
      </section>

      {recentlyViewedSkills.length > 0 && (
        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--text-tertiary)]">Reference</p>
              <h3 className="mt-1 text-xl font-semibold tracking-[-0.03em]">Recently viewed</h3>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-[var(--text-tertiary)]">
              <Star className="h-3.5 w-3.5" />
              {favoriteSkillIds.length} saved
            </div>
          </div>

          <div className="surface overflow-hidden rounded-[24px]">
            {recentlyViewedSkills.slice(0, 5).map((skill, index) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => {
                  markSkillViewed(skill);
                  setSelectedSkill(skill);
                }}
                className={`flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-[var(--surface-soft)] sm:px-5 ${
                  index > 0 ? 'border-t border-[var(--border-subtle)]' : ''
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[var(--accent-soft)] text-sm font-bold">
                  {skill.difficulty}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{skill.name}</span>
                  <span className="mt-1 block truncate text-[11px] text-[var(--text-tertiary)]">
                    {skill.apparatus} · FIG {skill.figCode}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-[var(--text-tertiary)]" />
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
