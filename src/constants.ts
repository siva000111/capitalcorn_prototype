import type { SectorTag, Stage, LocationTag, PairStatus } from './types';

export const SECTOR_TAGS: SectorTag[] = [
  'Fintech',
  'SaaS & Enterprise',
  'AI & Deep Tech',
  'Consumer & D2C',
  'Apparel & Lifestyle',
  'Food & FMCG',
  'Health & Life Sciences',
  'Climate & Energy',
  'Mobility & Logistics',
  'Media/Gaming/Creator',
  'Web3 & Crypto',
  'Real Estate & Construction',
  'EdTech & HR/Skilling',
  'Travel & Hospitality',
  'Sector Agnostic',
];

export const STAGES: Stage[] = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+'];

export const LOCATION_TAGS: LocationTag[] = ['India', 'US', 'Europe', 'SEA', 'Global'];

export const PRIORITIES = ['High', 'Medium', 'Low'] as const;

export const INVESTOR_TYPES = ['Angel', 'VC', 'Corporate', 'Family Office'] as const;

export const PAIR_STATUSES: PairStatus[] = [
  'Reached out – evaluating',
  'Interested to meet',
  'Meeting done',
  'Pass',
  'Pass after meeting done',
  'Pass after 2nd meeting',
  'Not a pass – re-evaluate later',
];

export const NOT_YET_CONTACTED = 'Not yet contacted';

export const SECTIONS = [
  'Home',
  'Investor library',
  'Startup library',
  'Matchmaking & outreach',
  'Investor history',
  'Reports',
] as const;

export type Section = (typeof SECTIONS)[number];
