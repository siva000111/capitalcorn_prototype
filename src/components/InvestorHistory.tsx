import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../store';
import { NOT_YET_CONTACTED } from '../constants';
import StatusPill from './StatusPill';
import InlineEditSelect from './InlineEditSelect';
import InlineEditText from './InlineEditText';
import ConfirmButton from './ConfirmButton';
import EmptyState from './EmptyState';
import { showToast } from '../toast';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

interface InvestorHistoryProps {
  jumpFundId?: string | null;
  onJumpHandled?: () => void;
}

export default function InvestorHistory({ jumpFundId, onJumpHandled }: InvestorHistoryProps) {
  const funds = useAppStore((s) => s.funds);
  const startups = useAppStore((s) => s.startups);
  const pairs = useAppStore((s) => s.pairs);
  const statuses = useAppStore((s) => s.statuses);
  const updatePair = useAppStore((s) => s.updatePair);
  const deletePair = useAppStore((s) => s.deletePair);

  const statusOptions = useMemo(() => {
    const sorted = [...statuses].sort((a, b) => a.order - b.order);
    return [{ value: '', label: `— ${NOT_YET_CONTACTED} —` }, ...sorted.map((s) => ({ value: s.id, label: s.label }))];
  }, [statuses]);

  const [search, setSearch] = useState('');
  const [selectedFundId, setSelectedFundId] = useState<string | null>(null);

  useEffect(() => {
    if (jumpFundId) {
      setSelectedFundId(jumpFundId);
      onJumpHandled?.();
    }
  }, [jumpFundId, onJumpHandled]);

  const filteredFunds = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return funds;
    return funds.filter((f) => f.fundName.toLowerCase().includes(term));
  }, [funds, search]);

  const selectedFund = funds.find((f) => f.id === selectedFundId) ?? null;

  const timeline = useMemo(() => {
    if (!selectedFund) return [];
    return pairs
      .filter((p) => p.fundId === selectedFund.id)
      .map((pair) => ({ pair, startup: startups.find((s) => s.id === pair.startupId) ?? null }))
      .filter((entry): entry is { pair: (typeof pairs)[number]; startup: NonNullable<(typeof entry)['startup']> } =>
        entry.startup !== null
      )
      .sort((a, b) => new Date(b.pair.matchedAt).getTime() - new Date(a.pair.matchedAt).getTime());
  }, [selectedFund, pairs, startups]);

  function handleUnmatch(pairId: string) {
    deletePair(pairId);
    showToast('Match removed');
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Investor history</h1>
          <p className="page-subtitle">Every match for a fund, across all startups.</p>
        </div>
      </div>

      <div className="history-layout">
        <div className="history-sidebar">
          <input
            className="input"
            placeholder="Search funds…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="startup-picker">
            {filteredFunds.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`startup-pick-row${f.id === selectedFundId ? ' active' : ''}`}
                onClick={() => setSelectedFundId(f.id)}
              >
                <span className="startup-pick-name">{f.fundName}</span>
                <span className="startup-pick-meta">{f.city}</span>
              </button>
            ))}
            {filteredFunds.length === 0 && <p className="muted">No funds match your search.</p>}
          </div>
        </div>

        <div className="history-main">
          {!selectedFund ? (
            <EmptyState message="Select a fund to see its history." />
          ) : (
            <>
              <div className="history-header">
                <h2 className="history-fund-name">{selectedFund.fundName}</h2>
                <p className="history-fund-meta">{selectedFund.city}</p>
                <div className="chip-row">
                  {selectedFund.focusAreas.map((tag) => (
                    <span className="chip" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {timeline.length === 0 ? (
                <EmptyState message="No startups matched with this fund yet." />
              ) : (
                timeline.map(({ pair, startup }) => (
                  <div className="timeline-entry card-actions-host" key={pair.id}>
                    <div className="timeline-entry-header">
                      <span className="timeline-startup-name">{startup.name}</span>
                      <span className="timeline-date">Matched {formatDate(pair.matchedAt)}</span>
                      <span className="row-actions">
                        <ConfirmButton
                          label="Unmatch"
                          prompt="Remove this match? This cannot be undone."
                          confirmLabel="Remove"
                          onConfirm={() => handleUnmatch(pair.id)}
                        />
                      </span>
                    </div>
                    <div className="timeline-fields">
                      <div className="field">
                        <label>Status</label>
                        <InlineEditSelect
                          value={pair.status ?? ''}
                          options={statusOptions}
                          renderDisplay={(v) => <StatusPill statusId={v || null} />}
                          onSave={(v) => updatePair(pair.id, { status: v === '' ? null : v })}
                          ariaLabel="status"
                        />
                      </div>
                      <div className="field">
                        <label>Follow-up date</label>
                        <InlineEditText
                          type="date"
                          value={pair.followUpDate ?? ''}
                          onSave={(v) => updatePair(pair.id, { followUpDate: v === '' ? null : v })}
                          ariaLabel="follow-up date"
                          min={todayIso()}
                          hint="Only today or future dates allowed"
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
