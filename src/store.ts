import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppData, Fund, Startup, Pair, StatusDef, StatusColor, CommEvent, CommEventType, MailAccount } from './types';
import { seed } from './seed';

const COLOR_CYCLE: StatusColor[] = ['slate', 'blue', 'indigo', 'violet', 'amber', 'emerald', 'rose'];

function nextIds(prefix: string, items: { id: string }[], count: number): string[] {
  const pattern = new RegExp(`^${prefix}-(\\d+)$`);
  const nums = items
    .map((item) => item.id.match(pattern))
    .filter((m): m is RegExpMatchArray => m !== null)
    .map((m) => parseInt(m[1], 10));
  let next = (nums.length ? Math.max(...nums) : 0) + 1;
  return Array.from({ length: count }, () => `${prefix}-${String(next++).padStart(2, '0')}`);
}

function nextId(prefix: string, items: { id: string }[]): string {
  return nextIds(prefix, items, 1)[0];
}

function blankFund(existing: Fund[]): Fund {
  return {
    id: nextId('fund', existing),
    fundName: 'New Fund',
    city: '',
    focusAreas: [],
    minTicket: null,
    maxTicket: null,
    stages: [],
    locations: [],
    priority: null,
    investorType: null,
    contacts: [],
  };
}

function blankStartup(existing: Startup[]): Startup {
  return {
    id: nextId('startup', existing),
    name: 'New Startup',
    sector: 'Sector Agnostic',
    stage: 'Seed',
    raise: 0,
    location: 'India',
  };
}

function blankStatus(existing: StatusDef[], label?: string): StatusDef {
  const nextOrder = (existing.length ? Math.max(...existing.map((s) => s.order)) : 0) + 1;
  return {
    id: nextId('status', existing),
    label: label?.trim() || 'New status',
    order: nextOrder,
    closed: false,
    color: COLOR_CYCLE[existing.length % COLOR_CYCLE.length],
  };
}

interface AppStore extends AppData {
  resetToSeed: () => void;
  updateFund: (id: string, patch: Partial<Fund>) => void;
  addFund: () => void;
  deleteFund: (id: string) => void;
  updateStartup: (id: string, patch: Partial<Startup>) => void;
  addStartup: () => void;
  deleteStartup: (id: string) => void;
  createPairs: (startupId: string, fundIds: string[]) => Pair[];
  updateContactName: (fundId: string, contactIndex: number, name: string | null) => void;
  updatePair: (pairId: string, fields: Partial<Pair>) => void;
  deletePair: (pairId: string) => void;
  updateStatus: (id: string, patch: Partial<StatusDef>) => void;
  addStatus: (label?: string) => StatusDef;
  deleteStatus: (id: string) => void;
  reorderStatuses: (orderedIds: string[]) => void;
  countPairsUsingStatus: (statusId: string) => number;
  addCommEvent: (pairId: string, type: CommEventType, date: string, subject?: string, body?: string, account?: string) => void;
  addMailAccount: (address: string) => MailAccount;
  getEventsForPair: (pairId: string) => CommEvent[];
  countReplies: (pairId: string, sinceDate?: string) => number;
  countMeetingsScheduled: (pairId: string, sinceDate?: string) => number;
  countMeetingsCompleted: (pairId: string, sinceDate?: string) => number;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...seed,
      resetToSeed: () => set({ ...seed }),
      updateFund: (id, patch) =>
        set((state) => ({
          funds: state.funds.map((f) => (f.id === id ? { ...f, ...patch } : f)),
        })),
      addFund: () =>
        set((state) => ({ funds: [...state.funds, blankFund(state.funds)] })),
      deleteFund: (id) =>
        set((state) => ({ funds: state.funds.filter((f) => f.id !== id) })),
      updateStartup: (id, patch) =>
        set((state) => ({
          startups: state.startups.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        })),
      addStartup: () =>
        set((state) => ({ startups: [...state.startups, blankStartup(state.startups)] })),
      deleteStartup: (id) =>
        set((state) => ({ startups: state.startups.filter((s) => s.id !== id) })),
      createPairs: (startupId, fundIds) => {
        const ids = nextIds('pair', get().pairs, fundIds.length);
        const matchedAt = new Date().toISOString();
        const newPairs: Pair[] = fundIds.map((fundId, i) => ({
          id: ids[i],
          startupId,
          fundId,
          status: null,
          description: '',
          mailLink: '',
          followUpDate: null,
          matchedAt,
        }));
        set((state) => ({ pairs: [...state.pairs, ...newPairs] }));
        return newPairs;
      },
      updateContactName: (fundId, contactIndex, name) =>
        set((state) => ({
          funds: state.funds.map((f) =>
            f.id === fundId
              ? { ...f, contacts: f.contacts.map((c, i) => (i === contactIndex ? { ...c, name } : c)) }
              : f
          ),
        })),
      updatePair: (pairId, fields) =>
        set((state) => ({
          pairs: state.pairs.map((p) => (p.id === pairId ? { ...p, ...fields } : p)),
        })),
      deletePair: (pairId) =>
        set((state) => ({ pairs: state.pairs.filter((p) => p.id !== pairId) })),
      updateStatus: (id, patch) =>
        set((state) => ({
          statuses: state.statuses.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        })),
      addStatus: (label) => {
        const status = blankStatus(get().statuses, label);
        set((state) => ({ statuses: [...state.statuses, status] }));
        return status;
      },
      deleteStatus: (id) =>
        set((state) => {
          const inUse = state.pairs.some((p) => p.status === id);
          if (inUse) return {};
          return { statuses: state.statuses.filter((s) => s.id !== id) };
        }),
      reorderStatuses: (orderedIds) =>
        set((state) => ({
          statuses: orderedIds.map((id, i) => {
            const existing = state.statuses.find((s) => s.id === id)!;
            return { ...existing, order: i + 1 };
          }),
        })),
      countPairsUsingStatus: (statusId) => get().pairs.filter((p) => p.status === statusId).length,
      addCommEvent: (pairId, type, date, subject, body, account) =>
        set((state) => ({
          events: [...state.events, { id: nextId('event', state.events), pairId, type, date, subject, body, account }],
        })),
      addMailAccount: (address) => {
        const account: MailAccount = {
          id: nextId('mail', get().mailAccounts),
          address: address.trim(),
          label: address.trim().split('@')[0],
        };
        set((state) => ({ mailAccounts: [...state.mailAccounts, account] }));
        return account;
      },
      getEventsForPair: (pairId) => get().events.filter((e) => e.pairId === pairId),
      countReplies: (pairId, sinceDate) =>
        get().events.filter(
          (e) => e.pairId === pairId && e.type === 'reply_received' && (!sinceDate || e.date >= sinceDate)
        ).length,
      countMeetingsScheduled: (pairId, sinceDate) =>
        get().events.filter(
          (e) => e.pairId === pairId && e.type === 'meeting_scheduled' && (!sinceDate || e.date >= sinceDate)
        ).length,
      countMeetingsCompleted: (pairId, sinceDate) =>
        get().events.filter(
          (e) => e.pairId === pairId && e.type === 'meeting_completed' && (!sinceDate || e.date >= sinceDate)
        ).length,
    }),
    {
      name: 'capitalcorn_state_v1',
      partialize: (state) => ({
        funds: state.funds,
        startups: state.startups,
        pairs: state.pairs,
        statuses: state.statuses,
        events: state.events,
        mailAccounts: state.mailAccounts,
      }),
    }
  )
);
