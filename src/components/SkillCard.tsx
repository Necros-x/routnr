import React from 'react';
import { Bookmark, Plus, Check } from 'lucide-react';
import { GymnasticSkill } from '../types/gymnastics';
import { GlassCard } from './ui/GlassCard';
import { TagChip } from './ui/TagChip';
import { getApparatusCode } from './ui/ApparatusPill';
import { resolveSkillType, resolveBodyPart } from '../data/mockSkills';

interface SkillCardProps {
  skill: GymnasticSkill;
  onSelect: (skill: GymnasticSkill) => void;
  onToggleFavorite?: (skillId: string) => void;
  isFavorite?: boolean;
  onAddToRoutine?: (skill: GymnasticSkill) => void;
  isInRoutine?: boolean;
}

export const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  onSelect,
  onToggleFavorite,
  isFavorite = false,
  onAddToRoutine,
  isInRoutine = false,
}) => {
  const apparatusCode = getApparatusCode(skill.apparatus);
  const skillType = resolveSkillType(skill);
  const bodyPart = resolveBodyPart(skill);

  return (
    <GlassCard
      variant="interactive"
      onClick={() => onSelect(skill)}
      className="p-4 group border-white/[0.08] hover:border-white/20 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
            {/* Difficulty Badge */}
            <TagChip variant="difficulty" size="xs">
              Val {skill.difficulty} (+{skill.difficultyValue.toFixed(1)})
            </TagChip>

            {/* Apparatus Badge */}
            <span className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.06]">
              {apparatusCode}
            </span>

            {/* Type Badge */}
            <span className="text-[10px] font-medium text-neutral-300 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
              {skillType}
            </span>

            {/* Body Part Badge */}
            <span className="text-[10px] font-mono text-neutral-400 px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.06] hidden sm:inline-block">
              {bodyPart}
            </span>

            {/* FIG Code Badge */}
            <span className="text-[10px] font-mono text-neutral-500 hidden md:inline">
              FIG {skill.figCode}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-white tracking-tight group-hover:text-white transition-colors truncate">
            {skill.name}
          </h3>

          <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
            {skill.description}
          </p>

          <div className="mt-2.5 flex items-center gap-2 flex-wrap text-[10px] font-mono text-neutral-400">
            <span className="uppercase tracking-wider truncate max-w-[200px]">
              {skill.elementGroup}
            </span>
            <span className="text-neutral-600">·</span>
            <span className="text-neutral-400 sm:hidden">
              {bodyPart}
            </span>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {onToggleFavorite && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(skill.id);
              }}
              className={`p-1.5 rounded-full transition-colors ${
                isFavorite
                  ? 'text-white bg-white/20'
                  : 'text-neutral-500 hover:text-neutral-200 hover:bg-white/[0.08]'
              }`}
              aria-label="Save skill to favorites"
            >
              <Bookmark className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          )}

          {onAddToRoutine && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToRoutine(skill);
              }}
              className={`inline-flex items-center justify-center h-7 px-2.5 rounded-full text-xs font-medium transition-all ${
                isInRoutine
                  ? 'bg-neutral-800 text-neutral-300 border border-white/10'
                  : 'bg-white/10 hover:bg-white text-neutral-200 hover:text-black border border-white/15'
              }`}
              title={isInRoutine ? 'Already added' : 'Add to routine'}
            >
              {isInRoutine ? (
                <>
                  <Check className="w-3 h-3 mr-1" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3 mr-1" />
                  <span>Add</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
