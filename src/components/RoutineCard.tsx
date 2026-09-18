import React from 'react';
import { ArrowUpRight, Layers, Trash2 } from 'lucide-react';
import { Routine } from '../types/gymnastics';
import { GlassCard } from './ui/GlassCard';
import { TagChip } from './ui/TagChip';
import { getApparatusCode } from './ui/ApparatusPill';

interface RoutineCardProps {
  routine: Routine;
  onOpen: (routine: Routine) => void;
  onDelete?: (id: string) => void;
  isActive?: boolean;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({
  routine,
  onOpen,
  onDelete,
  isActive = false,
}) => {
  const code = getApparatusCode(routine.apparatus);

  return (
    <GlassCard
      variant={isActive ? 'active' : 'interactive'}
      onClick={() => onOpen(routine)}
      className="p-4 sm:p-5 group transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <TagChip variant="accent" size="xs">
              {code} · {routine.apparatus}
            </TagChip>
            <span className="text-[11px] font-mono text-neutral-400">
              {routine.lastEdited}
            </span>
          </div>

          <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-white truncate font-display">
            {routine.name}
          </h3>

          {routine.notes && (
            <p className="text-xs text-neutral-400 truncate mt-1">
              {routine.notes}
            </p>
          )}

          {/* Quick Stats Grid */}
          <div className="mt-3.5 pt-3 border-t border-white/[0.06] flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-neutral-300">
              <Layers className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-mono font-medium">{routine.skills.length}</span>
              <span className="text-neutral-500">skills</span>
            </div>

            <div className="flex items-center gap-1.5 text-neutral-300">
              <span className="text-neutral-500">D-Score</span>
              <span className="font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded-full border border-white/10">
                {routine.summary.totalDScore.toFixed(2)}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-neutral-500 text-[11px]">
              <span>DV: {routine.summary.difficultyValue.toFixed(1)}</span>
              <span>·</span>
              <span>EG: {routine.summary.elementGroupValue.toFixed(1)}</span>
              <span>·</span>
              <span>CV: +{routine.summary.connectionBonus.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-neutral-300 group-hover:bg-white group-hover:text-black transition-all">
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>

          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete routine "${routine.name}"?`)) {
                  onDelete(routine.id);
                }
              }}
              className="p-1.5 rounded-full text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Delete routine"
              aria-label="Delete routine"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
