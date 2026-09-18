import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  AlertTriangle,
  Zap,
  Plus,
  Info,
  ChevronDown,
  Layers,
  Award,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { Routine, DifficultyLetter } from '../types/gymnastics';
import { GlassCard } from './ui/GlassCard';
import { TagChip } from './ui/TagChip';
import { calculateDynamicDScore } from '../utils/scoreCalculator';

export interface MissingRequirementFlag {
  id: string;
  type: 'missing_group' | 'insufficient_skills' | 'duplicate_element' | 'dismount_warning';
  severity: 'high' | 'medium';
  title: string;
  description: string;
  scoreImpact: string;
  elementGroupNumber?: 1 | 2 | 3 | 4;
}

interface RoutineScoreBreakdownCardProps {
  routine: Routine;
  onAddSkillForGroup?: (groupNumber: 1 | 2 | 3 | 4) => void;
  className?: string;
}

type BreakdownTab = 'flags' | 'cr' | 'counting' | 'formula';

export const RoutineScoreBreakdownCard: React.FC<RoutineScoreBreakdownCardProps> = ({
  routine,
  onAddSkillForGroup,
  className = '',
}) => {
  // Dynamically calculate the official FIG D-Score and breakdown based on skills currently in routine
  const dynamicScore = useMemo(
    () => calculateDynamicDScore(routine.skills, routine.apparatus),
    [routine.skills, routine.apparatus]
  );

  const {
    difficultyValue,
    elementGroupValue,
    connectionBonus,
    totalDScore,
    countingSkills,
    nonCountingSkills,
    letterDistribution: difficultyDistribution,
    groupFulfillment,
  } = dynamicScore;

  const skillsCount = routine.skills.length;
  const fulfilledCount = groupFulfillment.filter((g) => g.isFulfilled).length;

  // Calculate missing requirement flags
  const missingFlags = useMemo(() => {
    const flags: MissingRequirementFlag[] = [];

    // 1. Check for missing FIG Element Groups
    groupFulfillment.forEach((group) => {
      if (!group.isFulfilled) {
        flags.push({
          id: `missing-group-${group.groupNumber}`,
          type: 'missing_group',
          severity: 'high',
          title: `Missing ${group.label}: ${group.name}`,
          description: `No skill from ${group.label} is currently included in this routine. FIG rules require at least one element from each group.`,
          scoreImpact: '-0.50 D-Score',
          elementGroupNumber: group.groupNumber,
        });
      }
    });

    // 2. Check for insufficient counting elements (FIG evaluates top 8 skills)
    if (skillsCount < 8) {
      const remainingSlots = 8 - skillsCount;
      flags.push({
        id: 'insufficient-skills-count',
        type: 'insufficient_skills',
        severity: remainingSlots >= 4 ? 'high' : 'medium',
        title: `Incomplete Routine (${skillsCount}/8 counting skills)`,
        description: `Routine only has ${skillsCount} element${skillsCount === 1 ? '' : 's'}. You can include up to 8 counting skills to maximize Difficulty Value.`,
        scoreImpact: `${remainingSlots} open counting slot${remainingSlots > 1 ? 's' : ''}`,
      });
    }

    // 3. Check for duplicated FIG codes (FIG allows an element only once for DV)
    const figCodeCounts = new Map<string, number>();
    routine.skills.forEach((s) => {
      const code = s.skill.figCode;
      figCodeCounts.set(code, (figCodeCounts.get(code) || 0) + 1);
    });

    figCodeCounts.forEach((count, code) => {
      if (count > 1) {
        const skill = routine.skills.find((s) => s.skill.figCode === code)?.skill;
        flags.push({
          id: `duplicate-fig-${code}`,
          type: 'duplicate_element',
          severity: 'high',
          title: `Repeated Element: FIG ${code}`,
          description: `"${skill?.name || code}" is performed ${count} times. Under FIG rules, an identical element can only be recognized once for Difficulty Value.`,
          scoreImpact: '0.0 DV for repeated skill',
        });
      }
    });

    return flags;
  }, [groupFulfillment, skillsCount, routine.skills]);

  // Default to 'flags' tab if there are missing requirements, otherwise 'cr'
  const [activeTab, setActiveTab] = useState<BreakdownTab>('flags');
  const [isExpanded, setIsExpanded] = useState(true);

  // Overall routine readiness score (out of 100%)
  const routineProgressPercent = Math.min(
    100,
    Math.round(((fulfilledCount / 4) * 50) + (Math.min(skillsCount, 8) / 8) * 50)
  );

  return (
    <GlassCard variant="elevated" className={`overflow-hidden ${className}`}>
      {/* Top Main Score & Progress Bar Section */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono">
                FIG D-Score & Composition Summary
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  missingFlags.length === 0 ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                }`}
              />
            </div>

            <div className="flex items-baseline gap-2.5 mt-0.5">
              <span className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                {totalDScore.toFixed(2)}
              </span>
              <span className="text-xs font-mono text-neutral-400">Total D-Score</span>

              {/* Status Badge */}
              <div
                className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono border ${
                  missingFlags.length === 0
                    ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-300'
                    : 'bg-amber-400/10 border-amber-400/30 text-amber-300'
                }`}
              >
                {missingFlags.length === 0 ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>All Requirements Met</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    <span>
                      {missingFlags.length} Missing Flag{missingFlags.length > 1 ? 's' : ''}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="text-right flex flex-col items-end">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-mono text-neutral-300 transition-colors cursor-pointer"
            >
              <span>{isExpanded ? 'Hide Details' : 'View Audit'}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>
            <span className="text-[10px] text-neutral-500 font-mono mt-1">
              FIG 2025–2028 Code
            </span>
          </div>
        </div>

        {/* 3 Metric Cards: Total Difficulty (DV), Composition Requirements (CR), Connection Bonus (CV) */}
        <div className="grid grid-cols-3 gap-2 my-3">
          {/* Total Difficulty Value */}
          <div
            onClick={() => {
              setActiveTab('counting');
              setIsExpanded(true);
            }}
            className="rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] p-2 sm:p-2.5 text-center cursor-pointer transition-colors"
          >
            <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
              Total Difficulty
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-white mt-0.5">
              {difficultyValue.toFixed(1)}
              <span className="text-xs text-neutral-500 font-normal"> DV</span>
            </div>
            <div className="text-[10px] text-neutral-400">
              {Math.min(skillsCount, 8)}/8 counted
            </div>
          </div>

          {/* Composition Requirements */}
          <div
            onClick={() => {
              setActiveTab('cr');
              setIsExpanded(true);
            }}
            className="rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] p-2 sm:p-2.5 text-center cursor-pointer transition-colors"
          >
            <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
              Composition
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-white mt-0.5">
              {elementGroupValue.toFixed(1)}
              <span className="text-xs text-neutral-500 font-normal"> / 2.0</span>
            </div>
            <div
              className={`text-[10px] font-medium ${
                fulfilledCount === 4 ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {fulfilledCount}/4 groups
            </div>
          </div>

          {/* Connection Bonus */}
          <div
            onClick={() => {
              setActiveTab('formula');
              setIsExpanded(true);
            }}
            className="rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] p-2 sm:p-2.5 text-center cursor-pointer transition-colors"
          >
            <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400">
              Connections
            </div>
            <div className="text-base sm:text-lg font-bold font-mono text-amber-300 mt-0.5">
              +{connectionBonus.toFixed(1)}
              <span className="text-xs text-neutral-500 font-normal"> CV</span>
            </div>
            <div className="text-[10px] text-neutral-400">Direct links</div>
          </div>
        </div>

        {/* Missing Requirements Flag Alert Banner */}
        {missingFlags.length > 0 ? (
          <div className="mt-3 p-3 rounded-xl bg-amber-400/[0.08] border border-amber-400/25 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-xs font-semibold text-amber-200">
                  {missingFlags.length} Missing Requirement Flag{missingFlags.length > 1 ? 's' : ''} Detected
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('flags');
                  setIsExpanded(true);
                }}
                className="text-[11px] font-mono text-amber-300 hover:text-amber-100 underline underline-offset-2 cursor-pointer"
              >
                View Flags
              </button>
            </div>

            {/* Quick action chips for missing element groups */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {missingFlags
                .filter((f) => f.elementGroupNumber !== undefined)
                .map((flag) => (
                  <button
                    key={flag.id}
                    type="button"
                    onClick={() => {
                      if (flag.elementGroupNumber && onAddSkillForGroup) {
                        onAddSkillForGroup(flag.elementGroupNumber);
                      }
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-[11px] font-medium text-amber-100 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3 text-amber-300" />
                    <span>Add {flag.title.split(':')[0]}</span>
                    <span className="text-[10px] text-amber-300/80 font-mono">
                      ({flag.scoreImpact})
                    </span>
                  </button>
                ))}
            </div>
          </div>
        ) : (
          <div className="mt-3 p-2.5 rounded-xl bg-emerald-400/[0.08] border border-emerald-400/25 flex items-center gap-2 text-xs text-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">
              FIG Composition Standard Met (+2.00 max CR awarded). No missing requirement flags!
            </span>
          </div>
        )}

        {/* Readiness Meter */}
        <div className="space-y-1 pt-3">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-neutral-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-neutral-300" />
              <span>Routine Readiness</span>
            </span>
            <span className="text-white font-semibold">{routineProgressPercent}%</span>
          </div>

          <div className="h-2 w-full bg-white/[0.08] rounded-full overflow-hidden flex p-0.5 gap-0.5">
            <div
              className="h-full bg-white rounded-full transition-all duration-300"
              style={{
                width: `${totalDScore > 0 ? (difficultyValue / (totalDScore || 1)) * routineProgressPercent : 0}%`,
              }}
              title={`Difficulty Value: ${difficultyValue.toFixed(1)}`}
            />
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-300"
              style={{
                width: `${totalDScore > 0 ? (elementGroupValue / (totalDScore || 1)) * routineProgressPercent : 0}%`,
              }}
              title={`Composition Requirements: ${elementGroupValue.toFixed(1)}`}
            />
            {connectionBonus > 0 && (
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-300"
                style={{
                  width: `${totalDScore > 0 ? (connectionBonus / (totalDScore || 1)) * routineProgressPercent : 0}%`,
                }}
                title={`Connection Bonus: ${connectionBonus.toFixed(1)}`}
              />
            )}
          </div>
        </div>
      </div>

      {/* Expandable Deep Breakdown Audit Section */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="border-t border-white/[0.08] bg-black/40"
          >
            {/* Sub-Tabs with Sliding Indicator Pill */}
            <div className="p-3 border-b border-white/[0.06]">
              <div className="flex items-center rounded-full bg-white/[0.05] p-1 border border-white/[0.08] relative">
                {[
                  {
                    id: 'flags' as BreakdownTab,
                    label: 'Flags',
                    badge: missingFlags.length.toString(),
                    alert: missingFlags.length > 0,
                  },
                  {
                    id: 'cr' as BreakdownTab,
                    label: 'Composition',
                    badge: `${fulfilledCount}/4`,
                  },
                  {
                    id: 'counting' as BreakdownTab,
                    label: 'Total DV',
                    badge: `${Math.min(skillsCount, 8)}/8`,
                  },
                  {
                    id: 'formula' as BreakdownTab,
                    label: 'D-Formula',
                  },
                ].map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className="relative flex-1 h-8 rounded-full flex items-center justify-center gap-1 text-xs select-none cursor-pointer transition-colors"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="breakdown-subtab-pill"
                          className="absolute inset-0 rounded-full bg-white shadow-sm"
                          transition={{
                            type: 'spring',
                            stiffness: 450,
                            damping: 35,
                          }}
                        />
                      )}

                      <span
                        className={`relative z-10 font-medium transition-colors duration-200 ${
                          isActive ? 'text-neutral-950 font-semibold' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </span>

                      {tab.badge && (
                        <span
                          className={`relative z-10 px-1.5 py-0.2 rounded-full text-[10px] font-mono leading-none transition-colors duration-200 ${
                            isActive
                              ? 'bg-black text-white'
                              : tab.alert
                              ? 'bg-amber-400/20 text-amber-300 font-semibold'
                              : 'bg-white/10 text-neutral-400'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-Tab View Container */}
            <div className="p-3 sm:p-4">
              {/* TAB 1: MISSING REQUIREMENT FLAGS */}
              {activeTab === 'flags' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span className="font-mono text-[11px] uppercase tracking-wider">
                      Audit Flags & Missing Criteria
                    </span>
                    <span className="font-mono text-neutral-400">
                      {missingFlags.length === 0
                        ? '0 issues detected'
                        : `${missingFlags.length} action item${missingFlags.length > 1 ? 's' : ''}`}
                    </span>
                  </div>

                  {missingFlags.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-emerald-400/[0.05] border border-emerald-400/20 text-center space-y-1.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="text-sm font-semibold text-white">
                        Full FIG Code Compliance
                      </div>
                      <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                        All 4 official Composition Requirement groups are satisfied and maximum composition value (+2.00) is achieved.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {missingFlags.map((flag) => (
                        <div
                          key={flag.id}
                          className="p-3 rounded-xl bg-white/[0.03] border border-amber-400/25 space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 min-w-0">
                              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                              <div>
                                <div className="text-xs font-semibold text-white">
                                  {flag.title}
                                </div>
                                <p className="text-[11px] text-neutral-300 mt-0.5 leading-relaxed">
                                  {flag.description}
                                </p>
                              </div>
                            </div>

                            <span className="px-2 py-0.5 rounded text-[10px] font-mono shrink-0 bg-amber-400/10 text-amber-300 border border-amber-400/20">
                              {flag.scoreImpact}
                            </span>
                          </div>

                          {flag.elementGroupNumber && onAddSkillForGroup && (
                            <div className="pt-2 border-t border-white/[0.05] flex justify-end">
                              <button
                                type="button"
                                onClick={() => onAddSkillForGroup(flag.elementGroupNumber!)}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Skill for Group {flag.elementGroupNumber}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: COMPOSITION REQUIREMENTS (CR) */}
              {activeTab === 'cr' && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                    <span className="font-mono text-[11px] uppercase tracking-wider">
                      {routine.apparatus} · 4 FIG Element Groups
                    </span>
                    <span className="font-mono text-emerald-400 font-semibold">
                      +{elementGroupValue.toFixed(2)} / 2.00 pts
                    </span>
                  </div>

                  {groupFulfillment.map((group) => (
                    <div
                      key={group.groupNumber}
                      className={`p-3 rounded-xl border transition-all ${
                        group.isFulfilled
                          ? 'bg-white/[0.04] border-emerald-400/30'
                          : 'bg-white/[0.02] border-white/[0.06] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              group.isFulfilled
                                ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                                : 'bg-white/[0.06] text-neutral-500 border border-white/[0.1]'
                            }`}
                          >
                            {group.isFulfilled ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <span className="text-[10px] font-mono font-bold">
                                {group.groupNumber}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-semibold text-white">
                                {group.label}: {group.name}
                              </span>
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                                  group.isFulfilled
                                    ? 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30'
                                    : 'bg-white/[0.04] text-neutral-400 border-white/[0.08]'
                                }`}
                              >
                                {group.isFulfilled ? '+0.50 pts' : '0.00 / 0.50'}
                              </span>
                            </div>

                            <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                              {group.description}
                            </p>

                            {group.isFulfilled ? (
                              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] font-mono text-neutral-500">
                                  Satisfied by:
                                </span>
                                {group.skills.map((s) => (
                                  <span
                                    key={s.instanceId}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.08] text-[10px] font-medium text-neutral-200 border border-white/[0.1]"
                                  >
                                    <span className="font-mono text-white">
                                      {s.skill.difficulty}
                                    </span>
                                    <span className="truncate max-w-[120px]">
                                      {s.skill.name}
                                    </span>
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <div className="mt-2 flex items-center justify-between gap-2 pt-1 border-t border-white/[0.04]">
                                <span className="text-[10px] text-amber-300/90 font-mono">
                                  ⚠️ Missing element group
                                </span>
                                {onAddSkillForGroup && (
                                  <button
                                    type="button"
                                    onClick={() => onAddSkillForGroup(group.groupNumber)}
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white text-black text-[11px] font-semibold hover:bg-neutral-200 transition-colors cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                    <span>Add {group.label}</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: TOTAL DIFFICULTY VALUE (TOP 8) */}
              {activeTab === 'counting' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                    <span className="font-mono text-[11px] uppercase tracking-wider">
                      Total Difficulty Value (Top 8 Elements)
                    </span>
                    <span className="font-mono text-white font-bold text-sm">
                      DV {difficultyValue.toFixed(1)}
                    </span>
                  </div>

                  {/* Letter Difficulty Grades Distribution Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                    <span className="text-[10px] font-mono text-neutral-400 mr-1">
                      Grade Profile:
                    </span>
                    {(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'] as DifficultyLetter[])
                      .filter((grade) => (difficultyDistribution[grade] || 0) > 0)
                      .map((grade) => (
                        <span
                          key={grade}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-[11px] font-mono text-neutral-200"
                        >
                          <span className="font-bold text-white">{grade}</span>
                          <span className="text-neutral-500">×</span>
                          <span>{difficultyDistribution[grade]}</span>
                        </span>
                      ))}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Array.from({ length: 8 }).map((_, slotIndex) => {
                      const item = countingSkills[slotIndex];
                      return (
                        <div
                          key={slotIndex}
                          className={`p-2.5 rounded-xl border flex items-center justify-between gap-2.5 ${
                            item
                              ? 'bg-white/[0.04] border-white/[0.1]'
                              : 'bg-white/[0.01] border-dashed border-white/[0.08]'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-white/[0.06] text-[10px] font-mono text-neutral-400 flex items-center justify-center shrink-0">
                              {slotIndex + 1}
                            </span>

                            {item ? (
                              <div className="min-w-0">
                                <div className="text-xs font-semibold text-white truncate">
                                  {item.skill.name}
                                </div>
                                <div className="text-[10px] font-mono text-neutral-400">
                                  FIG {item.skill.figCode} · Group {item.skill.elementGroupNumber}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs text-neutral-500 italic">
                                Open counting slot (+0.0)
                              </span>
                            )}
                          </div>

                          {item && (
                            <TagChip variant="difficulty" size="xs">
                              {item.skill.difficulty} (+{item.skill.difficultyValue.toFixed(1)})
                            </TagChip>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {nonCountingSkills.length > 0 && (
                    <div className="pt-2 border-t border-white/[0.06]">
                      <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                        Reserve Elements ({nonCountingSkills.length} beyond top 8)
                      </span>
                      <div className="space-y-1.5">
                        {nonCountingSkills.map((item) => (
                          <div
                            key={item.instanceId}
                            className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.05] flex items-center justify-between text-xs text-neutral-400"
                          >
                            <span className="truncate">{item.skill.name}</span>
                            <span className="font-mono text-[10px] text-neutral-500">
                              Non-counting ({item.skill.difficulty} +{item.skill.difficultyValue.toFixed(1)})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: FORMULA EXPLANATION */}
              {activeTab === 'formula' && (
                <div className="space-y-3 text-xs text-neutral-300">
                  <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] font-mono text-center space-y-1">
                    <span className="text-[10px] uppercase text-neutral-400">FIG Code Calculation</span>
                    <div className="text-sm font-bold text-white">
                      Total D = DV (Top 8) + CR (Max 2.0) + CV (Connection)
                    </div>
                    <div className="text-xs text-neutral-400">
                      {difficultyValue.toFixed(1)} + {elementGroupValue.toFixed(1)} + {connectionBonus.toFixed(1)} ={' '}
                      <span className="text-white font-bold">{totalDScore.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="font-semibold text-white mb-0.5">1. Difficulty (DV)</div>
                      <p className="text-[11px] text-neutral-400 leading-snug">
                        Sum of the 8 highest difficulty values in the routine.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="font-semibold text-white mb-0.5">2. Composition (CR)</div>
                      <p className="text-[11px] text-neutral-400 leading-snug">
                        0.50 points per fulfilled FIG element group (max 2.00 points).
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                      <div className="font-semibold text-white mb-0.5">3. Connection (CV)</div>
                      <p className="text-[11px] text-neutral-400 leading-snug">
                        Bonus awarded for direct acrobatic or flight connections.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  );
};
