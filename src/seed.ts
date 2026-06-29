import type { AppData, Contact, Fund, Startup, Pair, StatusDef, CommEvent, CommEventType, MailAccount } from './types';

const c = (name: string, email: string): Contact => ({ name, email });

const funds: Fund[] = [
  {
    id: 'fund-01',
    fundName: 'Northstar Capital',
    city: 'Mumbai',
    focusAreas: ['Fintech', 'SaaS & Enterprise'],
    minTicket: 1,
    maxTicket: 5,
    stages: ['Seed', 'Series A'],
    locations: ['India'],
    priority: 'High',
    investorType: 'VC',
    contacts: [
      c('Aditya Rao', 'aditya.rao@northstarcap.com'),
      c('Meera Iyer', 'meera.iyer@northstarcap.com'),
      c('Karan Mehta', 'karan.mehta@northstarcap.com'),
      c('Sanya Kapoor', 'sanya.kapoor@northstarcap.com'),
      c('Rohan Verma', 'rohan.verma@northstarcap.com'),
      c('Divya Nair', 'divya.nair@northstarcap.com'),
      c('Arjun Malhotra', 'arjun.malhotra@northstarcap.com'),
      c('Priya Desai', 'priya.desai@northstarcap.com'),
      c('Vikram Shah', 'vikram.shah@northstarcap.com'),
      c('Neha Joshi', 'neha.joshi@northstarcap.com'),
    ],
  },
  {
    id: 'fund-02',
    fundName: 'Helix Ventures',
    city: 'San Francisco',
    focusAreas: ['AI & Deep Tech', 'SaaS & Enterprise'],
    minTicket: 10,
    maxTicket: null,
    stages: ['Series A', 'Series B'],
    locations: ['US', 'Global'],
    priority: 'High',
    investorType: 'VC',
    contacts: [
      c('Daniel Cho', 'daniel.cho@helixvc.com'),
      c('Sarah Lin', 'sarah.lin@helixvc.com'),
      c('Marcus Webb', 'marcus.webb@helixvc.com'),
      c('Olivia Brandt', 'olivia.brandt@helixvc.com'),
      c('Ethan Brooks', 'ethan.brooks@helixvc.com'),
      c('Grace Kim', 'grace.kim@helixvc.com'),
      c('Liam Foster', 'liam.foster@helixvc.com'),
      c('Ava Sullivan', 'ava.sullivan@helixvc.com'),
      c('Noah Bennett', 'noah.bennett@helixvc.com'),
    ],
  },
  {
    id: 'fund-03',
    fundName: 'Bloom & Co Angels',
    city: 'Bangalore',
    focusAreas: ['Apparel & Lifestyle', 'Consumer & D2C'],
    minTicket: null,
    maxTicket: 1,
    stages: ['Pre-seed', 'Seed'],
    locations: ['India'],
    priority: 'Medium',
    investorType: 'Angel',
    contacts: [
      c('Ritu Bhatia', 'ritu.bhatia@bloomangels.in'),
      c('Sameer Khanna', 'sameer.khanna@bloomangels.in'),
    ],
  },
  {
    id: 'fund-04',
    fundName: 'Terra Climate Partners',
    city: 'Berlin',
    focusAreas: ['Climate & Energy', 'Mobility & Logistics'],
    minTicket: 5,
    maxTicket: 15,
    stages: ['Series B', 'Series C+'],
    locations: ['Europe'],
    priority: 'High',
    investorType: 'VC',
    contacts: [
      c('Lukas Becker', 'lukas.becker@terraclimate.de'),
      c('Anna Schmidt', 'anna.schmidt@terraclimate.de'),
      c('Felix Wagner', 'felix.wagner@terraclimate.de'),
      c('Clara Hoffmann', 'clara.hoffmann@terraclimate.de'),
      c('Jonas Richter', 'jonas.richter@terraclimate.de'),
      c('Mia Krueger', 'mia.krueger@terraclimate.de'),
      c('Paul Zimmer', 'paul.zimmer@terraclimate.de'),
      c('Lena Vogel', 'lena.vogel@terraclimate.de'),
    ],
  },
  {
    id: 'fund-05',
    fundName: 'Skilling Frontier Fund',
    city: 'Singapore',
    focusAreas: ['EdTech & HR/Skilling', 'Media/Gaming/Creator'],
    minTicket: null,
    maxTicket: 2,
    stages: ['Seed', 'Series A'],
    locations: ['SEA'],
    priority: 'Medium',
    investorType: 'VC',
    contacts: [c('Wei Tan', 'wei.tan@skillingfrontier.sg')],
  },
  {
    id: 'fund-06',
    fundName: 'Omni Sector Holdings',
    city: 'London',
    focusAreas: ['Sector Agnostic'],
    minTicket: null,
    maxTicket: null,
    stages: [],
    locations: ['Global'],
    priority: 'Low',
    investorType: 'Family Office',
    contacts: [
      c('Charles Whitfield', 'charles.whitfield@omnisector.co.uk'),
      c('Eleanor Pryce', 'eleanor.pryce@omnisector.co.uk'),
      c('James Holloway', 'james.holloway@omnisector.co.uk'),
      c('Sophie Carrington', 'sophie.carrington@omnisector.co.uk'),
    ],
  },
  {
    id: 'fund-07',
    fundName: 'Crosswind Capital',
    city: 'Delhi',
    focusAreas: ['Fintech', 'Web3 & Crypto'],
    minTicket: 0.5,
    maxTicket: 3,
    stages: ['Pre-seed', 'Seed'],
    locations: ['India', 'Global'],
    priority: 'Medium',
    investorType: 'VC',
    contacts: [
      c('Rajesh Kumar', 'rajesh.kumar@crosswindcap.in'),
      c('Anjali Singh', 'anjali.singh@crosswindcap.in'),
      c('Vivek Chawla', 'vivek.chawla@crosswindcap.in'),
      c('Pooja Reddy', 'pooja.reddy@crosswindcap.in'),
      c('Nikhil Bansal', 'nikhil.bansal@crosswindcap.in'),
      c('Tara Sethi', 'tara.sethi@crosswindcap.in'), // index 5 ("Email 6") present, no higher indices
    ],
  },
  {
    id: 'fund-08',
    fundName: 'Pinnacle Family Office',
    city: 'Mumbai',
    focusAreas: ['Sector Agnostic', 'Health & Life Sciences'],
    minTicket: 2,
    maxTicket: null,
    stages: ['Series A', 'Series B', 'Series C+'],
    locations: ['US', 'India', 'Global'],
    priority: 'Low',
    investorType: 'Family Office',
    contacts: [
      c('Ananya Bose', 'ananya.bose@pinnaclefo.com'),
      c('Rahul Kapoor', 'rahul.kapoor@pinnaclefo.com'),
      { name: 'Priya Shah', email: null }, // known contact, email not yet captured
      c('Siddharth Rao', 'siddharth.rao@pinnaclefo.com'),
    ],
  },
  {
    id: 'fund-09',
    fundName: 'Lighthouse SaaS Fund',
    city: 'Pune',
    focusAreas: ['SaaS & Enterprise', 'AI & Deep Tech'],
    minTicket: 3,
    maxTicket: 12,
    stages: ['Seed', 'Series A'],
    locations: ['India', 'US'],
    priority: 'High',
    investorType: 'VC',
    contacts: [
      c('Amit Trivedi', 'amit.trivedi@lighthousesaas.com'),
      c('Kavya Menon', 'kavya.menon@lighthousesaas.com'),
      c('Rishi Pillai', 'rishi.pillai@lighthousesaas.com'),
      c('Shreya Gupta', 'shreya.gupta@lighthousesaas.com'),
      c('Aakash Jain', 'aakash.jain@lighthousesaas.com'),
      c('Ishita Mathur', 'ishita.mathur@lighthousesaas.com'),
      c('Varun Saxena', 'varun.saxena@lighthousesaas.com'),
      c('Nidhi Agarwal', 'nidhi.agarwal@lighthousesaas.com'),
    ],
  },
  {
    id: 'fund-10',
    fundName: 'Riverside Real Assets',
    city: 'Dubai',
    focusAreas: ['Real Estate & Construction', 'Travel & Hospitality'],
    minTicket: null,
    maxTicket: 6,
    stages: ['Series B', 'Series C+'],
    locations: ['Global'],
    priority: 'Low',
    investorType: null,
    contacts: [
      c('Omar Al-Farsi', 'omar.alfarsi@riversideassets.ae'),
      c('Layla Haddad', 'layla.haddad@riversideassets.ae'),
      c('Yusuf Nasser', 'yusuf.nasser@riversideassets.ae'),
    ],
  },
  {
    id: 'fund-11',
    fundName: 'FreshTable Ventures',
    city: 'Chicago',
    focusAreas: ['Food & FMCG', 'Consumer & D2C'],
    minTicket: 1,
    maxTicket: 4,
    stages: ['Seed', 'Series A'],
    locations: ['US', 'Europe'],
    priority: 'Medium',
    investorType: 'VC',
    contacts: [
      c('Megan Hayes', 'megan.hayes@freshtablevc.com'),
      c('Tyler Brooks', 'tyler.brooks@freshtablevc.com'),
      c('Chloe Adams', 'chloe.adams@freshtablevc.com'),
      c('Brandon Reyes', 'brandon.reyes@freshtablevc.com'),
      c('Hannah Price', 'hannah.price@freshtablevc.com'),
      c('Jordan Lee', 'jordan.lee@freshtablevc.com'),
      c('Natalie Cross', 'natalie.cross@freshtablevc.com'),
      c('Cameron Diaz', 'cameron.diaz2@freshtablevc.com'),
      c('Logan Pierce', 'logan.pierce@freshtablevc.com'),
    ],
  },
  {
    id: 'fund-12',
    fundName: 'Quantum Edge Capital',
    city: 'Tel Aviv',
    focusAreas: ['AI & Deep Tech', 'Web3 & Crypto'],
    minTicket: 6,
    maxTicket: 20,
    stages: ['Series A', 'Series B'],
    locations: ['Europe', 'Global'],
    priority: 'High',
    investorType: 'VC',
    contacts: [
      c('Itai Cohen', 'itai.cohen@quantumedge.il'),
      c('Noa Levi', 'noa.levi@quantumedge.il'),
      c('Eyal Mizrahi', 'eyal.mizrahi@quantumedge.il'),
      c('Maya Ben-David', 'maya.bendavid@quantumedge.il'),
      c('Tomer Avraham', 'tomer.avraham@quantumedge.il'),
      c('Shira Goldberg', 'shira.goldberg@quantumedge.il'),
      c('Omer Peretz', 'omer.peretz@quantumedge.il'),
    ],
  },
  {
    id: 'fund-13',
    fundName: 'Coral Reef Capital',
    city: 'Jakarta',
    focusAreas: ['Mobility & Logistics', 'Sector Agnostic'],
    minTicket: null,
    maxTicket: 10,
    stages: ['Pre-seed', 'Seed', 'Series A'],
    locations: ['SEA', 'India'],
    priority: 'Medium',
    investorType: 'Angel',
    contacts: [
      c('Budi Santoso', 'budi.santoso@coralreefcap.id'),
      c('Siti Rahma', 'siti.rahma@coralreefcap.id'),
      c('Andi Wijaya', 'andi.wijaya@coralreefcap.id'),
      c('Dewi Lestari', 'dewi.lestari@coralreefcap.id'),
      c('Eko Prasetyo', 'eko.prasetyo@coralreefcap.id'),
      c('Rina Hartono', 'rina.hartono@coralreefcap.id'),
      c('Agus Setiawan', 'agus.setiawan@coralreefcap.id'),
      c('Maya Putri', 'maya.putri@coralreefcap.id'),
      c('Hendra Gunawan', 'hendra.gunawan@coralreefcap.id'),
      c('Lina Wibowo', 'lina.wibowo@coralreefcap.id'),
    ],
  },
  {
    id: 'fund-14',
    fundName: 'Vantage Holdings',
    city: 'Toronto',
    focusAreas: ['Media/Gaming/Creator', 'Consumer & D2C'],
    minTicket: null,
    maxTicket: null,
    stages: ['Series C+'],
    locations: ['US', 'Europe', 'Global'],
    priority: null,
    investorType: 'Corporate',
    contacts: [
      c('Connor Murphy', 'connor.murphy@vantageholdings.ca'),
      c('Brianna Scott', 'brianna.scott@vantageholdings.ca'),
      c('Tyler Nguyen', 'tyler.nguyen@vantageholdings.ca'),
      c('Madison Clarke', 'madison.clarke@vantageholdings.ca'),
      c('Jacob Turner', 'jacob.turner@vantageholdings.ca'),
    ],
  },
  {
    id: 'fund-15',
    fundName: 'Helios Green Capital',
    city: 'Amsterdam',
    focusAreas: ['Climate & Energy', 'Mobility & Logistics'],
    minTicket: 4,
    maxTicket: 20,
    stages: ['Series A', 'Series B'],
    locations: ['Europe', 'Global'],
    priority: 'High',
    investorType: 'VC',
    contacts: [
      c('Sven Eriksson', 'sven.eriksson@heliosgreen.eu'),
      c('Marta Novak', 'marta.novak@heliosgreen.eu'),
      c('Pieter de Vries', 'pieter.devries@heliosgreen.eu'),
      c('Isabella Romano', 'isabella.romano@heliosgreen.eu'),
      c('Henrik Sorensen', 'henrik.sorensen@heliosgreen.eu'),
    ],
  },
  {
    id: 'fund-16',
    fundName: 'Sutlej Fintech Fund',
    city: 'Gurugram',
    focusAreas: ['Fintech', 'SaaS & Enterprise'],
    minTicket: 1,
    maxTicket: 6,
    stages: ['Seed', 'Series A'],
    locations: ['India', 'Global'],
    priority: 'Medium',
    investorType: 'VC',
    contacts: [
      c('Harpreet Gill', 'harpreet.gill@sutlejfintech.in'),
      c('Ananya Roy', 'ananya.roy@sutlejfintech.in'),
      c('Manish Agarwal', 'manish.agarwal@sutlejfintech.in'),
      c('Devika Nair', 'devika.nair@sutlejfintech.in'),
    ],
  },
  {
    id: 'fund-17',
    fundName: 'Harvest Consumer Fund',
    city: 'Austin',
    focusAreas: ['Food & FMCG', 'Consumer & D2C'],
    minTicket: 1,
    maxTicket: 6,
    stages: ['Seed', 'Series A'],
    locations: ['US', 'India'],
    priority: 'Medium',
    investorType: 'VC',
    contacts: [
      c('Rebecca Stone', 'rebecca.stone@harvestcvc.com'),
      c('Daniel Ortiz', 'daniel.ortiz@harvestcvc.com'),
      c('Priya Menon', 'priya.menon@harvestcvc.com'),
      c('Kyle Bennett', 'kyle.bennett@harvestcvc.com'),
    ],
  },
  {
    id: 'fund-18',
    fundName: 'Meridian Growth Partners',
    city: 'New York',
    focusAreas: ['Sector Agnostic'],
    minTicket: null,
    maxTicket: null,
    stages: ['Seed', 'Series A', 'Series B', 'Series C+'],
    locations: ['US', 'Europe', 'Global', 'India'],
    priority: 'High',
    investorType: 'VC',
    contacts: [
      c('Eleanor Hayes', 'eleanor.hayes@meridiangrowth.com'),
      c('Marcus Bell', 'marcus.bell@meridiangrowth.com'),
      c('Sophia Lambert', 'sophia.lambert@meridiangrowth.com'),
      c('Daniel Frost', 'daniel.frost@meridiangrowth.com'),
      c('Aisha Rahman', 'aisha.rahman@meridiangrowth.com'),
    ],
  },
];

const startups: Startup[] = [
  {
    id: 'startup-01',
    name: 'TallyForge',
    sector: 'Fintech',
    stage: 'Seed',
    raise: 2.5,
    location: 'India',
  },
  {
    id: 'startup-02',
    name: 'NimbusAI',
    sector: 'AI & Deep Tech',
    stage: 'Series A',
    raise: 20,
    location: 'US',
  },
  {
    id: 'startup-03',
    name: 'KadamWear',
    sector: 'Apparel & Lifestyle',
    stage: 'Pre-seed',
    raise: 0.5,
    location: 'India',
  },
  {
    id: 'startup-04',
    name: 'GreenVolt',
    sector: 'Climate & Energy',
    stage: 'Series B',
    raise: 8,
    location: 'Europe',
  },
  {
    id: 'startup-05',
    name: 'SkillBridge',
    sector: 'EdTech & HR/Skilling',
    stage: 'Seed',
    raise: 1.2,
    location: 'SEA',
  },
  {
    id: 'startup-06',
    name: 'LedgerWise',
    sector: 'SaaS & Enterprise',
    stage: 'Seed',
    raise: 5,
    location: 'India',
  },
  {
    id: 'startup-07',
    name: 'PlatePal',
    sector: 'Food & FMCG',
    stage: 'Seed',
    raise: 2,
    location: 'US',
  },
  {
    id: 'startup-08',
    name: 'NeuraCore',
    sector: 'AI & Deep Tech',
    stage: 'Series A',
    raise: 12,
    location: 'Europe',
  },
  {
    id: 'startup-09',
    name: 'UrbanNest',
    sector: 'Real Estate & Construction',
    stage: 'Series B',
    raise: 5,
    location: 'Global',
  },
  {
    id: 'startup-10',
    name: 'StreamForge',
    sector: 'Media/Gaming/Creator',
    stage: 'Series C+',
    raise: 5,
    location: 'US',
  },
  // Intentionally fresh — no pairs/events — to keep the empty-state demonstrable.
  {
    id: 'startup-11',
    name: 'Foundry Nine',
    sector: 'Sector Agnostic',
    stage: 'Seed',
    raise: 1,
    location: 'India',
  },
];

const statuses: StatusDef[] = [
  { id: 'status-01', label: 'Reached out – currently evaluating', order: 1, closed: false, color: 'slate' },
  { id: 'status-02', label: 'Interested to meet', order: 2, closed: false, color: 'blue' },
  { id: 'status-03', label: 'Meeting done', order: 3, closed: false, color: 'indigo' },
  { id: 'status-04', label: 'Interested for 2nd call', order: 4, closed: false, color: 'violet' },
  { id: 'status-05', label: 'Due Diligence', order: 5, closed: false, color: 'amber' },
  { id: 'status-06', label: 'Investment', order: 6, closed: true, color: 'emerald' },
  { id: 'status-07', label: 'Pass', order: 7, closed: true, color: 'rose' },
  { id: 'status-08', label: 'Pass after meeting done', order: 8, closed: true, color: 'rose' },
  { id: 'status-09', label: 'Pass after 2nd meeting', order: 9, closed: true, color: 'rose' },
  { id: 'status-10', label: 'Not a pass – re-evaluate later', order: 10, closed: false, color: 'amber' },
];

// Simulated connected mail accounts (mock only — no real Gmail/OAuth anywhere).
const A1 = 'mail-01';
const A2 = 'mail-02';
const A3 = 'mail-03';

const mailAccounts: MailAccount[] = [
  { id: A1, address: 'arjun@capitalcorn.com', label: 'Arjun' },
  { id: A2, address: 'priya@capitalcorn.com', label: 'Priya' },
  { id: A3, address: 'deals@capitalcorn.com', label: 'Deals desk' },
];

// Today (for this seed) is 2026-06-29; follow-ups and event dates are spread around it.
const pair = (
  id: string,
  startupId: string,
  fundId: string,
  status: string,
  description: string,
  followUpDate: string | null,
  matchedAt: string
): Pair => ({
  id,
  startupId,
  fundId,
  status,
  description,
  mailLink: `https://mail.google.com/mail/u/0/#inbox/placeholder-${id}`,
  followUpDate,
  matchedAt,
});

const pairs: Pair[] = [
  // TallyForge (startup-01)
  pair('pair-01', 'startup-01', 'fund-01', 'status-02', 'Warm intro via a portfolio founder; they want to meet.', '2026-06-29', '2026-06-10T09:15:00.000Z'),
  pair('pair-02', 'startup-01', 'fund-07', 'status-07', 'Passed — outside their current stage focus.', null, '2026-06-12T11:30:00.000Z'),
  pair('pair-03', 'startup-01', 'fund-13', 'status-03', 'First meeting done; awaiting updated financial model.', '2026-07-02', '2026-06-14T14:00:00.000Z'),
  // NimbusAI (startup-02)
  pair('pair-04', 'startup-02', 'fund-02', 'status-05', 'In diligence; DD checklist circulating.', '2026-06-29', '2026-06-08T08:00:00.000Z'),
  pair('pair-05', 'startup-02', 'fund-18', 'status-01', 'Reached out; first reply received, needs a response.', '2026-06-26', '2026-06-20T10:00:00.000Z'),
  // KadamWear (startup-03)
  pair('pair-06', 'startup-03', 'fund-03', 'status-01', 'Reached out; angel replied with early interest.', '2026-07-01', '2026-06-22T09:00:00.000Z'),
  // GreenVolt (startup-04)
  pair('pair-07', 'startup-04', 'fund-04', 'status-04', 'Strong first meeting; they want a second call.', '2026-06-30', '2026-05-28T09:00:00.000Z'),
  pair('pair-08', 'startup-04', 'fund-15', 'status-06', 'Term sheet signed — investment closed.', null, '2026-05-20T09:00:00.000Z'),
  // SkillBridge (startup-05)
  pair('pair-09', 'startup-05', 'fund-05', 'status-02', 'Replied with interest in meeting.', '2026-06-29', '2026-06-23T09:00:00.000Z'),
  // LedgerWise (startup-06)
  pair('pair-10', 'startup-06', 'fund-09', 'status-03', 'Met the partner; positive, follow-up scheduled.', '2026-07-03', '2026-06-15T09:00:00.000Z'),
  pair('pair-11', 'startup-06', 'fund-16', 'status-10', 'Not now — revisit next quarter.', '2026-06-24', '2026-06-16T09:00:00.000Z'),
  // PlatePal (startup-07)
  pair('pair-12', 'startup-07', 'fund-11', 'status-01', 'Intro sent; awaiting first reply.', '2026-06-29', '2026-06-25T09:00:00.000Z'),
  pair('pair-13', 'startup-07', 'fund-17', 'status-08', 'Passed after the first meeting.', null, '2026-06-05T09:00:00.000Z'),
  // NeuraCore (startup-08)
  pair('pair-14', 'startup-08', 'fund-12', 'status-05', 'Deep diligence underway; DD questions just in.', '2026-07-04', '2026-06-10T09:00:00.000Z'),
  // UrbanNest (startup-09)
  pair('pair-15', 'startup-09', 'fund-10', 'status-02', 'Interested to meet; replied to intro.', '2026-07-05', '2026-06-24T09:00:00.000Z'),
  pair('pair-16', 'startup-09', 'fund-08', 'status-01', 'Reached out; awaiting first reply.', '2026-06-22', '2026-06-18T09:00:00.000Z'),
  // StreamForge (startup-10)
  pair('pair-17', 'startup-10', 'fund-14', 'status-09', 'Passed after the second meeting.', null, '2026-05-25T09:00:00.000Z'),
];

let _e = 0;
const E = (
  pairId: string,
  type: CommEventType,
  date: string,
  account: string,
  subject?: string,
  body?: string
): CommEvent => ({ id: `event-${String(++_e).padStart(2, '0')}`, pairId, type, date, subject, body, account });

const events: CommEvent[] = [
  // pair-01 — TallyForge × Northstar — reply with no later note → NEEDS ACTION
  E('pair-01', 'outreach_sent', '2026-06-10T10:00:00.000Z', A1, 'Introduction: TallyForge x Northstar Capital', 'Sent a warm intro email with the deck attached.'),
  E('pair-01', 'reply_received', '2026-06-11T09:30:00.000Z', A1, 'Re: Introduction: TallyForge x Northstar Capital', 'Thanks for reaching out — would love to learn more, can we set up a call next week?'),

  // pair-02 — TallyForge × Crosswind — passed → actioned
  E('pair-02', 'outreach_sent', '2026-06-12T12:00:00.000Z', A2, 'Introduction: TallyForge x Crosswind Capital', 'Sent intro email with the deck attached.'),
  E('pair-02', 'reply_received', '2026-06-13T08:00:00.000Z', A2, 'Re: Introduction: TallyForge x Crosswind Capital', 'Appreciate you thinking of us, but this is outside our current stage focus. Wishing you the best.'),
  E('pair-02', 'note', '2026-06-13T10:00:00.000Z', A2, 'Logged pass', 'Marked as a pass — stage mismatch.'),

  // pair-03 — TallyForge × Coral Reef — full meeting cycle → actioned
  E('pair-03', 'outreach_sent', '2026-06-14T14:30:00.000Z', A3, 'Introduction: TallyForge x Coral Reef Capital', 'Sent intro email with the deck attached.'),
  E('pair-03', 'reply_received', '2026-06-15T10:00:00.000Z', A3, 'Re: Introduction: TallyForge x Coral Reef Capital', "Interesting — let's set up time to chat."),
  E('pair-03', 'meeting_scheduled', '2026-06-16T09:00:00.000Z', A3, 'Call scheduled for Jun 18'),
  E('pair-03', 'meeting_completed', '2026-06-18T15:00:00.000Z', A3, 'First call completed', 'Good first conversation; they requested an updated financial model.'),
  E('pair-03', 'note', '2026-06-18T16:00:00.000Z', A3, 'Task updated', 'Send updated model by early July.'),

  // pair-04 — NimbusAI × Helix — diligence; fresh reply today → NEEDS ACTION
  E('pair-04', 'outreach_sent', '2026-06-08T10:00:00.000Z', A1, 'Introduction: NimbusAI x Helix Ventures', 'Sent intro with deck and traction summary.'),
  E('pair-04', 'reply_received', '2026-06-09T11:00:00.000Z', A1, 'Re: Introduction: NimbusAI x Helix Ventures', 'Impressive numbers — let us set up an intro call.'),
  E('pair-04', 'meeting_scheduled', '2026-06-12T09:00:00.000Z', A1, 'Intro call scheduled'),
  E('pair-04', 'meeting_completed', '2026-06-24T15:00:00.000Z', A1, 'Intro call completed', 'Strong call; moving into diligence.'),
  E('pair-04', 'note', '2026-06-24T16:00:00.000Z', A1, 'Task updated', 'Entered due diligence.'),
  E('pair-04', 'reply_received', '2026-06-29T09:00:00.000Z', A1, 'DD checklist', 'Sending over our diligence checklist — can you share the data room?'),
  E('pair-04', 'meeting_scheduled', '2026-07-01T09:00:00.000Z', A1, 'DD deep-dive call scheduled'),
  E('pair-04', 'meeting_completed', '2026-07-02T15:00:00.000Z', A1, 'DD deep-dive completed', 'Worked through the model line by line.'),

  // pair-05 — NimbusAI × Meridian — reply, no note → NEEDS ACTION
  E('pair-05', 'outreach_sent', '2026-06-20T10:00:00.000Z', A2, 'Introduction: NimbusAI x Meridian Growth Partners', 'Sent intro and deck.'),
  E('pair-05', 'reply_received', '2026-06-27T11:00:00.000Z', A2, 'Re: Introduction: NimbusAI x Meridian Growth Partners', 'Thanks — a few questions on your go-to-market before we meet.'),

  // pair-06 — KadamWear × Bloom — reply, no note → NEEDS ACTION
  E('pair-06', 'outreach_sent', '2026-06-22T10:00:00.000Z', A3, 'Introduction: KadamWear x Bloom & Co Angels', 'Sent intro and lookbook.'),
  E('pair-06', 'reply_received', '2026-06-25T11:00:00.000Z', A3, 'Re: Introduction: KadamWear x Bloom & Co Angels', 'Love the brand — can you share unit economics?'),

  // pair-07 — GreenVolt × Terra — re-engaged after note → NEEDS ACTION
  E('pair-07', 'outreach_sent', '2026-05-28T10:00:00.000Z', A1, 'Introduction: GreenVolt x Terra Climate Partners', 'Sent intro and deck.'),
  E('pair-07', 'reply_received', '2026-05-30T11:00:00.000Z', A1, 'Re: Introduction: GreenVolt x Terra Climate Partners', 'This fits our thesis — let us schedule a call.'),
  E('pair-07', 'meeting_scheduled', '2026-06-03T09:00:00.000Z', A1, 'First call scheduled'),
  E('pair-07', 'meeting_completed', '2026-06-09T15:00:00.000Z', A1, 'First call completed', 'Great fit on climate thesis.'),
  E('pair-07', 'note', '2026-06-09T16:00:00.000Z', A1, 'Task updated', 'Awaiting their internal discussion.'),
  E('pair-07', 'reply_received', '2026-06-26T11:00:00.000Z', A1, 'Ready for a second call', 'We discussed internally — ready to set up a second call.'),

  // pair-08 — GreenVolt × Helios — investment closed → actioned
  E('pair-08', 'outreach_sent', '2026-05-20T10:00:00.000Z', A2, 'Introduction: GreenVolt x Helios Green Capital', 'Sent intro and deck.'),
  E('pair-08', 'reply_received', '2026-05-22T11:00:00.000Z', A2, 'Re: Introduction: GreenVolt x Helios Green Capital', 'Very interested — let us move quickly.'),
  E('pair-08', 'meeting_scheduled', '2026-05-27T09:00:00.000Z', A2, 'Partner meeting scheduled'),
  E('pair-08', 'meeting_completed', '2026-06-02T15:00:00.000Z', A2, 'Partner meeting completed', 'Unanimous interest from the partnership.'),
  E('pair-08', 'note', '2026-06-02T16:00:00.000Z', A2, 'Task updated', 'Negotiating term sheet.'),
  E('pair-08', 'note', '2026-06-20T16:00:00.000Z', A2, 'Term sheet signed', 'Investment closed — lead round.'),

  // pair-09 — SkillBridge × Skilling Frontier — reply, no note → NEEDS ACTION
  E('pair-09', 'outreach_sent', '2026-06-23T10:00:00.000Z', A3, 'Introduction: SkillBridge x Skilling Frontier Fund', 'Sent intro and deck.'),
  E('pair-09', 'reply_received', '2026-06-28T11:00:00.000Z', A3, 'Re: Introduction: SkillBridge x Skilling Frontier Fund', 'Keen to meet — what does next week look like?'),
  E('pair-09', 'meeting_scheduled', '2026-06-30T09:00:00.000Z', A3, 'Intro call scheduled'),

  // pair-10 — LedgerWise × Lighthouse — meeting done → actioned
  E('pair-10', 'outreach_sent', '2026-06-15T10:00:00.000Z', A1, 'Introduction: LedgerWise x Lighthouse SaaS Fund', 'Sent intro and deck.'),
  E('pair-10', 'reply_received', '2026-06-17T11:00:00.000Z', A1, 'Re: Introduction: LedgerWise x Lighthouse SaaS Fund', 'Looks compelling — let us meet.'),
  E('pair-10', 'meeting_scheduled', '2026-06-20T09:00:00.000Z', A1, 'Call scheduled'),
  E('pair-10', 'meeting_completed', '2026-06-26T15:00:00.000Z', A1, 'Call completed', 'Positive; they want a follow-up with the wider team.'),
  E('pair-10', 'note', '2026-06-26T16:00:00.000Z', A1, 'Task updated', 'Schedule team follow-up.'),

  // pair-11 — LedgerWise × Sutlej — re-evaluate later → actioned
  E('pair-11', 'outreach_sent', '2026-06-16T10:00:00.000Z', A2, 'Introduction: LedgerWise x Sutlej Fintech Fund', 'Sent intro and deck.'),
  E('pair-11', 'reply_received', '2026-06-19T11:00:00.000Z', A2, 'Re: Introduction: LedgerWise x Sutlej Fintech Fund', 'Not the right time, but please revisit us next quarter.'),
  E('pair-11', 'note', '2026-06-19T12:00:00.000Z', A2, 'Task updated', 'Re-evaluate in Q4.'),

  // pair-12 — PlatePal × FreshTable — outreach only, awaiting reply
  E('pair-12', 'outreach_sent', '2026-06-25T10:00:00.000Z', A3, 'Introduction: PlatePal x FreshTable Ventures', 'Sent intro and deck.'),

  // pair-13 — PlatePal × Harvest — passed after meeting → actioned
  E('pair-13', 'outreach_sent', '2026-06-05T10:00:00.000Z', A1, 'Introduction: PlatePal x Harvest Consumer Fund', 'Sent intro and deck.'),
  E('pair-13', 'reply_received', '2026-06-07T11:00:00.000Z', A1, 'Re: Introduction: PlatePal x Harvest Consumer Fund', 'Happy to take a first meeting.'),
  E('pair-13', 'meeting_scheduled', '2026-06-11T09:00:00.000Z', A1, 'First meeting scheduled'),
  E('pair-13', 'meeting_completed', '2026-06-16T15:00:00.000Z', A1, 'First meeting completed', 'Good discussion but margins were a concern.'),
  E('pair-13', 'note', '2026-06-16T16:00:00.000Z', A1, 'Logged pass', 'Passed after meeting — margin concerns.'),

  // pair-14 — NeuraCore × Quantum — DD; fresh reply today → NEEDS ACTION
  E('pair-14', 'outreach_sent', '2026-06-10T10:00:00.000Z', A2, 'Introduction: NeuraCore x Quantum Edge Capital', 'Sent intro and deck.'),
  E('pair-14', 'reply_received', '2026-06-12T11:00:00.000Z', A2, 'Re: Introduction: NeuraCore x Quantum Edge Capital', 'Strong team — let us set up a technical deep-dive.'),
  E('pair-14', 'meeting_scheduled', '2026-06-17T09:00:00.000Z', A2, 'Technical deep-dive scheduled'),
  E('pair-14', 'meeting_completed', '2026-06-23T15:00:00.000Z', A2, 'Technical deep-dive completed', 'Impressed with the architecture.'),
  E('pair-14', 'note', '2026-06-23T16:00:00.000Z', A2, 'Task updated', 'Moving into diligence.'),
  E('pair-14', 'reply_received', '2026-06-29T10:00:00.000Z', A2, 'DD questions attached', 'Attaching our diligence questions — keen to keep momentum.'),

  // pair-15 — UrbanNest × Riverside — reply, no note → NEEDS ACTION
  E('pair-15', 'outreach_sent', '2026-06-24T10:00:00.000Z', A3, 'Introduction: UrbanNest x Riverside Real Assets', 'Sent intro and deck.'),
  E('pair-15', 'reply_received', '2026-06-27T11:00:00.000Z', A3, 'Re: Introduction: UrbanNest x Riverside Real Assets', 'Interesting space — happy to meet.'),

  // pair-16 — UrbanNest × Pinnacle — outreach only, awaiting reply
  E('pair-16', 'outreach_sent', '2026-06-18T10:00:00.000Z', A1, 'Introduction: UrbanNest x Pinnacle Family Office', 'Sent intro and deck.'),

  // pair-17 — StreamForge × Vantage — two meeting cycles, passed → actioned
  E('pair-17', 'outreach_sent', '2026-05-25T10:00:00.000Z', A2, 'Introduction: StreamForge x Vantage Holdings', 'Sent intro and deck.'),
  E('pair-17', 'reply_received', '2026-05-27T11:00:00.000Z', A2, 'Re: Introduction: StreamForge x Vantage Holdings', 'Let us take a first meeting.'),
  E('pair-17', 'meeting_scheduled', '2026-06-01T09:00:00.000Z', A2, 'First meeting scheduled'),
  E('pair-17', 'meeting_completed', '2026-06-06T15:00:00.000Z', A2, 'First meeting completed', 'Good first meeting; they wanted a second.'),
  E('pair-17', 'note', '2026-06-06T16:00:00.000Z', A2, 'Task updated', 'Second meeting requested.'),
  E('pair-17', 'meeting_scheduled', '2026-06-10T09:00:00.000Z', A2, 'Second meeting scheduled'),
  E('pair-17', 'meeting_completed', '2026-06-15T15:00:00.000Z', A2, 'Second meeting completed', 'Decided not to proceed.'),
  E('pair-17', 'note', '2026-06-15T16:00:00.000Z', A2, 'Logged pass', 'Passed after second meeting.'),
];

export const seed: AppData = { funds, startups, pairs, statuses, events, mailAccounts };
