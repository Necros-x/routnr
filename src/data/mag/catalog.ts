import type { GymnasticSkill, MagApparatus } from '../../types/gymnastics';
import { MOCK_SKILLS } from '../mockSkills';
import { VERIFIED_MAG_SKILLS } from './verified';

const MAG_APPARATUS = new Set<MagApparatus>([
  'Floor Exercise',
  'Pommel Horse',
  'Still Rings',
  'Vault',
  'Parallel Bars',
  'High Bar',
]);

const SOURCE_MIGRATED_APPARATUS = new Set<MagApparatus>([
  'Floor Exercise',
]);

const provisionalSkills: GymnasticSkill[] = MOCK_SKILLS.filter(
  (skill) =>
    MAG_APPARATUS.has(skill.apparatus as MagApparatus) &&
    !SOURCE_MIGRATED_APPARATUS.has(skill.apparatus as MagApparatus),
).map((skill) => ({
  ...skill,
  verificationStatus: 'provisional',
  sourceRefs: [],
}));

const verifiedById = new Map(
  VERIFIED_MAG_SKILLS.map((skill) => [skill.id, skill]),
);

const merged = provisionalSkills.map(
  (skill) => verifiedById.get(skill.id) ?? skill,
);

const provisionalIds = new Set(provisionalSkills.map((skill) => skill.id));

/**
 * Migration catalog.
 *
 * Once an apparatus enters source migration, its legacy sample records are
 * removed from the live catalog. Verified records are then supplied from the
 * override layer without silently reusing old sample IDs for different skills.
 */
export const MAG_SKILLS: GymnasticSkill[] = [
  ...merged,
  ...VERIFIED_MAG_SKILLS.filter((skill) => !provisionalIds.has(skill.id)),
];
