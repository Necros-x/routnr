import React, { useState } from 'react';
import { Bookmark, Plus, Check, Share2, Layers } from 'lucide-react';
import { useGymnasticsStore } from '../hooks/useGymnasticsStore';
import { ModalSheet } from '../components/ui/ModalSheet';
import { TagChip } from '../components/ui/TagChip';
import { PillButton } from '../components/ui/PillButton';
import { GlassCard } from '../components/ui/GlassCard';
import { getApparatusCode } from '../components/ui/ApparatusPill';
import { resolveSkillType, resolveBodyPart } from '../data/mockSkills';

export const SkillDetailModal: React.FC = () => {
  const {
    selectedSkill,
    setSelectedSkill,
    favoriteSkillIds,
    toggleFavorite,
    routines,
    activeRoutineId,
    addSkillToRoutine,
    skills,
    openRoutineInBuilder,
  } = useGymnasticsStore();

  const [selectedRoutineId, setSelectedRoutineId] = useState<string>(
    activeRoutineId || routines[0]?.id || ''
  );
  const [justAdded, setJustAdded] = useState(false);

  if (!selectedSkill) return null;

  const isFavorite = favoriteSkillIds.includes(selectedSkill.id);
  const code = getApparatusCode(selectedSkill.apparatus);

  // Find matching apparatus routines or related skills
  const matchingRoutines = routines.filter(
    (r) => r.apparatus === selectedSkill.apparatus
  );
  const targetRoutine =
    routines.find((r) => r.id === selectedRoutineId) || matchingRoutines[0] || routines[0];

  const relatedSkills = skills
    .filter(
      (s) =>
        s.id !== selectedSkill.id &&
        (s.apparatus === selectedSkill.apparatus ||
          s.elementGroupNumber === selectedSkill.elementGroupNumber)
    )
    .slice(0, 3);

  const handleAdd = () => {
    if (targetRoutine) {
      addSkillToRoutine(targetRoutine.id, selectedSkill);
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  return (
    <ModalSheet
      isOpen={!!selectedSkill}
      onClose={() => setSelectedSkill(null)}
      title="Skill Specification"
      subtitle={`FIG Code ${selectedSkill.figCode}`}
    >
      <div className="space-y-5 pb-6">
        {/* Header Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <TagChip variant="difficulty" size="sm">
            Difficulty {selectedSkill.difficulty} (+{selectedSkill.difficultyValue.toFixed(1)})
          </TagChip>
          <TagChip variant="accent" size="sm">
            {code} · {selectedSkill.apparatus}
          </TagChip>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-white border border-white/15">
            {resolveSkillType(selectedSkill)}
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-white/[0.05] text-neutral-300 border border-white/10">
            Target: {resolveBodyPart(selectedSkill)}
          </span>
          <TagChip variant="subtle" size="sm">
            FIG {selectedSkill.figCode}
          </TagChip>
        </div>

        {/* Skill Title */}
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight font-display">
            {selectedSkill.name}
          </h2>
          <p className="text-xs font-mono text-neutral-400 mt-1 uppercase tracking-wider">
            {selectedSkill.elementGroup}
          </p>
        </div>

        {/* Description & Technical Breakdown */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
          <h4 className="text-xs font-semibold text-neutral-300 uppercase font-mono tracking-wider">
            Technical Definition
          </h4>
          <p className="text-sm text-neutral-200 leading-relaxed">
            {selectedSkill.description}
          </p>
        </div>

        {/* Aliases & Alternative Names */}
        {selectedSkill.aliases.length > 0 && (
          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
              Alternative Names & Aliases
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedSkill.aliases.map((alias) => (
                <span
                  key={alias}
                  className="px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-xs text-neutral-300"
                >
                  {alias}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags / Keywords */}
        {selectedSkill.tags.length > 0 && (
          <div>
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
              Classification Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedSkill.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-neutral-800 text-[11px] font-mono text-neutral-400 border border-white/[0.06]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Add to Routine Section */}
        <div className="pt-2 border-t border-white/[0.08] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-neutral-400">
              Target Routine
            </span>
            {targetRoutine && (
              <button
                type="button"
                onClick={() => {
                  setSelectedSkill(null);
                  openRoutineInBuilder(targetRoutine.id);
                }}
                className="text-xs text-neutral-400 hover:text-white transition-colors"
              >
                Go to Builder →
              </button>
            )}
          </div>

          {/* Routine selector dropdown if multiple */}
          {routines.length > 0 ? (
            <div className="space-y-2">
              <select
                value={selectedRoutineId}
                onChange={(e) => setSelectedRoutineId(e.target.value)}
                className="w-full h-11 px-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-sm text-white focus:outline-none focus:border-white/40 appearance-none"
              >
                {routines.map((r) => (
                  <option key={r.id} value={r.id} className="bg-neutral-900 text-white">
                    {r.name} ({r.apparatus}) · D: {r.summary.totalDScore.toFixed(2)}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <PillButton
                  variant="primary"
                  fullWidth
                  onClick={handleAdd}
                  icon={
                    justAdded ? (
                      <Check className="w-4 h-4 text-emerald-950" />
                    ) : (
                      <Plus className="w-4 h-4 text-black" />
                    )
                  }
                >
                  {justAdded ? 'Added to Routine' : 'Add to Routine'}
                </PillButton>

                <button
                  type="button"
                  onClick={() => toggleFavorite(selectedSkill.id)}
                  className={`h-11 px-4 rounded-full border flex items-center justify-center transition-all ${
                    isFavorite
                      ? 'bg-white text-black border-white'
                      : 'bg-white/[0.06] text-neutral-300 border-white/[0.1] hover:bg-white/10'
                  }`}
                  aria-label="Toggle favorite"
                >
                  <Bookmark className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-neutral-500">
              No routines created yet. Create a routine in the Routines tab to start adding skills.
            </p>
          )}
        </div>

        {/* Related Skills */}
        {relatedSkills.length > 0 && (
          <div className="pt-3 border-t border-white/[0.08]">
            <span className="text-xs font-mono uppercase text-neutral-400 block mb-2.5">
              Related FIG Elements
            </span>
            <div className="space-y-2">
              {relatedSkills.map((rel) => (
                <GlassCard
                  key={rel.id}
                  variant="interactive"
                  onClick={() => setSelectedSkill(rel)}
                  className="p-3 flex items-center justify-between"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <TagChip variant="difficulty" size="xs">
                        {rel.difficulty}
                      </TagChip>
                      <span className="text-[11px] font-mono text-neutral-500">
                        {rel.figCode}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-white truncate">{rel.name}</p>
                  </div>
                  <span className="text-xs text-neutral-400">Inspect →</span>
                </GlassCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </ModalSheet>
  );
};
