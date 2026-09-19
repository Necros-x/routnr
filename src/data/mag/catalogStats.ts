import { MAG_SKILLS } from './catalog';

export const MAG_CATALOG_STATS = {
  total: MAG_SKILLS.length,
  verified: MAG_SKILLS.filter(
    (skill) =>
      skill.verificationStatus === 'verified' ||
      skill.verificationStatus === 'amended',
  ).length,
  provisional: MAG_SKILLS.filter(
    (skill) => skill.verificationStatus === 'provisional',
  ).length,
} as const;
