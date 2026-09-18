import { Apparatus, DifficultyLetter, RoutineSkill } from '../types/gymnastics';
import { getElementGroupsForApparatus } from '../data/apparatusRequirements';

export interface GroupFulfillmentStatus {
  groupNumber: 1 | 2 | 3 | 4;
  label: string;
  name: string;
  description: string;
  isFulfilled: boolean;
  points: number;
  fulfillingSkill?: RoutineSkill;
  skills: RoutineSkill[];
}

export interface DynamicDScoreResult {
  /** Total difficulty value from recognized counting skills (top 8, unique FIG elements) */
  difficultyValue: number;
  /** Element group requirement points (0.50 per fulfilled group, max 2.00) */
  elementGroupValue: number;
  /** Connection value / bonus points sum */
  connectionBonus: number;
  /** Total official FIG D-Score (DV + CR + CV) */
  totalDScore: number;
  /** The skills recognized for difficulty value (up to 8, sorted by difficulty descending) */
  countingSkills: RoutineSkill[];
  /** Skills beyond the 8 counting element limit or deemed reserve */
  nonCountingSkills: RoutineSkill[];
  /** Skills that were repeated and therefore ineligible for duplicate DV under FIG Code */
  repeatedSkills: RoutineSkill[];
  /** Detailed breakdown of all 4 element groups and their fulfillment status */
  groupFulfillment: GroupFulfillmentStatus[];
  /** Unfulfilled element groups that reduce the routine's CR score */
  missingGroups: GroupFulfillmentStatus[];
  /** Distribution of difficulty letter grades (A-J) among counting skills */
  letterDistribution: Partial<Record<DifficultyLetter, number>>;
  /** Total number of skills currently in the routine */
  totalSkillsCount: number;
  /** Number of remaining open slots (out of 8) that could still count toward DV */
  countingSlotsRemaining: number;
  /** Theoretical maximum D-Score if remaining CR groups and slots were filled */
  potentialDScoreGain: number;
}

export interface RoutineScoreSummary {
  difficultyValue: number;
  elementGroupValue: number;
  connectionBonus: number;
  totalDScore: number;
}

/**
 * Dynamically calculates the official FIG D-Score (Difficulty Score)
 * based on all skills currently added to the routine.
 *
 * Evaluation Rules:
 * 1. FIG recognizes a maximum of 8 counting skills for Difficulty Value (DV).
 * 2. Elements are evaluated without repetition: identical FIG codes can only be
 *    credited once for Difficulty Value.
 * 3. Composition Requirements (CR) grant 0.50 points per fulfilled element group
 *    (up to a maximum of 2.00 for all 4 groups).
 * 4. Connection Bonus (CV) is accumulated from eligible skill combinations.
 * 5. Total D-Score = DV + CR + CV.
 *
 * @param skills List of skills currently in the routine
 * @param apparatus The apparatus discipline (used for element group definitions)
 * @returns Detailed dynamic score breakdown including counting skills and flags
 */
export function calculateDynamicDScore(
  skills: RoutineSkill[],
  apparatus?: Apparatus
): DynamicDScoreResult {
  const totalSkillsCount = skills.length;

  if (totalSkillsCount === 0) {
    const defaultGroups = apparatus ? getElementGroupsForApparatus(apparatus) : [];
    const groupFulfillment: GroupFulfillmentStatus[] = defaultGroups.map((g) => ({
      groupNumber: g.groupNumber,
      label: g.label,
      name: g.name,
      description: g.description,
      isFulfilled: false,
      points: 0.0,
      skills: [],
    }));

    return {
      difficultyValue: 0.0,
      elementGroupValue: 0.0,
      connectionBonus: 0.0,
      totalDScore: 0.0,
      countingSkills: [],
      nonCountingSkills: [],
      repeatedSkills: [],
      groupFulfillment,
      missingGroups: groupFulfillment,
      letterDistribution: {},
      totalSkillsCount: 0,
      countingSlotsRemaining: 8,
      potentialDScoreGain: 2.0,
    };
  }

  // 1. Check for repeated FIG codes (each element recognized only once for DV)
  const seenFigCodes = new Set<string>();
  const eligibleSkills: RoutineSkill[] = [];
  const repeatedSkills: RoutineSkill[] = [];

  // Sort by difficulty value descending so the highest instance takes precedence
  const sortedByDifficulty = [...skills].sort(
    (a, b) => b.skill.difficultyValue - a.skill.difficultyValue
  );

  for (const item of sortedByDifficulty) {
    const code = item.skill.figCode;
    if (seenFigCodes.has(code)) {
      repeatedSkills.push(item);
    } else {
      seenFigCodes.add(code);
      eligibleSkills.push(item);
    }
  }

  // 2. Select top counting skills (up to 8 under FIG rules)
  const countingSkills = eligibleSkills.slice(0, 8);
  const nonCountingSkills = [
    ...eligibleSkills.slice(8),
    ...repeatedSkills,
  ];

  // Sum difficulty values of recognized counting skills
  const rawDifficultySum = countingSkills.reduce(
    (acc, item) => acc + (item.skill.difficultyValue || 0),
    0
  );
  const difficultyValue = Math.round(rawDifficultySum * 10) / 10;

  // 3. Composition Requirements (CR) / Element Groups (max 2.00 pts)
  const apparatusGroups = apparatus
    ? getElementGroupsForApparatus(apparatus)
    : [
        { groupNumber: 1 as const, label: 'EG I', name: 'Group I', description: 'Group I Elements' },
        { groupNumber: 2 as const, label: 'EG II', name: 'Group II', description: 'Group II Elements' },
        { groupNumber: 3 as const, label: 'EG III', name: 'Group III', description: 'Group III Elements' },
        { groupNumber: 4 as const, label: 'EG IV', name: 'Group IV (Dismount)', description: 'Dismount Elements' },
      ];

  const groupFulfillment: GroupFulfillmentStatus[] = apparatusGroups.map((group) => {
    // A skill fulfills a group if its elementGroupNumber matches
    const fulfillingSkills = skills.filter(
      (s) => s.skill.elementGroupNumber === group.groupNumber
    );
    const isFulfilled = fulfillingSkills.length > 0;
    return {
      groupNumber: group.groupNumber,
      label: group.label,
      name: group.name,
      description: group.description,
      isFulfilled,
      points: isFulfilled ? 0.5 : 0.0,
      fulfillingSkill: fulfillingSkills[0],
      skills: fulfillingSkills,
    };
  });

  const fulfilledGroupsCount = groupFulfillment.filter((g) => g.isFulfilled).length;
  const elementGroupValue = Math.min(2.0, fulfilledGroupsCount * 0.5);
  const missingGroups = groupFulfillment.filter((g) => !g.isFulfilled);

  // 4. Connection Bonus (CV) calculation
  const rawConnectionBonus = skills.reduce(
    (acc, item) => acc + (Number(item.connectionBonus) || 0),
    0
  );
  const connectionBonus = Math.round(rawConnectionBonus * 10) / 10;

  // 5. Total D-Score = DV + CR + CV
  const rawTotal = difficultyValue + elementGroupValue + connectionBonus;
  const totalDScore = Math.round(rawTotal * 100) / 100;

  // 6. Letter distribution among counting skills
  const letterDistribution: Partial<Record<DifficultyLetter, number>> = {};
  countingSkills.forEach((s) => {
    const grade = s.skill.difficulty;
    letterDistribution[grade] = (letterDistribution[grade] || 0) + 1;
  });

  const countingSlotsRemaining = Math.max(0, 8 - countingSkills.length);
  const missingCRPoints = (4 - fulfilledGroupsCount) * 0.5;
  const potentialDScoreGain = Math.round(missingCRPoints * 10) / 10;

  return {
    difficultyValue,
    elementGroupValue,
    connectionBonus,
    totalDScore,
    countingSkills,
    nonCountingSkills,
    repeatedSkills,
    groupFulfillment,
    missingGroups,
    letterDistribution,
    totalSkillsCount,
    countingSlotsRemaining,
    potentialDScoreGain,
  };
}

/**
 * Standard summary calculator compatible with Routine.summary schema.
 */
export function calculateRoutineScore(
  skills: RoutineSkill[],
  apparatus?: Apparatus
): RoutineScoreSummary {
  const result = calculateDynamicDScore(skills, apparatus);
  return {
    difficultyValue: result.difficultyValue,
    elementGroupValue: result.elementGroupValue,
    connectionBonus: result.connectionBonus,
    totalDScore: result.totalDScore,
  };
}
