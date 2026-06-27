import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../store';
import StatusPill from './StatusPill';
import EmptyState from './EmptyState';
import PairDetailPanel from './PairDetailPanel';
import EditableHeading from './EditableHeading';
import type { Startup } from '../types';

interface StartupRelationshipPanelProps {
  startup: Startup;
  jumpFundId?: string | null;
  onJumpHandled?: () => void;
  onOpenFund: (fundId: string) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function StartupRelationshipPanel({
  startup,
  jumpFundId,
  onJumpHandled,
  onOpenFund,
}: StartupRelationshipPanelProps) {
  const funds = useAppStore((s) => s.funds);
  const pairs = useAppStore((s) => s.pairs);
  const events = useAppStore((s) => s.events);
  const updateStartup = useAppStore((s) => s.updateStartup);
  const countReplies = useAppStore((s) => s.countReplies);
  const countMeetingsCompleted = useAppStore((s) => s.countMeetingsCompleted);

  const [selectedPairId, setSelectedPairId] = useState<string | null>(null);
  const [highlightFundId, setHighlightFundId] = useState<string | null>(null);

  useEffect(() => {
    if (!jumpFundId) return;
    setHighlightFundId(jumpFundId);
    onJumpHandled?.();
    const timer = setTimeout(() => setHighlightFundId(null), 2000);
    return () => clearTimeout(timer);
  }, [jumpFundId, onJumpHandled]);

  const relationships = useMemo(() => {
    return pairs
      .filter((p) => p.startupId === startup.id)
      .map((pair) => {
        const fund = funds.find((f) => f.id === pair.fundId);
        if (!fund) return null;
        const pairEvents = events.filter((e) => e.pairId === pair.id);
        const lastContact = pairEvents.reduce(
          (latest, e) => (e.date > latest ? e.date : latest),
          pair.matchedAt
        );
        return {
          pair,
          fund,
          lastContact,
          replies: countReplies(pair.id),
          meetings: countMeetingsCompleted(pair.id),
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);
  }, [pairs, funds, events, startup.id, countReplies, countMeetingsCompleted]);

  const selected = relationships.find((r) => r.pair.id === selectedPairId) ?? null;

  return (
    <section className="match-step">
      <div className="relationship-panel-header">
        <EditableHeading
          value={startup.name}
          onSave={(v) => updateStartup(startup.id, { name: v })}
          ariaLabel="startup name"
          textClassName="editable-heading-text editable-heading-text--panel"
        />
        <span className="relationship-panel-suffix">— matched investors</span>
      </div>

      {relationships.length === 0 ? (
        <EmptyState message="No matched investors yet. Use the Match tab to find candidates." />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Investor</th>
                <th>Status</th>
                <th>Last contact</th>
                <th>Next follow-up</th>
                <th className="cell-numeric">Replies</th>
                <th className="cell-numeric">Meetings</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {relationships.map((r) => (
                <tr
                  key={r.pair.id}
                  className={`relationship-row${highlightFundId === r.fund.id ? ' row-highlight' : ''}${
                    selectedPairId === r.pair.id ? ' active' : ''
                  }`}
                  onClick={() => setSelectedPairId(selectedPairId === r.pair.id ? null : r.pair.id)}
                >
                  <td>
                    <button
                      type="button"
                      className="record-name-link"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenFund(r.fund.id);
                      }}
                      aria-label={`Open ${r.fund.fundName}`}
                    >
                      {r.fund.fundName}
                    </button>
                  </td>
                  <td>
                    <StatusPill statusId={r.pair.status} />
                  </td>
                  <td>{formatDate(r.lastContact)}</td>
                  <td>{r.pair.followUpDate ? formatDate(r.pair.followUpDate) : '—'}</td>
                  <td className="cell-numeric">{r.replies}</td>
                  <td className="cell-numeric">{r.meetings}</td>
                  <td className="relationship-notes">{r.pair.description || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <PairDetailPanel
          key={selected.pair.id}
          startup={startup}
          fund={selected.fund}
          pair={selected.pair}
          onOpenFund={onOpenFund}
        />
      )}
    </section>
  );
}
