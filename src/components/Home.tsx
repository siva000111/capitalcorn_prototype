import { useMemo } from 'react';
import { useAppStore } from '../store';
import { isActivePairStatus } from '../constants';
import StatusPill from './StatusPill';
import EmptyState from './EmptyState';
import type { Pair } from '../types';

interface HomeProps {
  onSelectFund: (fundId: string) => void;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

interface AttentionRow {
  pair: Pair;
  startupName: string;
  fundId: string;
  fundName: string;
}

export default function Home({ onSelectFund }: HomeProps) {
  const startups = useAppStore((s) => s.startups);
  const funds = useAppStore((s) => s.funds);
  const pairs = useAppStore((s) => s.pairs);

  const today = todayIso();

  const needsAttention = useMemo(() => {
    const rows: AttentionRow[] = [];
    for (const pair of pairs) {
      if (pair.followUpDate === null || pair.followUpDate > today) continue;
      const startup = startups.find((s) => s.id === pair.startupId);
      const fund = funds.find((f) => f.id === pair.fundId);
      if (!startup || !fund) continue;
      rows.push({ pair, startupName: startup.name, fundId: fund.id, fundName: fund.fundName });
    }
    return rows.sort((a, b) => (a.pair.followUpDate! < b.pair.followUpDate! ? -1 : 1));
  }, [pairs, startups, funds, today]);

  const stats = useMemo(() => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const activePairs = pairs.filter((p) => isActivePairStatus(p.status)).length;
    const recentlyMatched = pairs.filter((p) => new Date(p.matchedAt).getTime() >= sevenDaysAgo).length;
    return { startups: startups.length, funds: funds.length, activePairs, recentlyMatched };
  }, [pairs, startups, funds]);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Home</h1>
          <p className="page-subtitle">What needs your attention today.</p>
        </div>
      </div>

      <section className="home-section">
        <h2 className="step-title">Needs attention</h2>
        {needsAttention.length === 0 ? (
          <EmptyState message="Nothing needs attention right now." />
        ) : (
          <div className="table-wrap home-needs-attention">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Startup</th>
                  <th>Fund</th>
                  <th>Status</th>
                  <th>Follow-up date</th>
                </tr>
              </thead>
              <tbody>
                {needsAttention.map(({ pair, startupName, fundId, fundName }) => {
                  const overdue = pair.followUpDate! < today;
                  return (
                    <tr
                      key={pair.id}
                      tabIndex={0}
                      role="button"
                      onClick={() => onSelectFund(fundId)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelectFund(fundId);
                        }
                      }}
                    >
                      <td>{startupName}</td>
                      <td>{fundName}</td>
                      <td>
                        <StatusPill status={pair.status} />
                      </td>
                      <td className={overdue ? 'home-overdue-tag' : undefined}>
                        {formatDate(pair.followUpDate!)}
                        {overdue ? ' · overdue' : ''}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div className="home-stat-row">
        <span>
          <strong>{stats.startups}</strong>startups
        </span>
        <span>
          <strong>{stats.funds}</strong>funds
        </span>
        <span>
          <strong>{stats.activePairs}</strong>active pairs
        </span>
        <span>
          <strong>{stats.recentlyMatched}</strong>matched in the last 7 days
        </span>
      </div>
    </>
  );
}
