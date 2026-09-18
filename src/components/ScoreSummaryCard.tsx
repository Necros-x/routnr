import React from 'react';
import { GlassCard } from './ui/GlassCard';

interface ScoreSummaryCardProps {
  difficultyValue: number;
  elementGroupValue: number;
  connectionBonus: number;
  totalDScore: number;
  skillsCount: number;
  className?: string;
}

export const ScoreSummaryCard: React.FC<ScoreSummaryCardProps> = ({
  difficultyValue,
  elementGroupValue,
  connectionBonus,
  totalDScore,
  skillsCount,
  className = '',
}) => {
  return (
    <GlassCard variant="elevated" className={`p-4 ${className}`}>
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-mono">
            FIG D-Score Projection
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl font-bold font-display text-white tracking-tight">
              {totalDScore.toFixed(2)}
            </span>
            <span className="text-xs text-neutral-400 font-mono">Total Difficulty</span>
          </div>
        </div>

        <div className="text-right">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.08] border border-white/[0.12] text-xs font-mono text-neutral-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{skillsCount} Elements</span>
          </div>
        </div>
      </div>

      {/* Breakdown 3-column metrics pill row */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.08]">
        {/* Difficulty Value */}
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-2.5 text-center">
          <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
            DV Value
          </div>
          <div className="text-base font-bold font-mono text-white mt-0.5">
            {difficultyValue.toFixed(1)}
          </div>
          <div className="text-[10px] text-neutral-500">Top 8 items</div>
        </div>

        {/* Element Group Value */}
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-2.5 text-center">
          <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
            Element Grp
          </div>
          <div className="text-base font-bold font-mono text-white mt-0.5">
            {elementGroupValue.toFixed(1)}
          </div>
          <div className="text-[10px] text-neutral-500">Max 2.0 pts</div>
        </div>

        {/* Connection Value */}
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-2.5 text-center">
          <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
            Connection
          </div>
          <div className="text-base font-bold font-mono text-white mt-0.5">
            +{connectionBonus.toFixed(1)}
          </div>
          <div className="text-[10px] text-neutral-500">Bonus pts</div>
        </div>
      </div>
    </GlassCard>
  );
};
