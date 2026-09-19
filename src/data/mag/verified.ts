import type { GymnasticSkill } from '../../types/gymnastics';
import { VERIFIED_FLOOR_SKILLS } from './floorExercise';

/**
 * Source-verified MAG records live here during the migration.
 *
 * Additions in this array replace matching provisional records in catalog.ts.
 * Keep IDs stable once a record is verified so saved routines remain compatible.
 */
export const VERIFIED_MAG_SKILLS: GymnasticSkill[] = [
  ...VERIFIED_FLOOR_SKILLS,
];
