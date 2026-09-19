import {
  CODE_APPENDIX_PDF_URL,
  MAG_CODE_PDF_URL,
  MAG_NEWSLETTERS_URL,
  WORLD_GYMNASTICS_RULES_URL,
} from '../../config/code';

export const MAG_SOURCE_MANIFEST = {
  discipline: 'Men\'s Artistic Gymnastics',
  codeCycle: '2025–2028',
  referenceCheckedAt: '2026-09-19',
  documents: [
    {
      id: 'mag-cop-2025-2028',
      kind: 'code' as const,
      title: 'MAG Code of Points 2025–2028',
      url: MAG_CODE_PDF_URL,
      rulesPageUrl: WORLD_GYMNASTICS_RULES_URL,
    },
    {
      id: 'cop-appendix-v3-2026-05',
      kind: 'appendix' as const,
      title: 'Appendix to the Code of Points 2025–2028 — Version 3.0',
      url: CODE_APPENDIX_PDF_URL,
      rulesPageUrl: WORLD_GYMNASTICS_RULES_URL,
    },
    {
      id: 'mag-newsletters',
      kind: 'newsletter-index' as const,
      title: 'MAG Technical Committee Newsletters',
      url: MAG_NEWSLETTERS_URL,
      latestKnownEdition: 'Letter Nr 4 — July 2026',
    },
  ],
} as const;

export const MAG_DATASET_STATUS = {
  id: 'routnr-mag-2025-2028',
  cycle: MAG_SOURCE_MANIFEST.codeCycle,
  status: 'migration' as const,
  verifiedApparatus: [] as string[],
  note:
    'ROUTNR is migrating from bundled provisional sample data to source-verified MAG Code data apparatus by apparatus.',
} as const;
