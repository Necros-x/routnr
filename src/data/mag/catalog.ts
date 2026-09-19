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

const provisionalSkills: GymnasticSkill[] = MOCK_SKILLS.filter((skill) =>
  MAG_APPARATUS.has(skill.apparatus as MagApparatus),
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
 * Verified records replace provisional records by stable ID. New verified
 * records that did not exist in the legacy sample catalog are appended.
 */
export const MAG_SKILLS: GymnasticSkill[] = [
  ...merged,
  ...VERIFIED_MAG_SKILLS.filter((skill) => !provisionalIds.has(skill.id)),
];
