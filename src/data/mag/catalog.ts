import type { GymnasticSkill, MagApparatus } from '../../types/gymnastics';
import { MOCK_SKILLS } from '../mockSkills';

const MAG_APPARATUS = new Set<MagApparatus>([
  'Floor Exercise',
  'Pommel Horse',
  'Still Rings',
  'Vault',
  'Parallel Bars',
  'High Bar',
]);

/**
 * Temporary migration catalog.
 *
 * Every legacy entry is explicitly marked provisional until it has been
 * reconciled against the current MAG Code reference set in sourceManifest.ts.
 * Verified apparatus data will replace these records incrementally.
 */
export const MAG_SKILLS: GymnasticSkill[] = MOCK_SKILLS.filter((skill) =>
  MAG_APPARATUS.has(skill.apparatus as MagApparatus),
).map((skill) => ({
  ...skill,
  verificationStatus: 'provisional',
  sourceRefs: [],
}));
