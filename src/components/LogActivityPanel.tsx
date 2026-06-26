import { useMemo, useState } from 'react';
import { useAppStore } from '../store';
import TaskUpdateForm from './TaskUpdateForm';
import EmptyState from './EmptyState';
import type { Fund, Pair } from '../types';

interface LogActivityPanelProps {
  onClose: () => void;
}

export default function LogActivityPanel({ onClose }: LogActivityPanelProps) {
  const startups = useAppStore((s) => s.startups);
  const funds = useAppStore((s) => s.funds);
  const pairs = useAppStore((s) => s.pairs);

  const [startupQuery, setStartupQuery] = useState('');
  const [startupId, setStartupId] = useState<string | null>(null);
  const [fundId, setFundId] = useState<string | null>(null);

  const filteredStartups = useMemo(() => {
    const term = startupQuery.trim().toLowerCase();
    if (!term) return startups;
    return startups.filter((s) => s.name.toLowerCase().includes(term));
  }, [startups, startupQuery]);

  const startup = startups.find((s) => s.id === startupId) ?? null;

  const availablePairs = useMemo(() => {
    if (!startup) return [];
    return pairs
      .filter((p) => p.startupId === startup.id)
      .map((p) => ({ pair: p, fund: funds.find((f) => f.id === p.fundId) }))
      .filter((r): r is { pair: Pair; fund: Fund } => !!r.fund);
  }, [pairs, funds, startup]);

  const selected = availablePairs.find((r) => r.fund.id === fundId) ?? null;

  function selectStartup(id: string) {
    setStartupId(id);
    setFundId(null);
  }

  return (
    <div
      className="search-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="settings-panel">
        <div className="settings-header">
          <h2 className="step-title">Log activity</h2>
          <button type="button" className="btn btn-sm" onClick={onClose}>
            Close
          </button>
        </div>

        {!startup ? (
          <>
            <div className="field">
              <label htmlFor="log-activity-startup-search">Startup</label>
              <input
                id="log-activity-startup-search"
                className="input"
                placeholder="Search startups…"
                value={startupQuery}
                onChange={(e) => setStartupQuery(e.target.value)}
                autoFocus
              />
            </div>
            <div className="startup-picker log-activity-list">
              {filteredStartups.map((s) => (
                <button key={s.id} type="button" className="startup-pick-row" onClick={() => selectStartup(s.id)}>
                  <span className="startup-pick-name">{s.name}</span>
                  <span className="startup-pick-meta">
                    {s.sector} · {s.stage}
                  </span>
                </button>
              ))}
              {filteredStartups.length === 0 && <p className="muted">No startups match your search.</p>}
            </div>
          </>
        ) : !selected ? (
          <>
            <div className="log-activity-context">
              <span>
                Startup: <strong>{startup.name}</strong>
              </span>
              <button type="button" className="btn btn-sm" onClick={() => setStartupId(null)}>
                Change
              </button>
            </div>
            {availablePairs.length === 0 ? (
              <EmptyState message="This startup has no matched investors yet. Use the Match tab first." />
            ) : (
              <div className="startup-picker log-activity-list">
                {availablePairs.map(({ fund }) => (
                  <button key={fund.id} type="button" className="startup-pick-row" onClick={() => setFundId(fund.id)}>
                    <span className="startup-pick-name">{fund.fundName}</span>
                    <span className="startup-pick-meta">{fund.city}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="log-activity-context">
              <span>
                Startup: <strong>{startup.name}</strong> · Investor: <strong>{selected.fund.fundName}</strong>
              </span>
              <button type="button" className="btn btn-sm" onClick={() => setFundId(null)}>
                Change investor
              </button>
            </div>
            <TaskUpdateForm
              startup={startup}
              fund={selected.fund}
              pair={selected.pair}
              onSaved={onClose}
              onClose={onClose}
              closeLabel="✕ Cancel"
            />
          </>
        )}
      </div>
    </div>
  );
}
