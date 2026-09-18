import { Apparatus } from '../types/gymnastics';

export interface ElementGroupInfo {
  groupNumber: 1 | 2 | 3 | 4;
  label: string; // e.g., "Group I"
  name: string; // e.g., "Non-Acrobatic Elements"
  description: string;
  minPointsValue: number; // 0.50 pts in FIG
}

export const APPARATUS_ELEMENT_GROUPS: Record<Apparatus, ElementGroupInfo[]> = {
  'Floor Exercise': [
    {
      groupNumber: 1,
      label: 'Group I',
      name: 'Non-Acrobatic & Strength',
      description: 'Static holds, circles, flairs, handstands, press elements & dance elements.',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 2,
      label: 'Group II',
      name: 'Acrobatic Elements Forward',
      description: 'Forward salto series, double front twists, punch combinations.',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 3,
      label: 'Group III',
      name: 'Acrobatic Elements Backward',
      description: 'Double layouts, back twisting saltos, Tsukahara passes.',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 4,
      label: 'Group IV',
      name: 'Dismount & Closing Pass',
      description: 'Final competition pass with required minimum difficulty rating (C+ / D+).',
      minPointsValue: 0.5,
    },
  ],
  'Pommel Horse': [
    {
      groupNumber: 1,
      label: 'Group I',
      name: 'Single Leg Swings & Scissors',
      description: 'Scissor forward/backward with or without half turns, leg cuts.',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 2,
      label: 'Group II',
      name: 'Circles, Flairs & Spindles',
      description: 'Circle elements over pommels, Russian wende swings, flairs.',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 3,
      label: 'Group III',
      name: 'Travel Elements',
      description: 'Magyar wandering, Sivado travel, 3/3 length travels across horse.',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 4,
      label: 'Group IV',
      name: 'Dismounts',
      description: 'Circles to handstand 3/3 travel, pirouette push-offs.',
      minPointsValue: 0.5,
    },
  ],
  'Still Rings': [
    {
      groupNumber: 1,
      label: 'Group I',
      name: 'Kip & Swing to Handstand',
      description: 'Swings through handstand, kips, backward giants to handstand.',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 2,
      label: 'Group II',
      name: 'Strength Holds & Static Positions',
      description: 'Iron Cross, Maltese cross, Planche, Inverted cross (min 2 sec hold).',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 3,
      label: 'Group III',
      name: 'Swings to Strength Holds',
      description: 'Balandin, Honma to cross, back giant to Maltese.',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 4,
      label: 'Group IV',
      name: 'Dismounts',
      description: 'Double salto layout, full twisting Tsukahara dismounts.',
      minPointsValue: 0.5,
    },
  ],
  'Vault': [
    {
      groupNumber: 1,
      label: 'Group I',
      name: 'Handspring Entries Without Salto',
      description: 'Direct handspring and Yamashita style vaults with turns.',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 2,
      label: 'Group II',
      name: 'Handspring Forward with Saltos',
      description: 'Dragulescu, Roche, double front with/without half twist.',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 3,
      label: 'Group III',
      name: 'Tsukahara Entries',
      description: '1/4-1/2 twist on entry followed by salto backward (Kasamatsu).',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 4,
      label: 'Group IV',
      name: 'Round-off Yurchenko Entries',
      description: 'Round-off onto board, back handspring onto table with twists/saltos.',
      minPointsValue: 0.5,
    },
  ],
  'Parallel Bars': [
    {
      groupNumber: 1,
      label: 'Group I',
      name: 'Elements in or Through Support',
      description: 'Swings through handstand, pirouettes on one/two rails, Diamidov.',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 2,
      label: 'Group II',
      name: 'Upper Arm Hang Elements',
      description: 'Bail rolls, upper arm saltos, basket swings.',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 3,
      label: 'Group III',
      name: 'Long Swings in Hang',
      description: 'Underside swings, giant swings with/without turns on rails.',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 4,
      label: 'Group IV',
      name: 'Dismounts',
      description: 'Double front with half twist, double back salto layout dismount.',
      minPointsValue: 0.5,
    },
  ],
  'High Bar': [
    {
      groupNumber: 1,
      label: 'Group I',
      name: 'Long Swings & Giant Turns',
      description: 'Forward/backward giant swings with pirouettes, grip changes.',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 2,
      label: 'Group II',
      name: 'Flight & Release Elements',
      description: 'Kovacs, Tkatchev, Cassina, Pegan release and re-grasp moves.',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 3,
      label: 'Group III',
      name: 'In-Bar & Adler Elements',
      description: 'Stalder swings, clear hip circles, Adler turns to handstand.',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 4,
      label: 'Group IV',
      name: 'Dismounts',
      description: 'Triple back salto, full twisting double layout dismounts.',
      minPointsValue: 0.5,
    },
  ],
  'Balance Beam': [
    {
      groupNumber: 1,
      label: 'Group I',
      name: 'Dance Connections & Leaps',
      description: 'Split jumps, wolf jumps, sissone series with 180° leg separation.',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 2,
      label: 'Group II',
      name: 'Turns & Pirouettes',
      description: 'Full/double pirouettes on one foot, illusion turns.',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 3,
      label: 'Group III',
      name: 'Acrobatic Flight Elements',
      description: 'Back handspring, layout step-out, front aerialseries.',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 4,
      label: 'Group IV',
      name: 'Dismounts',
      description: 'Double tuck, double pike, or gainer dismounts off end.',
      minPointsValue: 0.5,
    },
  ],
  'Uneven Bars': [
    {
      groupNumber: 1,
      label: 'Group I',
      name: 'Transitions Between Bars',
      description: 'Bail to handstand, Pak salto, Shaposhnikova half.',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 2,
      label: 'Group II',
      name: 'Flight Elements on Same Bar',
      description: 'Tkatchev, Jaeger, Gienger releases on high bar.',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 3,
      label: 'Group III',
      name: 'Close Bar & Circle Elements',
      description: 'Stalder to handstand, clear hip circles, in-bar pirouettes.',
      minPointsValue: 0.5,
    },
    {
      groupNumber: 4,
      label: 'Group IV',
      name: 'Dismounts',
      description: 'Full-in double tuck, Fabrichnova double layout dismount.',
      minPointsValue: 0.5,
    },
  ],
};

export const getElementGroupsForApparatus = (apparatus: Apparatus): ElementGroupInfo[] => {
  return APPARATUS_ELEMENT_GROUPS[apparatus] || APPARATUS_ELEMENT_GROUPS['Floor Exercise'];
};
