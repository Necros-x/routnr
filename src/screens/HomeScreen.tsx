import React from 'react';
import { Plus, ArrowRight, Compass, Layers, Sparkles, ChevronRight } from 'lucide-react';
import { useGymnasticsStore } from '../hooks/useGymnasticsStore';
import { ALL_APPARATUS } from '../data/mockSkills';
import { GlassCard } from '../components/ui/GlassCard';
import { PillButton } from '../components/ui/PillButton';
import { SectionHeader } from '../components/ui/SectionHeader';
import { TagChip } from '../components/ui/TagChip';
import { SkillCard } from '../components/SkillCard';
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
    toggleFavorite,
  } = useGymnasticsStore();

  const latestRoutine = routines[0] || null;

  const handleBrowseApparatus = () => {
    setActiveTab('skills');
    // We can also pass filter in store or session
  };

  return (
    <div className="space-y-6 pb-28">
      {/* Brand Header & Greeting */}
      <header className="pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-neutral-950 font-bold font-display text-sm tracking-tighter shadow-[0_0_16px_rgba(255,255,255,0.3)]">
              {APP_CONFIG.shortName}
            </div>
            <div>
              <span className="text-[10px] tracking-[0.2em] uppercase font-mono text-neutral-400 block leading-tight">
                {APP_CONFIG.codeCycle}
              </span>
              <h1 className="text-lg font-bold tracking-tight text-white font-display">
                {APP_CONFIG.name}
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCreateRoutineModalOpen(true)}
            className="h-8 px-3 rounded-full bg-white/[0.08] hover:bg-white hover:text-black border border-white/[0.12] text-xs font-semibold text-neutral-200 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Set</span>
          </button>
        </div>

        {/* Floating Quick Action Pills */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto no-scrollbar pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('routines')}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-white/[0.06] border border-white/[0.09] text-xs font-medium text-neutral-200 hover:bg-white/10 hover:text-white transition-all whitespace-nowrap"
          >
            <Layers className="w-3.5 h-3.5 text-neutral-400" />
            <span>My Routines</span>
            <span className="font-mono text-[10px] text-neutral-400 bg-white/10 px-1.5 py-0.2 rounded-full">
              {routines.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('skills')}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-white/[0.06] border border-white/[0.09] text-xs font-medium text-neutral-200 hover:bg-white/10 hover:text-white transition-all whitespace-nowrap"
          >
            <Compass className="w-3.5 h-3.5 text-neutral-400" />
            <span>Skill Library</span>
          </button>

          <button
            type="button"
            onClick={() => setCreateRoutineModalOpen(true)}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-all whitespace-nowrap shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Quick Create</span>
          </button>
        </div>
      </header>

      {/* Hero Continue Building Routine */}
      {latestRoutine && (
        <section>
          <SectionHeader
            title="Continue Building"
            subtitle="Most recently edited"
            actionText="View all"
            onAction={() => setActiveTab('routines')}
          />
          <GlassCard
            variant="elevated"
            className="p-5 border-white/[0.14] hover:border-white/30 transition-all"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <TagChip variant="accent" size="xs">
                    {latestRoutine.apparatus}
                  </TagChip>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {latestRoutine.lastEdited}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight font-display truncate">
                  {latestRoutine.name}
                </h3>
                {latestRoutine.notes && (
                  <p className="text-xs text-neutral-400 line-clamp-1">
                    {latestRoutine.notes}
                  </p>
                )}
              </div>

              {/* D-Score Pill */}
              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono uppercase text-neutral-400 block">
                  Est. D-Score
                </span>
                <span className="text-2xl font-bold font-mono text-white">
                  {latestRoutine.summary.totalDScore.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Micro Skill sequence pills */}
            <div className="mt-4 pt-3.5 border-t border-white/[0.08] flex items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-hidden">
                {latestRoutine.skills.slice(0, 4).map((s, idx) => (
                  <span
                    key={s.instanceId}
                    className="inline-flex items-center gap-1 h-6 px-2 rounded-md bg-white/[0.06] border border-white/[0.08] text-[11px] font-mono text-neutral-300 whitespace-nowrap"
                  >
                    <span className="text-[9px] text-neutral-500">#{idx + 1}</span>
                    <span>{s.skill.difficulty}</span>
                  </span>
                ))}
                {latestRoutine.skills.length > 4 && (
                  <span className="text-[10px] font-mono text-neutral-500 pl-1">
                    +{latestRoutine.skills.length - 4} more
                  </span>
                )}
              </div>

              <PillButton
                variant="primary"
                size="sm"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                iconPosition="right"
                onClick={() => openRoutineInBuilder(latestRoutine.id)}
              >
                Open Builder
              </PillButton>
            </div>
          </GlassCard>
        </section>
      )}

      {/* Browse Apparatus */}
      <section>
        <SectionHeader
          title="Browse Apparatus"
          subtitle="Search by apparatus"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {ALL_APPARATUS.map((app) => (
            <GlassCard
              key={app.name}
              variant="interactive"
              onClick={handleBrowseApparatus}
              className="p-3.5 flex items-center justify-between group"
            >
              <div className="min-w-0">
                <span className="text-[10px] font-mono font-bold text-neutral-400 group-hover:text-white transition-colors">
                  {app.code}
                </span>
                <h4 className="text-xs font-semibold text-neutral-200 group-hover:text-white truncate mt-0.5">
                  {app.name}
                </h4>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Quick Summary Metrics */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <GlassCard variant="subtle" className="p-4">
          <div className="flex items-center gap-2 text-neutral-400 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-[11px] font-mono uppercase tracking-wider">
              Saved Favorites
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {favoriteSkillIds.length}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Bookmarked elements</p>
        </GlassCard>

        <GlassCard variant="subtle" className="p-4">
          <div className="flex items-center gap-2 text-neutral-400 mb-1">
            <Layers className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-[11px] font-mono uppercase tracking-wider">
              Active Sets
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {routines.length}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Ready for training</p>
        </GlassCard>

        <GlassCard variant="subtle" className="p-4">
          <div className="flex items-center gap-2 text-neutral-400 mb-1">
            <Compass className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-[11px] font-mono uppercase tracking-wider">
              FIG Events
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {ALL_APPARATUS.length}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Men & Women disciplines</p>
        </GlassCard>

        <GlassCard variant="subtle" className="p-4">
          <div className="flex items-center gap-2 text-neutral-400 mb-1">
            <Plus className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-[11px] font-mono uppercase tracking-wider">
              Max D-Score
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {Math.max(...routines.map((r) => r.summary.totalDScore), 0).toFixed(2)}
          </div>
          <p className="text-[11px] text-neutral-500 mt-1">Highest calculated</p>
        </GlassCard>
      </section>

      {/* Recently Viewed Skills */}
      {recentlyViewedSkills.length > 0 && (
        <section>
          <SectionHeader
            title="Recently Viewed Skills"
            subtitle="Quick reference"
            actionText="View Library"
            onAction={() => setActiveTab('skills')}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentlyViewedSkills.slice(0, 6).map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onSelect={(s) => setSelectedSkill(s)}
                isFavorite={favoriteSkillIds.includes(skill.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
