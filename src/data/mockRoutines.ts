import { Routine, RoutineSkill } from '../types/gymnastics';
import { MAG_SKILLS } from './mag/catalog';
import { calculateRoutineScore, calculateDynamicDScore } from '../utils/scoreCalculator';

export { calculateRoutineScore, calculateDynamicDScore };

const getSkillById = (id: string) => {
  const found = MAG_SKILLS.find((s) => s.id === id);
  if (!found) throw new Error(`Skill ${id} not found`);
  return found;
};

export const MOCK_ROUTINES: Routine[] = [
  {
    id: 'routine-fx-01',
    name: 'National Championship Floor Set',
    apparatus: 'Floor Exercise',
    lastEdited: '2 hours ago',
    notes: 'Focus on clean landing on the opening double layout pass.',
    skills: [
      {
        instanceId: 'fx-inst-1',
        skillId: 'fx-iii-054',
        skill: getSkillById('fx-iii-054'),
        order: 1,
        connectionBonus: 0.0,
        notes: 'Opening pass',
      },
      {
        instanceId: 'fx-inst-2',
        skillId: 'fx-ii-016',
        skill: getSkillById('fx-ii-016'),
        order: 2,
        connectionBonus: 0.0,
      },
      {
        instanceId: 'fx-inst-3',
        skillId: 'fx-i-027',
        skill: getSkillById('fx-i-027'),
        order: 3,
        connectionBonus: 0.0,
        notes: 'Show the hold clearly',
      },
      {
        instanceId: 'fx-inst-4',
        skillId: 'fx-iv-022',
        skill: getSkillById('fx-iv-022'),
        order: 4,
        connectionBonus: 0.0,
      },
      {
        instanceId: 'fx-inst-5',
        skillId: 'fx-iii-060',
        skill: getSkillById('fx-iii-060'),
        order: 5,
        connectionBonus: 0.0,
        notes: 'Demo element only — arrange according to your routine',
      },
    ],
    summary: {
      difficultyValue: 2.6,
      elementGroupValue: 2.0,
      connectionBonus: 0.0,
      totalDScore: 4.6,
    },
  },
  {
    id: 'routine-ph-01',
    name: 'Olympic Selection Pommel Routine',
    apparatus: 'Pommel Horse',
    lastEdited: 'Yesterday',
    notes: 'Targeting rhythm consistency throughout Russian circles.',
    skills: [
      {
        instanceId: 'ph-inst-1',
        skillId: 'ph-04',
        skill: getSkillById('ph-04'),
        order: 1,
        connectionBonus: 0.0,
      },
      {
        instanceId: 'ph-inst-2',
        skillId: 'ph-01',
        skill: getSkillById('ph-01'),
        order: 2,
        connectionBonus: 0.1,
      },
      {
        instanceId: 'ph-inst-3',
        skillId: 'ph-02',
        skill: getSkillById('ph-02'),
        order: 3,
        connectionBonus: 0.1,
      },
      {
        instanceId: 'ph-inst-4',
        skillId: 'ph-03',
        skill: getSkillById('ph-03'),
        order: 4,
        connectionBonus: 0.2,
      },
      {
        instanceId: 'ph-inst-5',
        skillId: 'ph-05',
        skill: getSkillById('ph-05'),
        order: 5,
        connectionBonus: 0.0,
      },
    ],
    summary: {
      difficultyValue: 2.0,
      elementGroupValue: 2.0,
      connectionBonus: 0.4,
      totalDScore: 4.4,
    },
  },
  {
    id: 'routine-sr-01',
    name: 'Still Rings Power Series',
    apparatus: 'Still Rings',
    lastEdited: '3 days ago',
    notes: 'Eliminate cable vibration on Balandin drop.',
    skills: [
      {
        instanceId: 'sr-inst-1',
        skillId: 'sr-03',
        skill: getSkillById('sr-03'),
        order: 1,
        connectionBonus: 0.0,
      },
      {
        instanceId: 'sr-inst-2',
        skillId: 'sr-02',
        skill: getSkillById('sr-02'),
        order: 2,
        connectionBonus: 0.0,
      },
      {
        instanceId: 'sr-inst-3',
        skillId: 'sr-01',
        skill: getSkillById('sr-01'),
        order: 3,
        connectionBonus: 0.1,
      },
      {
        instanceId: 'sr-inst-4',
        skillId: 'sr-05',
        skill: getSkillById('sr-05'),
        order: 4,
        connectionBonus: 0.1,
      },
      {
        instanceId: 'sr-inst-5',
        skillId: 'sr-04',
        skill: getSkillById('sr-04'),
        order: 5,
        connectionBonus: 0.0,
      },
    ],
    summary: {
      difficultyValue: 2.0,
      elementGroupValue: 2.0,
      connectionBonus: 0.2,
      totalDScore: 4.2,
    },
  },
  {
    id: 'routine-vt-01',
    name: 'Vault Competition Passes',
    apparatus: 'Vault',
    lastEdited: 'Sep 12',
    notes: 'Primary pass Dragulescu, backup Amanar.',
    skills: [
      {
        instanceId: 'vt-inst-1',
        skillId: 'vt-01',
        skill: getSkillById('vt-01'),
        order: 1,
        connectionBonus: 0.0,
      },
    ],
    summary: {
      difficultyValue: 0.6,
      elementGroupValue: 0.5,
      connectionBonus: 0.0,
      totalDScore: 1.1,
    },
  },
  {
    id: 'routine-pb-01',
    name: 'Parallel Bars Precision Set',
    apparatus: 'Parallel Bars',
    lastEdited: 'Sep 10',
    notes: 'Clean extension on Tippelt turn.',
    skills: [
      {
        instanceId: 'pb-inst-1',
        skillId: 'pb-02',
        skill: getSkillById('pb-02'),
        order: 1,
        connectionBonus: 0.0,
      },
      {
        instanceId: 'pb-inst-2',
        skillId: 'pb-04',
        skill: getSkillById('pb-04'),
        order: 2,
        connectionBonus: 0.1,
      },
      {
        instanceId: 'pb-inst-3',
        skillId: 'pb-01',
        skill: getSkillById('pb-01'),
        order: 3,
        connectionBonus: 0.1,
      },
      {
        instanceId: 'pb-inst-4',
        skillId: 'pb-03',
        skill: getSkillById('pb-03'),
        order: 4,
        connectionBonus: 0.1,
      },
      {
        instanceId: 'pb-inst-5',
        skillId: 'pb-05',
        skill: getSkillById('pb-05'),
        order: 5,
        connectionBonus: 0.0,
      },
    ],
    summary: {
      difficultyValue: 2.2,
      elementGroupValue: 1.5,
      connectionBonus: 0.3,
      totalDScore: 4.0,
    },
  },
  {
    id: 'routine-hb-01',
    name: 'High Bar Flight & Release Showcase',
    apparatus: 'High Bar',
    lastEdited: 'Sep 08',
    notes: 'Kovacs directly into immediate giants.',
    skills: [
      {
        instanceId: 'hb-inst-1',
        skillId: 'hb-04',
        skill: getSkillById('hb-04'),
        order: 1,
        connectionBonus: 0.0,
      },
      {
        instanceId: 'hb-inst-2',
        skillId: 'hb-01',
        skill: getSkillById('hb-01'),
        order: 2,
        connectionBonus: 0.2,
      },
      {
        instanceId: 'hb-inst-3',
        skillId: 'hb-02',
        skill: getSkillById('hb-02'),
        order: 3,
        connectionBonus: 0.2,
      },
      {
        instanceId: 'hb-inst-4',
        skillId: 'hb-03',
        skill: getSkillById('hb-03'),
        order: 4,
        connectionBonus: 0.1,
      },
      {
        instanceId: 'hb-inst-5',
        skillId: 'hb-05',
        skill: getSkillById('hb-05'),
        order: 5,
        connectionBonus: 0.0,
      },
    ],
    summary: {
      difficultyValue: 2.4,
      elementGroupValue: 1.5,
      connectionBonus: 0.5,
      totalDScore: 4.4,
    },
  },
];
