export type SectorTag =
  | 'Fintech' | 'SaaS & Enterprise' | 'AI & Deep Tech' | 'Consumer & D2C'
  | 'Apparel & Lifestyle' | 'Food & FMCG' | 'Health & Life Sciences'
  | 'Climate & Energy' | 'Mobility & Logistics' | 'Media/Gaming/Creator'
  | 'Web3 & Crypto' | 'Real Estate & Construction' | 'EdTech & HR/Skilling'
  | 'Travel & Hospitality' | 'Sector Agnostic';

export type Stage = 'Pre-seed' | 'Seed' | 'Series A' | 'Series B' | 'Series C+';

export type LocationTag = 'India' | 'US' | 'Europe' | 'SEA' | 'Global';

export type PairStatus =
  | 'Reached out – evaluating' | 'Interested to meet' | 'Meeting done'
  | 'Pass' | 'Pass after meeting done' | 'Pass after 2nd meeting'
  | 'Not a pass – re-evaluate later';

// position 0 => "Email 1 / Name 1", position 1 => "Email 2 / Name 2", etc. (up to 10)
export interface Contact { email: string | null; name: string | null; }

export interface Fund {
  id: string;
  fundName: string;
  city: string;
  focusAreas: SectorTag[];        // may include 'Sector Agnostic'
  minTicket: number | null;       // $M USD
  maxTicket: number | null;       // $M USD
  stages: Stage[];                // empty array = unknown (will be excluded from matching later)
  locations: LocationTag[];       // empty array = unknown (will be excluded from matching later)
  priority: 'High' | 'Medium' | 'Low' | null;
  investorType: 'Angel' | 'VC' | 'Corporate' | 'Family Office' | null;
  contacts: Contact[];            // up to 10 entries
}

export interface Startup {
  id: string;
  name: string;
  sector: SectorTag;
  stage: Stage;
  raise: number;                  // $M USD
  location: LocationTag;
}

export interface Pair {
  id: string;
  startupId: string;
  fundId: string;
  status: PairStatus | null;      // null until the team sets it
  description: string;            // "Description of the task" / note
  mailLink: string;               // "Mail Link"
  followUpDate: string | null;    // ISO date string
  matchedAt: string;              // ISO datetime when the pair was created
}

export interface AppData { funds: Fund[]; startups: Startup[]; pairs: Pair[]; }
