import type {
  DifficultyLetter,
  GymnasticSkill,
  SkillVerificationStatus,
} from '../../types/gymnastics';

const DIFFICULTY_VALUE: Record<DifficultyLetter, number> = {
  A: 0.1,
  B: 0.2,
  C: 0.3,
  D: 0.4,
  E: 0.5,
  F: 0.6,
  G: 0.7,
  H: 0.8,
  I: 0.9,
  J: 1.0,
};

const GROUP_NAMES = {
  1: 'I. Non-acrobatic elements',
  2: 'II. Acrobatic elements forward',
  3: 'III. Acrobatic elements backward',
  4: 'IV. Single salto forward and backward with one or more turns',
} as const;

interface FloorElementInput {
  number: number;
  group: 1 | 2 | 3 | 4;
  difficulty: DifficultyLetter;
  name: string;
  aliases?: string[];
  page?: number;
  verificationStatus?: SkillVerificationStatus;
  extraSources?: Array<{
    sourceId: string;
    note: string;
  }>;
}

function floorElement({
  number,
  group,
  difficulty,
  name,
  aliases = [],
  page,
  verificationStatus = 'verified',
  extraSources = [],
}: FloorElementInput): GymnasticSkill {
  const roman = ['I', 'II', 'III', 'IV'][group - 1];
  const elementNumber = `${roman}.${number}`;

  return {
    id: `fx-${roman.toLowerCase()}-${String(number).padStart(3, '0')}`,
    name,
    apparatus: 'Floor Exercise',
    difficulty,
    difficultyValue: DIFFICULTY_VALUE[difficulty],
    elementGroup: GROUP_NAMES[group],
    elementGroupNumber: group,
    figCode: elementNumber,
    description: name,
    aliases,
    tags:
      group === 1
        ? ['Floor Exercise', 'Non-acrobatic']
        : ['Floor Exercise', 'Acrobatic', 'Salto'],
    skillType: group === 1 ? undefined : 'Acrobatic / Salto',
    bodyPart: group === 1 ? undefined : 'Full Body',
    verificationStatus,
    sourceRefs: [
      {
        sourceId: 'mag-cop-2025-2028',
        page,
        elementNumber,
        verifiedAt: '2026-09-20',
      },
      ...extraSources.map((source) => ({
        sourceId: source.sourceId,
        elementNumber,
        verifiedAt: '2026-09-20',
        note: source.note,
      })),
    ],
    codeFigure: page
      ? {
          sourcePage: page,
          elementNumber: number,
          alt: `Floor Exercise ${elementNumber} Code of Points illustration`,
        }
      : {
          elementNumber: number,
          alt: `Floor Exercise ${elementNumber} Code of Points illustration`,
        },
  };
}

export const VERIFIED_FLOOR_SKILLS: GymnasticSkill[] = [
  // EG I — Non-acrobatic elements
  floorElement({
    number: 1,
    group: 1,
    difficulty: 'A',
    name: 'From handstand lower to L-sit or straddle L-sit (2 s.)',
    page: 27,
  }),
  floorElement({
    number: 2,
    group: 1,
    difficulty: 'B',
    name: 'V-sit (2 s.)',
    page: 27,
  }),
  floorElement({
    number: 3,
    group: 1,
    difficulty: 'C',
    name: 'V-sit with legs horizontal (2 s.)',
    aliases: ['Manna'],
    page: 27,
  }),
  floorElement({
    number: 7,
    group: 1,
    difficulty: 'A',
    name: 'From stand, Swiss press to handstand (2 s.)',
    page: 27,
  }),
  floorElement({
    number: 8,
    group: 1,
    difficulty: 'B',
    name: 'Piked straight-arm or straight-body bent-arm press to handstand, legs together (2 s.)',
    page: 27,
  }),
  floorElement({
    number: 9,
    group: 1,
    difficulty: 'C',
    name: 'V-sit (2 s.) and press to handstand (2 s.)',
    page: 27,
  }),
  floorElement({
    number: 10,
    group: 1,
    difficulty: 'D',
    name: 'Manna (2 s.) and press to handstand (2 s.)',
    page: 27,
  }),
  floorElement({
    number: 13,
    group: 1,
    difficulty: 'A',
    name: 'Rock to handstand from prone position (2 s.)',
    page: 27,
  }),
  floorElement({
    number: 14,
    group: 1,
    difficulty: 'B',
    name: 'Press from split, straddle L-sit or front support (2 s.)',
    page: 27,
  }),
  floorElement({
    number: 16,
    group: 1,
    difficulty: 'D',
    name: 'From Manna (2 s.), dislocation to handstand (2 s.)',
    page: 27,
  }),
  floorElement({
    number: 19,
    group: 1,
    difficulty: 'A',
    name: 'Handstand (2 s.)',
    page: 27,
  }),
  floorElement({
    number: 20,
    group: 1,
    difficulty: 'B',
    name: 'Press, lower or swing to Japanese handstand (2 s.)',
    page: 27,
  }),
  floorElement({
    number: 21,
    group: 1,
    difficulty: 'C',
    name: 'From split press to Japanese handstand (2 s.)',
    page: 27,
  }),
  floorElement({
    number: 25,
    group: 1,
    difficulty: 'A',
    name: 'Straddle planche (2 s.)',
    page: 28,
  }),
  floorElement({
    number: 27,
    group: 1,
    difficulty: 'C',
    name: 'Planche or swallow (2 s.)',
    page: 28,
  }),
  floorElement({
    number: 31,
    group: 1,
    difficulty: 'A',
    name: 'Half or full turn in handstand or to handstand',
    page: 28,
  }),
  floorElement({
    number: 32,
    group: 1,
    difficulty: 'B',
    name: 'From straddle planche (2 s.) press to handstand (2 s.)',
    page: 28,
  }),
  floorElement({
    number: 34,
    group: 1,
    difficulty: 'D',
    name: 'From planche (2 s.) press to handstand (2 s.)',
    page: 28,
  }),
  floorElement({
    number: 37,
    group: 1,
    difficulty: 'A',
    name: 'From L-sit turn over backward to stand',
    page: 28,
  }),
  floorElement({
    number: 44,
    group: 1,
    difficulty: 'B',
    name: 'Endo roll to handstand (2 s.)',
    page: 28,
  }),
  floorElement({
    number: 45,
    group: 1,
    difficulty: 'C',
    name: 'Endo roll piked to handstand, legs together (2 s.)',
    page: 28,
  }),
  floorElement({
    number: 49,
    group: 1,
    difficulty: 'A',
    name: 'Forward walkover',
    page: 30,
  }),
  floorElement({
    number: 55,
    group: 1,
    difficulty: 'A',
    name: 'Cross or side split (stop required)',
    page: 30,
  }),
  floorElement({
    number: 61,
    group: 1,
    difficulty: 'A',
    name: 'Any standing scale (2 s.)',
    page: 30,
    extraSources: [
      {
        sourceId: 'mag-nl-1-2025',
        note: 'A one-leg balance remains one option for the current Floor balance/jump requirement.',
      },
    ],
  }),
  floorElement({
    number: 62,
    group: 1,
    difficulty: 'B',
    name: 'Standing scale with 180° straddle, no hand hold (2 s.)',
    page: 30,
    extraSources: [
      {
        sourceId: 'mag-nl-1-2025',
        note: 'A one-leg balance remains one option for the current Floor balance/jump requirement.',
      },
    ],
  }),
  floorElement({
    number: 67,
    group: 1,
    difficulty: 'A',
    name: 'Jump backward to front support',
    page: 30,
    verificationStatus: 'amended',
    extraSources: [
      {
        sourceId: 'mag-nl-1-2025',
        note: 'Listed as an eligible jump/leap option for the Floor balance/jump requirement.',
      },
      {
        sourceId: 'mag-nl-4-2026',
        note: 'Current front-support jump landing clarification applies.',
      },
    ],
  }),
  floorElement({
    number: 68,
    group: 1,
    difficulty: 'B',
    name: 'Jump backward with pike-stretch or full turn to front support',
    aliases: ['Endo'],
    page: 30,
    verificationStatus: 'amended',
    extraSources: [
      {
        sourceId: 'mag-nl-1-2025',
        note: 'Listed as an eligible jump/leap option; controlled landing clarification applies.',
      },
      {
        sourceId: 'mag-nl-4-2026',
        note: 'Current front-support jump landing clarification applies.',
      },
    ],
  }),

  // EG II — Acrobatic elements forward
  floorElement({
    number: 1,
    group: 2,
    difficulty: 'A',
    name: 'Forward handspring or flyspring',
    page: 33,
  }),
  floorElement({
    number: 4,
    group: 2,
    difficulty: 'D',
    name: 'Handspring salto forward tucked',
    aliases: ['Morandi'],
    page: 33,
  }),
  floorElement({
    number: 7,
    group: 2,
    difficulty: 'A',
    name: 'Dive roll',
    page: 33,
  }),
  floorElement({
    number: 13,
    group: 2,
    difficulty: 'A',
    name: 'Salto forward tucked or piked, also with half turn',
    page: 33,
  }),
  floorElement({
    number: 14,
    group: 2,
    difficulty: 'B',
    name: 'Salto forward straight, also with half turn',
    page: 33,
  }),
  floorElement({
    number: 16,
    group: 2,
    difficulty: 'D',
    name: 'Double salto forward tucked, also with half turn',
    page: 33,
  }),
  floorElement({
    number: 17,
    group: 2,
    difficulty: 'E',
    name: 'Double salto forward piked, also with half turn',
    page: 33,
  }),
  floorElement({
    number: 36,
    group: 2,
    difficulty: 'F',
    name: 'Double salto forward tucked with full turn',
  }),
  floorElement({
    number: 38,
    group: 2,
    difficulty: 'B',
    name: 'Salto forward tucked or piked to front support',
  }),
  floorElement({
    number: 42,
    group: 2,
    difficulty: 'F',
    name: 'Double salto forward tucked with 3/2 turn',
    aliases: ['Zapata'],
  }),
  floorElement({
    number: 46,
    group: 2,
    difficulty: 'D',
    name: 'Jump forward with half turn to double salto backward tucked',
    aliases: ['Deferr'],
  }),
  floorElement({
    number: 48,
    group: 2,
    difficulty: 'G',
    name: 'Double salto forward piked or straight with 3/2 turn',
    aliases: ['Zapata 2'],
  }),

  // EG III — Acrobatic elements backward
  floorElement({
    number: 29,
    group: 3,
    difficulty: 'E',
    name: 'Double salto backward straddled with full turn',
    aliases: ['Lou Yun'],
    page: 36,
  }),
  floorElement({
    number: 31,
    group: 3,
    difficulty: 'A',
    name: 'Jump backward with half turn to forward roll',
    page: 36,
  }),
  floorElement({
    number: 35,
    group: 3,
    difficulty: 'E',
    name: 'Salto backward straight with full turn and salto backward piked',
    page: 36,
  }),
  floorElement({
    number: 36,
    group: 3,
    difficulty: 'F',
    name: 'Salto backward straight with double turn and salto backward piked',
    aliases: ['Kolyvanov'],
    page: 36,
  }),
  floorElement({
    number: 41,
    group: 3,
    difficulty: 'E',
    name: 'Double salto backward straight, also with half turn, or Arabian double forward straight',
    page: 36,
  }),
  floorElement({
    number: 42,
    group: 3,
    difficulty: 'G',
    name: 'Double salto backward straight with 3/2 turn or Arabian double forward straight with full turn',
    aliases: ['Hypolito'],
    page: 36,
  }),
  floorElement({
    number: 48,
    group: 3,
    difficulty: 'G',
    name: 'Double salto backward straight with full turn or Arabian double forward straight with half turn',
    aliases: ['Penev'],
    page: 36,
  }),
  floorElement({
    number: 54,
    group: 3,
    difficulty: 'G',
    name: 'Double salto backward straight with double turn',
    page: 37,
  }),
  floorElement({
    number: 60,
    group: 3,
    difficulty: 'H',
    name: 'Double salto backward tucked with 7/2 turn',
    aliases: ['Minami'],
    page: 37,
  }),
  floorElement({
    number: 66,
    group: 3,
    difficulty: 'I',
    name: 'Double salto backward straight with triple turn',
    aliases: ['Shirai 3'],
    page: 37,
  }),
  floorElement({
    number: 72,
    group: 3,
    difficulty: 'J',
    name: 'Double salto backward straight with 7/2 turn',
    aliases: ['Jarman'],
    page: 37,
  }),

  // EG IV — Single salto forward/backward with one or more turns
  floorElement({
    number: 2,
    group: 4,
    difficulty: 'B',
    name: 'Salto forward tucked with full turn, also with 3/2 turn',
  }),
  floorElement({
    number: 3,
    group: 4,
    difficulty: 'C',
    name: 'Salto forward straight with full turn, also with 3/2 turn',
  }),
  floorElement({
    number: 4,
    group: 4,
    difficulty: 'D',
    name: 'Salto forward straight with double turn',
  }),
  floorElement({
    number: 5,
    group: 4,
    difficulty: 'E',
    name: 'Salto forward straight with 5/2 turn',
  }),
  floorElement({
    number: 6,
    group: 4,
    difficulty: 'F',
    name: 'Salto forward straight with triple turn',
    aliases: ['Shirai 2'],
  }),
  floorElement({
    number: 8,
    group: 4,
    difficulty: 'B',
    name: 'Salto backward straight with full turn',
  }),
  floorElement({
    number: 9,
    group: 4,
    difficulty: 'C',
    name: 'Salto backward straight with 3/2 or double turn',
  }),
  floorElement({
    number: 10,
    group: 4,
    difficulty: 'D',
    name: 'Salto backward straight with 5/2 turn',
  }),
  floorElement({
    number: 11,
    group: 4,
    difficulty: 'E',
    name: 'Salto backward straight with 7/2 turn',
    aliases: ['González'],
  }),
  floorElement({
    number: 12,
    group: 4,
    difficulty: 'G',
    name: 'Salto forward straight with 7/2 turn',
    aliases: ['Goshima'],
  }),
  floorElement({
    number: 14,
    group: 4,
    difficulty: 'B',
    name: 'Salto backward tucked with 3/2 turn',
  }),
  floorElement({
    number: 22,
    group: 4,
    difficulty: 'D',
    name: 'Salto backward straight with triple turn',
  }),
  floorElement({
    number: 24,
    group: 4,
    difficulty: 'F',
    name: 'Salto backward straight with quadruple turn',
    aliases: ['Shirai', 'Nguyen'],
  }),
];
