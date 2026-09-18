import React, { useState, useMemo, useRef } from 'react';
import {
  ChevronLeft,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  GripVertical,
  Edit2,
  Sparkles,
  Info,
  Check,
  Zap,
} from 'lucide-react';
import { useGymnasticsStore } from '../hooks/useGymnasticsStore';
import { RoutineScoreBreakdownCard } from '../components/RoutineScoreBreakdownCard';
import { GlassCard } from '../components/ui/GlassCard';
import { PillButton } from '../components/ui/PillButton';
import { TagChip } from '../components/ui/TagChip';
import { EmptyState } from '../components/ui/EmptyState';
import { SkillPickerModal } from './SkillPickerModal';
import { GymnasticSkill } from '../types/gymnastics';
import { getApparatusCode } from '../components/ui/ApparatusPill';
import { calculateDynamicDScore } from '../utils/scoreCalculator';

interface RoutineBuilderScreenProps {
  onBack: () => void;
}

export const RoutineBuilderScreen: React.FC<RoutineBuilderScreenProps> = ({ onBack }) => {
  const {
    getActiveRoutine,
    addSkillToRoutine,
    removeSkillFromRoutine,
    updateSkillConnectionBonus,
    moveSkillOrder,
    reorderSkills,
    updateRoutineTitle,
    updateRoutineNotes,
    setSelectedSkill,
  } = useGymnasticsStore();

  const routine = getActiveRoutine();
  const [isPickerOpen, setPickerOpen] = useState(false);
  const [pickerInitialGroup, setPickerInitialGroup] = useState<number | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(routine?.name || '');
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(routine?.notes || '');

  // Drag-and-drop reordering state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [dropPosition, setDropPosition] = useState<'above' | 'below' | null>(null);
  const touchStartY = useRef<number>(0);
  const touchStartIndex = useRef<number | null>(null);

  // Dynamic D-Score breakdown calculated directly from routine skills
  const dynamicScore = useMemo(() => {
    if (!routine) return null;
    return calculateDynamicDScore(routine.skills, routine.apparatus);
  }, [routine?.skills, routine?.apparatus]);

  const calculateDropDestination = (
    fromIndex: number,
    targetIndex: number,
    position: 'above' | 'below'
  ): number => {
    if (fromIndex === targetIndex) return fromIndex;
    if (position === 'above') {
      return fromIndex < targetIndex ? targetIndex - 1 : targetIndex;
    } else {
      return fromIndex < targetIndex ? targetIndex : targetIndex + 1;
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedIndex === null) return;

    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const offset = e.clientY - rect.top;
    setDropPosition(offset < rect.height / 2 ? 'above' : 'below');
  };

  const handleDragLeave = (e: React.DragEvent, index: number) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    if (dragOverIndex === index) {
      setDragOverIndex(null);
      setDropPosition(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || !routine) return;

    const pos = dropPosition || 'below';
    let dest = calculateDropDestination(draggedIndex, targetIndex, pos);
    dest = Math.max(0, Math.min(dest, routine.skills.length - 1));

    if (draggedIndex !== dest) {
      reorderSkills(routine.id, draggedIndex, dest);
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
    setDropPosition(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDropPosition(null);
  };

  // Touch handlers for mobile/tablet drag-and-drop
  const handleTouchStart = (index: number, e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartIndex.current = index;
    setDraggedIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartIndex.current === null) return;
    const currentY = e.touches[0].clientY;
    const element = document.elementFromPoint(e.touches[0].clientX, currentY);
    const card = element?.closest('[data-skill-index]');
    if (card) {
      const targetIndex = Number(card.getAttribute('data-skill-index'));
      if (!isNaN(targetIndex)) {
        setDragOverIndex(targetIndex);
        const rect = card.getBoundingClientRect();
        setDropPosition(currentY - rect.top < rect.height / 2 ? 'above' : 'below');
      }
    }
  };

  const handleTouchEnd = () => {
    if (
      touchStartIndex.current !== null &&
      dragOverIndex !== null &&
      routine &&
      touchStartIndex.current !== dragOverIndex
    ) {
      const pos = dropPosition || 'below';
      let dest = calculateDropDestination(touchStartIndex.current, dragOverIndex, pos);
      dest = Math.max(0, Math.min(dest, routine.skills.length - 1));
      if (touchStartIndex.current !== dest) {
        reorderSkills(routine.id, touchStartIndex.current, dest);
      }
    }
    touchStartIndex.current = null;
    setDraggedIndex(null);
    setDragOverIndex(null);
    setDropPosition(null);
  };

  if (!routine) {
    return (
      <div className="p-4 text-center pb-24">
        <EmptyState
          icon={<Info className="w-6 h-6" />}
          title="No routine selected"
          description="Select an existing routine or create a new one to start building."
          actionText="Back to Routines"
          onAction={onBack}
        />
      </div>
    );
  }

  const handleSaveTitle = () => {
    if (editedTitle.trim()) {
      updateRoutineTitle(routine.id, editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleSaveNotes = () => {
    updateRoutineNotes(routine.id, editedNotes);
    setIsEditingNotes(false);
  };

  const handleSkillPicked = (skill: GymnasticSkill) => {
    addSkillToRoutine(routine.id, skill);
    setPickerOpen(false);
  };

  const handleOpenPickerForGroup = (groupNumber: 1 | 2 | 3 | 4) => {
    setPickerInitialGroup(groupNumber);
    setPickerOpen(true);
  };

  const handleOpenGeneralPicker = () => {
    setPickerInitialGroup(null);
    setPickerOpen(true);
  };

  const code = getApparatusCode(routine.apparatus);

  return (
    <div className="space-y-5 pb-32">
      {/* Top Bar with Back action & apparatus */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Routines</span>
        </button>

        <div className="flex items-center gap-2">
          <TagChip variant="accent" size="xs">
            {code} · {routine.apparatus}
          </TagChip>
          <span className="text-[11px] font-mono text-neutral-400">
            {routine.skills.length} skills
          </span>
        </div>
      </div>

      {/* Routine Title Header Area */}
      <div className="space-y-1">
        {isEditingTitle ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
              autoFocus
              className="flex-1 text-xl font-bold bg-white/10 text-white rounded-xl px-3 py-1.5 border border-white/30 focus:outline-none font-display"
            />
            <button
              type="button"
              onClick={handleSaveTitle}
              className="h-9 px-3 rounded-xl bg-white text-black text-xs font-semibold"
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between group">
            <h1
              onClick={() => {
                setEditedTitle(routine.name);
                setIsEditingTitle(true);
              }}
              className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display cursor-pointer hover:text-neutral-200 flex items-center gap-2"
              title="Click to rename"
            >
              <span>{routine.name}</span>
              <Edit2 className="w-3.5 h-3.5 text-neutral-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h1>
          </div>
        )}

        {/* Routine Coaching Notes */}
        {isEditingNotes ? (
          <div className="mt-2 flex items-center gap-2">
            <input
              type="text"
              value={editedNotes}
              onChange={(e) => setEditedNotes(e.target.value)}
              onBlur={handleSaveNotes}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveNotes()}
              placeholder="Add tactical or choreography notes..."
              autoFocus
              className="flex-1 text-xs bg-white/10 text-neutral-200 rounded-lg px-2.5 py-1 border border-white/20 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSaveNotes}
              className="text-xs px-2.5 py-1 bg-white/20 text-white rounded-lg"
            >
              Done
            </button>
          </div>
        ) : (
          <p
            onClick={() => {
              setEditedNotes(routine.notes || '');
              setIsEditingNotes(true);
            }}
            className="text-xs text-neutral-400 cursor-pointer hover:text-neutral-200 transition-colors pt-0.5"
            title="Click to edit notes"
          >
            {routine.notes || '+ Add routine execution notes...'}
          </p>
        )}
      </div>

      {/* Responsive Two-Column Layout: Visual Score Breakdown on left, Element Sequence on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: D-Score & Composition Requirements (sticky on desktop) */}
        <div className="lg:col-span-5 xl:col-span-5 lg:sticky lg:top-20 space-y-4">
          <RoutineScoreBreakdownCard
            routine={routine}
            onAddSkillForGroup={handleOpenPickerForGroup}
          />
        </div>

        {/* Right Column: Element Sequence & Management */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-4">
          {/* Element Sequence Section Header with Add Skill Action */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-white tracking-tight font-display">
              Element Sequence
            </h2>
            {routine.skills.length > 1 && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-neutral-400 bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.07]">
                <GripVertical className="w-3 h-3 text-neutral-400" />
                <span>Drag to reorder</span>
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Ordered sequence as performed in competition
          </p>
        </div>

        <PillButton
          variant="primary"
          size="sm"
          onClick={handleOpenGeneralPicker}
          icon={<Plus className="w-3.5 h-3.5 text-black" />}
        >
          Add Element
        </PillButton>
      </div>

      {/* Skill sequence items */}
      {routine.skills.length === 0 ? (
        <EmptyState
          icon={<Plus className="w-6 h-6" />}
          title="No elements in this routine"
          description="Add elements from the gymnastics library to calculate D-score and verify element group requirements."
          actionText="Add First Skill"
          onAction={handleOpenGeneralPicker}
        />
      ) : (
        <div className="space-y-2.5">
          {routine.skills.map((item, index) => {
            const isFirst = index === 0;
            const isLast = index === routine.skills.length - 1;
            const isBeingDragged = draggedIndex === index;
            const isDragTarget =
              dragOverIndex === index && draggedIndex !== null && draggedIndex !== index;

            return (
              <div
                key={item.instanceId}
                data-skill-index={index}
                className="relative"
              >
                {/* Luminous Drop Indicator Line: Above */}
                {isDragTarget && dropPosition === 'above' && (
                  <div className="absolute -top-1.5 inset-x-2 h-1 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.95)] z-30 pointer-events-none animate-pulse" />
                )}

                <GlassCard
                  variant="subtle"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={(e) => handleDragLeave(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`p-3 sm:p-4 transition-all duration-150 select-none ${
                    isBeingDragged
                      ? 'opacity-25 scale-[0.98] border-dashed border-white/50 bg-white/[0.02] shadow-none ring-1 ring-white/20'
                      : isDragTarget
                      ? 'border-white/50 bg-white/[0.07] ring-1 ring-white/30 scale-[1.01] shadow-lg shadow-black/40'
                      : 'border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Drag Grip Handle */}
                    <div
                      className="p-1 -ml-1 text-neutral-500 hover:text-white cursor-grab active:cursor-grabbing hover:bg-white/10 rounded-lg transition-colors shrink-0 touch-none"
                      title="Drag to rearrange element sequence"
                      aria-label="Drag handle"
                      onTouchStart={(e) => handleTouchStart(index, e)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>

                    {/* Order indicator */}
                    <div className="w-7 h-7 rounded-full bg-white/[0.08] border border-white/[0.12] flex items-center justify-center text-xs font-mono font-bold text-neutral-200 shrink-0">
                      {index + 1}
                    </div>

                    {/* Skill information */}
                    <div
                      onClick={() => setSelectedSkill(item.skill)}
                      className="flex-1 min-w-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <TagChip variant="difficulty" size="xs">
                          {item.skill.difficulty} (+{item.skill.difficultyValue.toFixed(1)})
                        </TagChip>

                        <span className="text-[10px] font-mono text-neutral-400">
                          FIG {item.skill.figCode}
                        </span>

                        {/* Dynamic FIG Counting Status */}
                        {(() => {
                          const countingRank = dynamicScore?.countingSkills.findIndex(
                            (cs) => cs.instanceId === item.instanceId
                          );
                          const isRepeated = dynamicScore?.repeatedSkills.some(
                            (rs) => rs.instanceId === item.instanceId
                          );

                          if (isRepeated) {
                            return (
                              <span className="text-[10px] font-mono text-red-300 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                                Duplicate (0.0 DV)
                              </span>
                            );
                          }
                          if (countingRank !== undefined && countingRank >= 0) {
                            return (
                              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                Top 8 (#{countingRank + 1})
                              </span>
                            );
                          }
                          return (
                            <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                              Reserve
                            </span>
                          );
                        })()}

                        {/* Interactive Connection Value (CV) Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const nextBonus =
                              item.connectionBonus === 0
                                ? 0.1
                                : item.connectionBonus === 0.1
                                ? 0.2
                                : 0;
                            updateSkillConnectionBonus(routine.id, item.instanceId, nextBonus);
                          }}
                          title="Click to toggle Connection Value bonus (0.0 -> +0.1 -> +0.2 -> 0.0)"
                          className={`inline-flex items-center gap-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded border transition-all cursor-pointer ${
                            item.connectionBonus > 0
                              ? 'text-amber-300 bg-amber-400/10 border-amber-400/30 hover:bg-amber-400/20'
                              : 'text-neutral-500 hover:text-amber-400 bg-white/[0.02] border-white/5 hover:border-amber-400/20'
                          }`}
                        >
                          <Zap className="w-2.5 h-2.5" />
                          <span>
                            {item.connectionBonus > 0
                              ? `+${item.connectionBonus.toFixed(1)} CV`
                              : '+CV'}
                          </span>
                        </button>
                      </div>

                      <h3 className="text-sm font-semibold text-white truncate">
                        {item.skill.name}
                      </h3>

                      <p className="text-[11px] text-neutral-400 font-mono truncate mt-0.5">
                        {item.skill.elementGroup}
                      </p>
                    </div>

                    {/* Controls: Reorder Up/Down & Delete */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={isFirst}
                        onClick={() => moveSkillOrder(routine.id, index, 'up')}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                        title="Move element up"
                        aria-label="Move up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        disabled={isLast}
                        onClick={() => moveSkillOrder(routine.id, index, 'down')}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                        title="Move element down"
                        aria-label="Move down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => removeSkillFromRoutine(routine.id, item.instanceId)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Remove element"
                        aria-label="Remove skill"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </GlassCard>

                {/* Luminous Drop Indicator Line: Below */}
                {isDragTarget && dropPosition === 'below' && (
                  <div className="absolute -bottom-1.5 inset-x-2 h-1 bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.95)] z-30 pointer-events-none animate-pulse" />
                )}
              </div>
            );
          })}

          {/* Quick Floating Add Element trigger */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={handleOpenGeneralPicker}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-white/[0.05] border border-dashed border-white/20 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/10 hover:border-white/40 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Insert Next Element</span>
            </button>
          </div>
        </div>
      )}
        </div>
      </div>

      {/* Skill Picker Modal */}
      <SkillPickerModal
        isOpen={isPickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelectSkill={handleSkillPicked}
        routineApparatus={routine.apparatus}
        initialElementGroup={pickerInitialGroup}
        alreadyAddedSkillIds={routine.skills.map((s) => s.skillId)}
      />
    </div>
  );
};
