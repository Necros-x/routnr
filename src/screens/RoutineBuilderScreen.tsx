import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, Reorder, useDragControls } from 'motion/react';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Link2,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { AppToast } from '../components/AppToast';
import { ConnectionValueSheet } from '../components/ConnectionValueSheet';
import { useGymnasticsStore } from '../hooks/useGymnasticsStore';
import { DIFFICULTY_LEVELS } from '../data/mockSkills';
import type { RoutineSkill } from '../types/gymnastics';

interface RoutineBuilderScreenProps {
  onBack: () => void;
}

type RoutineDragControls = ReturnType<typeof useDragControls>;

function DraggableRoutineItem({
  value,
  children,
}: {
  value: string;
  children: (controls: RoutineDragControls) => React.ReactNode;
}) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={value}
      dragListener={false}
      dragControls={controls}
      className="list-none"
      whileDrag={{
        scale: 1.015,
        zIndex: 40,
        boxShadow: '0 18px 40px rgba(28, 28, 25, 0.12)',
      }}
      transition={{
        type: 'spring',
        stiffness: 420,
        damping: 34,
      }}
    >
      {children(controls)}
    </Reorder.Item>
  );
}

export const RoutineBuilderScreen: React.FC<RoutineBuilderScreenProps> = ({
  onBack,
}) => {
  const {
    getActiveRoutine,
    calculateActiveRoutineDScore,
    skills,
    addSkillToRoutine,
    removeSkillFromRoutine,
    updateSkillConnectionBonus,
    moveSkillOrder,
    reorderRoutineSkills,
    restoreRoutineSkill,
    updateRoutineTitle,
    updateRoutineNotes,
    setSelectedSkill,
    markSkillViewed,
  } = useGymnasticsStore();

  const routine = getActiveRoutine();

  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [title, setTitle] = useState(routine?.name ?? '');
  const [notes, setNotes] = useState(routine?.notes ?? '');
  const [toast, setToast] = useState<{
    id: number;
    message: string;
    undo?: {
      routineId: string;
      item: RoutineSkill;
      index: number;
    };
  } | null>(null);
  const [connectionTargetId, setConnectionTargetId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setTitle(routine?.name ?? '');
    setNotes(routine?.notes ?? '');
  }, [routine?.id, routine?.name, routine?.notes]);

  const matchingSkills = useMemo(() => {
    if (!routine) return [];

    const normalized = query.trim().toLowerCase();

    return skills.filter((skill) => {
      const matchesApparatus = skill.apparatus === routine.apparatus;
      const matchesDifficulty =
        difficulty === 'All' || skill.difficulty === difficulty;
      const matchesQuery =
        !normalized ||
        skill.name.toLowerCase().includes(normalized) ||
        skill.figCode.toLowerCase().includes(normalized) ||
        skill.aliases.some((alias) =>
          alias.toLowerCase().includes(normalized),
        );

      return matchesApparatus && matchesDifficulty && matchesQuery;
    });
  }, [difficulty, query, routine, skills]);

  if (!routine) {
    return (
      <div className="rounded-[24px] border border-[var(--border-medium)] bg-white p-8 text-center">
        <p className="text-sm font-semibold">Routine not found</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 rounded-full bg-[var(--accent)] px-5 py-2.5 text-xs font-semibold text-white"
        >
          Back to routines
        </button>
      </div>
    );
  }

  const score = calculateActiveRoutineDScore();
  const countingIds = new Set(
    score.countingSkills.map((item) => item.instanceId),
  );
  const repeatedIds = new Set(
    score.repeatedSkills.map((item) => item.instanceId),
  );
  const reserveIds = new Set(
    score.nonCountingSkills
      .filter((item) => !repeatedIds.has(item.instanceId))
      .map((item) => item.instanceId),
  );

  const fulfilledGroups = score.groupFulfillment.filter(
    (group) => group.isFulfilled,
  ).length;

  const missingGroupLabels = score.missingGroups.map(
    (group) => ['I', 'II', 'III', 'IV'][group.groupNumber - 1],
  );

  const routineCheckIssueCount =
    (score.countingSlotsRemaining > 0 ? 1 : 0) +
    (score.missingGroups.length > 0 ? 1 : 0) +
    (score.repeatedSkills.length > 0 ? 1 : 0);

  const routineChecksClear = routineCheckIssueCount === 0;

  const connectionTarget =
    routine.skills.find((item) => item.instanceId === connectionTargetId) ??
    null;

  const showToast = (message: string) => {
    setToast({ id: Date.now(), message });
  };

  const saveTitle = () => {
    const next = title.trim() || routine.name;
    setTitle(next);
    if (next !== routine.name) updateRoutineTitle(routine.id, next);
  };

  const saveNotes = () => {
    if (notes !== (routine.notes ?? '')) updateRoutineNotes(routine.id, notes);
  };

  const openSkill = (skill: (typeof skills)[number]) => {
    markSkillViewed(skill);
    setSelectedSkill(skill);
  };

  return (
    <div className="space-y-6">
      <section>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Routines
        </button>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full border border-[var(--border-medium)] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
            {routine.apparatus}
          </span>
          <span className="text-[10px] font-medium text-[var(--text-tertiary)]">
            {routine.skills.length} elements
          </span>
        </div>

        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onBlur={saveTitle}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur();
          }}
          className="font-display mt-3 w-full bg-transparent text-2xl font-semibold tracking-[-0.05em] outline-none sm:text-3xl"
          aria-label="Routine title"
        />
      </section>

      <section className="glass-float backdrop-blur-[2px] sticky top-2 z-30 rounded-[24px] p-3">
        <div className="grid grid-cols-4 gap-2">
          <div className="rounded-[12px] bg-white/50 p-3">
            <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
              DV
            </p>
            <p className="mt-1 text-base font-semibold">
              {score.difficultyValue.toFixed(1)}
            </p>
          </div>

          <div className="rounded-[12px] bg-white/50 p-3">
            <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
              EG
            </p>
            <p className="mt-1 text-base font-semibold">
              {score.elementGroupValue.toFixed(1)}
            </p>
          </div>

          <div className="rounded-[12px] bg-white/50 p-3">
            <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-[var(--text-tertiary)]">
              CV
            </p>
            <p className="mt-1 text-base font-semibold">
              {score.connectionBonus.toFixed(1)}
            </p>
          </div>

          <div className="rounded-[12px] bg-[var(--accent)] p-3 text-white">
            <p className="text-[8px] font-semibold uppercase tracking-[0.1em] text-white/60">
              D
            </p>
            <p className="mt-1 text-base font-semibold">
              {score.totalDScore.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 px-1">
          <p className="text-[9px] font-medium text-[var(--text-tertiary)]">
            {score.countingSkills.length}/8 counting · {fulfilledGroups}/4 groups
          </p>
          {(score.repeatedSkills.length > 0 || reserveIds.size > 0) && (
            <p className="inline-flex items-center gap-1 text-[9px] font-medium text-[var(--text-tertiary)]">
              <AlertTriangle className="h-3 w-3" />
              {score.repeatedSkills.length > 0
                ? `${score.repeatedSkills.length} repeated`
                : `${reserveIds.size} reserve`}
            </p>
          )}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.03em]">
              Element groups
            </h2>
            <p className="mt-0.5 text-[10px] text-[var(--text-tertiary)]">
              Current ROUTNR calculation
            </p>
          </div>

          <span className="text-[10px] font-semibold text-[var(--text-tertiary)]">
            {fulfilledGroups}/4 complete
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-[24px] border border-[var(--border-medium)] bg-white p-3 sm:grid-cols-4">
          {score.groupFulfillment.map((group) => (
            <div
              key={group.groupNumber}
              className={`rounded-[12px] p-3 ${
                group.isFulfilled
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-[var(--surface-soft)] text-[var(--text-secondary)]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p
                  className={`text-[9px] font-bold uppercase tracking-[0.1em] ${
                    group.isFulfilled
                      ? 'text-white/65'
                      : 'text-[var(--text-tertiary)]'
                  }`}
                >
                  EG {['I', 'II', 'III', 'IV'][group.groupNumber - 1]}
                </p>
                {group.isFulfilled && <Check className="h-3.5 w-3.5" />}
              </div>
              <p className="mt-2 line-clamp-2 text-[10px] font-semibold leading-4">
                {group.name}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-[-0.03em]">
              Routine check
            </h2>
            <p className="mt-0.5 text-[10px] text-[var(--text-tertiary)]">
              Provisional builder checks
            </p>
          </div>

          <span
            className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${
              routineChecksClear
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--accent-soft)] text-[var(--text-secondary)]'
            }`}
          >
            {routineChecksClear
              ? 'Clear'
              : `${routineCheckIssueCount} to review`}
          </span>
        </div>

        <div className="rounded-[24px] border border-[var(--border-medium)] bg-white p-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 rounded-[12px] bg-[var(--surface-soft)] p-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[16px] ${
                    score.countingSlotsRemaining === 0
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-white text-[var(--text-secondary)]'
                  }`}
                >
                  {score.countingSlotsRemaining === 0 ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold">Counting elements</p>
                  <p className="mt-0.5 text-[9px] text-[var(--text-tertiary)]">
                    {score.countingSkills.length}/8 currently counting
                  </p>
                </div>
              </div>

              <span className="shrink-0 text-[10px] font-semibold text-[var(--text-secondary)]">
                {score.countingSlotsRemaining === 0
                  ? 'Complete'
                  : `${score.countingSlotsRemaining} open`}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-[12px] bg-[var(--surface-soft)] p-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[16px] ${
                    score.missingGroups.length === 0
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-white text-[var(--text-secondary)]'
                  }`}
                >
                  {score.missingGroups.length === 0 ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold">Element groups</p>
                  <p className="mt-0.5 text-[9px] text-[var(--text-tertiary)]">
                    {score.missingGroups.length === 0
                      ? 'All current groups represented'
                      : `Missing EG ${missingGroupLabels.join(', ')}`}
                  </p>
                </div>
              </div>

              <span className="shrink-0 text-[10px] font-semibold text-[var(--text-secondary)]">
                {fulfilledGroups}/4
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-[12px] bg-[var(--surface-soft)] p-3">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[16px] ${
                    score.repeatedSkills.length === 0
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[#fff1f1] text-[var(--danger)]'
                  }`}
                >
                  {score.repeatedSkills.length === 0 ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold">Repeated elements</p>
                  <p className="mt-0.5 text-[9px] text-[var(--text-tertiary)]">
                    {score.repeatedSkills.length === 0
                      ? 'No duplicate FIG elements detected'
                      : `${score.repeatedSkills.length} repeated element${score.repeatedSkills.length === 1 ? '' : 's'}`}
                  </p>
                </div>
              </div>

              <span className="shrink-0 text-[10px] font-semibold text-[var(--text-secondary)]">
                {score.repeatedSkills.length === 0
                  ? 'Clear'
                  : score.repeatedSkills.length}
              </span>
            </div>

            {reserveIds.size > 0 && (
              <div className="flex items-center justify-between gap-3 rounded-[12px] bg-[var(--surface-soft)] p-3">
                <div>
                  <p className="text-xs font-semibold">Reserve elements</p>
                  <p className="mt-0.5 text-[9px] text-[var(--text-tertiary)]">
                    Extra recognized elements remain in the routine but are not
                    currently counted toward DV.
                  </p>
                </div>
                <span className="shrink-0 text-[10px] font-semibold text-[var(--text-secondary)]">
                  {reserveIds.size}
                </span>
              </div>
            )}
          </div>

          <p className="mt-3 px-1 text-[9px] leading-4 text-[var(--text-tertiary)]">
            These checks use ROUTNR’s current provisional model. Final
            apparatus-specific FIG validation will replace them in the verified
            scoring phase.
          </p>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-[-0.03em]">Routine</h2>
          <span className="text-[10px] font-medium text-[var(--text-tertiary)]">
            Tap skill for details
          </span>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-[var(--border-medium)] bg-white">
          {routine.skills.length === 0 ? (
            <div className="flex min-h-[190px] flex-col items-center justify-center px-6 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent)] text-white">
                <Plus className="h-4 w-4" />
              </span>
              <p className="mt-4 text-sm font-semibold">Add your first skill</p>
              <p className="mt-1 text-xs text-[var(--text-tertiary)]">
                Search this apparatus below and add an element.
              </p>
            </div>
          ) : (
            <Reorder.Group
              axis="y"
              values={routine.skills.map((item) => item.instanceId)}
              onReorder={(orderedIds) =>
                reorderRoutineSkills(routine.id, orderedIds)
              }
              className="m-0 list-none p-0"
            >
              {routine.skills.map((item, index) => {
              const connectionBonus = item.connectionBonus || 0;
              const isRepeated = repeatedIds.has(item.instanceId);
              const isReserve = reserveIds.has(item.instanceId);
              const isCounting = countingIds.has(item.instanceId);

              const statusLabel = isRepeated
                ? 'Repeated'
                : isReserve
                  ? 'Reserve'
                  : isCounting
                    ? 'Counting'
                    : 'Added';

              return (
                <DraggableRoutineItem
                  key={item.instanceId}
                  value={item.instanceId}
                >
                  {(dragControls) => (
                    <div
                      className={`bg-white p-3.5 sm:p-4 ${
                        index > 0
                          ? 'border-t border-[var(--border-subtle)]'
                          : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <button
                          type="button"
                          onPointerDown={(event) => dragControls.start(event)}
                          className="flex h-9 w-7 shrink-0 touch-none items-center justify-center rounded-[12px] text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]"
                          aria-label={`Drag to reorder ${item.skill.name}`}
                        >
                          <GripVertical className="h-4 w-4" />
                        </button>

                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[var(--surface-soft)] text-[10px] font-bold text-[var(--text-tertiary)]">
                          {index + 1}
                        </span>

                    <button
                      type="button"
                      onClick={() => openSkill(item.skill)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                          {item.skill.name}
                        </span>
                        <span className="shrink-0 rounded-full bg-[var(--accent-soft)] px-2 py-0.5 text-[9px] font-bold">
                          {item.skill.difficulty}
                        </span>
                      </div>

                      <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] ${
                            isRepeated
                              ? 'bg-[#fff1f1] text-[var(--danger)]'
                              : isCounting
                                ? 'bg-[var(--accent)] text-white'
                                : 'bg-[var(--surface-hover)] text-[var(--text-secondary)]'
                          }`}
                        >
                          {statusLabel}
                        </span>
                        <span className="text-[9px] text-[var(--text-tertiary)]">
                          FIG {item.skill.figCode} · Group{' '}
                          {item.skill.elementGroupNumber}
                        </span>
                      </div>
                    </button>
                  </div>

                      <div className="mt-3 flex items-center justify-between gap-2 pl-[4.75rem]">
                    <button
                      type="button"
                      onClick={() => setConnectionTargetId(item.instanceId)}
                      className={`inline-flex h-8 items-center gap-1.5 rounded-[16px] px-3 text-[9px] font-semibold ${
                        connectionBonus > 0
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-[var(--surface-soft)] text-[var(--text-secondary)]'
                      }`}
                      aria-label={`Edit connection value for ${item.skill.name}`}
                    >
                      <Link2 className="h-3.5 w-3.5" />
                      {connectionBonus > 0
                        ? `CV +${connectionBonus.toFixed(1)}`
                        : 'Set CV'}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() =>
                          moveSkillOrder(routine.id, index, 'up')
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-[16px] text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)] disabled:opacity-20"
                        aria-label={`Move ${item.skill.name} up`}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        disabled={index === routine.skills.length - 1}
                        onClick={() =>
                          moveSkillOrder(routine.id, index, 'down')
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-[16px] text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)] disabled:opacity-20"
                        aria-label={`Move ${item.skill.name} down`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          removeSkillFromRoutine(
                            routine.id,
                            item.instanceId,
                          );
                          setToast({
                            id: Date.now(),
                            message: 'Skill removed',
                            undo: {
                              routineId: routine.id,
                              item,
                              index,
                            },
                          });
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-[16px] text-[var(--text-tertiary)] hover:bg-[#fff1f1] hover:text-[var(--danger)]"
                        aria-label={`Remove ${item.skill.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                      </div>
                    </div>
                  )}
                </DraggableRoutineItem>
              );
            })}
            </Reorder.Group>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold tracking-[-0.03em]">
          Add skills
        </h2>

        <div className="rounded-[24px] border border-[var(--border-medium)] bg-white p-3">
          <div className="flex h-12 items-center gap-3 rounded-[12px] bg-[var(--surface-soft)] px-4">
            <Search className="h-4 w-4 text-[var(--text-tertiary)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${routine.apparatus}`}
              className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--text-tertiary)]"
            />
          </div>

          <div className="mt-2 flex gap-1 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setDifficulty('All')}
              className={`h-8 shrink-0 rounded-full px-3 text-[10px] font-bold ${
                difficulty === 'All'
                  ? 'bg-[var(--accent)] text-white'
                  : 'text-[var(--text-tertiary)]'
              }`}
            >
              All
            </button>

            {DIFFICULTY_LEVELS.map((level) => (
              <button
                key={level.letter}
                type="button"
                onClick={() => setDifficulty(level.letter)}
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  difficulty === level.letter
                    ? 'bg-[var(--accent)] text-white'
                    : 'text-[var(--text-tertiary)] hover:bg-[var(--surface-soft)]'
                }`}
              >
                {level.letter}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-[24px] border border-[var(--border-medium)] bg-white">
          {matchingSkills.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Search className="mx-auto h-5 w-5 text-[var(--text-tertiary)]" />
              <p className="mt-3 text-sm font-semibold">No matching skills</p>
            </div>
          ) : (
            matchingSkills.map((skill, index) => {
              const alreadyAdded = routine.skills.some(
                (item) => item.skill.figCode === skill.figCode,
              );

              return (
                <div
                  key={skill.id}
                  className={`flex items-center gap-3 p-3.5 sm:p-4 ${
                    index > 0
                      ? 'border-t border-[var(--border-subtle)]'
                      : ''
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => openSkill(skill)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[var(--accent-soft)] text-xs font-bold">
                      {skill.difficulty}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="block min-w-0 flex-1 truncate text-sm font-semibold">
                          {skill.name}
                        </span>
                        {alreadyAdded && (
                          <span className="shrink-0 rounded-full bg-[var(--surface-hover)] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                            In routine
                          </span>
                        )}
                      </span>

                      <span className="mt-1 block truncate text-[10px] text-[var(--text-tertiary)]">
                        FIG {skill.figCode} · Group {skill.elementGroupNumber}
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      addSkillToRoutine(routine.id, skill);
                      showToast(
                        alreadyAdded ? 'Repeated skill added' : 'Skill added',
                      );
                    }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[18px] bg-[var(--accent)] text-white"
                    aria-label={`Add ${skill.name}`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      <section>
        <label className="text-sm font-semibold">Notes</label>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          onBlur={saveNotes}
          rows={3}
          placeholder="Routine notes…"
          className="mt-3 w-full resize-none rounded-[22px] border border-[var(--border-medium)] bg-white p-4 text-sm leading-6 outline-none placeholder:text-[var(--text-tertiary)]"
        />
      </section>

      <ConnectionValueSheet
        item={connectionTarget}
        isOpen={Boolean(connectionTarget)}
        onClose={() => setConnectionTargetId(null)}
        onChange={(value) => {
          if (!connectionTarget) return;

          updateSkillConnectionBonus(
            routine.id,
            connectionTarget.instanceId,
            value,
          );

          showToast(
            value === 0
              ? 'Connection cleared'
              : `Connection set to +${value.toFixed(1)}`,
          );
        }}
      />

      <AnimatePresence>
        {toast && (
          <AppToast
            key={toast.id}
            message={toast.message}
            actionLabel={toast.undo ? 'Undo' : undefined}
            onAction={
              toast.undo
                ? () => {
                    restoreRoutineSkill(
                      toast.undo!.routineId,
                      toast.undo!.item,
                      toast.undo!.index,
                    );
                    setToast({
                      id: Date.now(),
                      message: 'Skill restored',
                    });
                  }
                : undefined
            }
            onDone={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
