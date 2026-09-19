import type {
  AllAroundRow,
  ApparatusCode,
  MagApparatus,
  PrimaryRoutineMap,
  Routine,
} from '../types/gymnastics';

export const MAG_APPARATUS_ORDER: MagApparatus[] = [
  'Floor Exercise',
  'Pommel Horse',
  'Still Rings',
  'Vault',
  'Parallel Bars',
  'High Bar',
];

export const MAG_APPARATUS_CODES: Record<
  MagApparatus,
  Exclude<ApparatusCode, 'BB' | 'UB'>
> = {
  'Floor Exercise': 'FX',
  'Pommel Horse': 'PH',
  'Still Rings': 'SR',
  Vault: 'VT',
  'Parallel Bars': 'PB',
  'High Bar': 'HB',
};

export function buildDefaultPrimaryRoutineMap(
  routines: Routine[],
): PrimaryRoutineMap {
  const next: PrimaryRoutineMap = {};

  MAG_APPARATUS_ORDER.forEach((apparatus) => {
    const first = routines.find((routine) => routine.apparatus === apparatus);
    if (first) next[apparatus] = first.id;
  });

  return next;
}

export function buildAllAroundRows(
  routines: Routine[],
  primaryRoutineIds: PrimaryRoutineMap,
): AllAroundRow[] {
  return MAG_APPARATUS_ORDER.map((apparatus) => {
    const routineId = primaryRoutineIds[apparatus] ?? null;
    const routine =
      routines.find(
        (candidate) =>
          candidate.id === routineId && candidate.apparatus === apparatus,
      ) ?? null;

    return {
      apparatus,
      code: MAG_APPARATUS_CODES[apparatus],
      routineId: routine?.id ?? null,
      routineName: routine?.name ?? 'Not selected',
      skills: routine?.skills.length ?? 0,
      difficultyValue: routine?.summary.difficultyValue ?? 0,
      groupValue: routine?.summary.elementGroupValue ?? 0,
      connectionBonus: routine?.summary.connectionBonus ?? 0,
      dScore: routine?.summary.totalDScore ?? 0,
    };
  });
}
