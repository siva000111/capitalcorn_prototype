import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppData, Fund, Startup, Pair } from './types';
import { seed } from './seed';

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

interface AppStore extends AppData {
  resetToSeed: () => void;
  updateFund: (id: string, patch: Partial<Fund>) => void;
  addFund: () => void;
  deleteFund: (id: string) => void;
  updateStartup: (id: string, patch: Partial<Startup>) => void;
  addStartup: () => void;
  deleteStartup: (id: string) => void;
  createPairs: (startupId: string, fundIds: string[]) => void;
  updateContactName: (fundId: string, contactIndex: number, name: string | null) => void;
  updatePair: (pairId: string, fields: Partial<Pair>) => void;
  deletePair: (pairId: string) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
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
      createPairs: (startupId, fundIds) =>
        set((state) => {
          const ids = nextIds('pair', state.pairs, fundIds.length);
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
          return { pairs: [...state.pairs, ...newPairs] };
        }),
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
    }),
    {
      name: 'capitalcorn_state_v1',
      partialize: (state) => ({
        funds: state.funds,
        startups: state.startups,
        pairs: state.pairs,
      }),
    }
  )
);
