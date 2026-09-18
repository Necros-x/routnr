export type Apparatus =
  | 'Floor Exercise'
  | 'Pommel Horse'
  | 'Still Rings'
  | 'Vault'
  | 'Parallel Bars'
  | 'High Bar'
  | 'Balance Beam'
  | 'Uneven Bars';

export type ApparatusCode = 'FX' | 'PH' | 'SR' | 'VT' | 'PB' | 'HB' | 'BB' | 'UB';

export type DifficultyLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I';

export type SkillType =
  | 'Acrobatic / Salto'
  | 'Strength & Hold'
  | 'Flight & Release'
  | 'Swings & Circles'
  | 'Turns & Pirouettes'
  | 'Vault Entry'
  | 'Dismount';

export type BodyPartFocus =
  | 'Upper Body'
  | 'Core & Trunk'
  | 'Lower Body'
  | 'Full Body';

export interface GymnasticSkill {
  id: string;
  name: string;
  apparatus: Apparatus;
  difficulty: DifficultyLetter;
  difficultyValue: number; // e.g., A=0.1, B=0.2, ... H=0.8
  elementGroup: string; // e.g. "I. Non-Acrobatic", "II. Acro Forward", etc.
  elementGroupNumber: 1 | 2 | 3 | 4;
  figCode: string; // FIG Code of Points reference e.g., "1.204"
  description: string;
  aliases: string[];
  tags: string[];
  skillType?: SkillType;
  bodyPart?: BodyPartFocus;
  relatedSkillIds?: string[];
}

export interface RoutineSkill {
  instanceId: string;
  skillId: string;
  skill: GymnasticSkill;
  order: number;
  connectionBonus: number; // e.g., 0.1, 0.2
  notes?: string;
}

export interface Routine {
  id: string;
  name: string;
  apparatus: Apparatus;
  lastEdited: string;
  notes?: string;
  skills: RoutineSkill[];
  summary: {
    difficultyValue: number;
    elementGroupValue: number;
    connectionBonus: number;
    totalDScore: number;
  };
}

export type ActiveTab = 'home' | 'skills' | 'routines';
