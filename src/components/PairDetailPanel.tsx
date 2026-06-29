import { useMemo, useState } from 'react';
import { useAppStore } from '../store';
import EmptyState from './EmptyState';
import TaskUpdateForm from './TaskUpdateForm';
import EmailComposeForm from './EmailComposeForm';
import type { Fund, Pair, Startup } from '../types';

interface PairDetailPanelProps {
  startup: Startup;
  fund: Fund;
  pair: Pair;
  onOpenFund: (fundId: string) => void;
}

const SNIPPET_LENGTH = 90;

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function snippet(body: string | undefined): string {
  if (!body) return '(no body)';
  return body.length > SNIPPET_LENGTH ? body.slice(0, SNIPPET_LENGTH) + '…' : body;
}

export default function PairDetailPanel({ startup, fund, pair, onOpenFund }: PairDetailPanelProps) {
  const allEvents = useAppStore((s) => s.events);

  const inboxEvents = useMemo(
    () =>
      allEvents
        .filter((e) => e.pairId === pair.id && (e.type === 'outreach_sent' || e.type === 'reply_received'))
        .sort((a, b) => (a.date < b.date ? 1 : -1)),
    [allEvents, pair.id]
  );

  // An email counts as "actioned" once a task-update note has been logged for this pair on or after it.
  const noteDates = useMemo(
    () => allEvents.filter((e) => e.pairId === pair.id && e.type === 'note').map((e) => e.date),
    [allEvents, pair.id]
  );
  function isActioned(emailDate: string): boolean {
    return noteDates.some((d) => d >= emailDate);
  }

  const [openEventId, setOpenEventId] = useState<string | null>(null);
  const [composing, setComposing] = useState(false);

  return (
    <div className="pair-detail-panel">
      <div className="pair-detail-header">
        <h3 className="pair-detail-title">
          Inbox — {startup.name} ×{' '}
          <button
            type="button"
            className="record-name-link"
            onClick={() => onOpenFund(fund.id)}
            aria-label={`Open ${fund.fundName}`}
          >
            {fund.fundName}
          </button>
        </h3>
        <button type="button" className="btn btn-sm" onClick={() => setComposing((c) => !c)}>
          {composing ? 'Cancel' : '+ Log new email'}
        </button>
      </div>

      {composing && <EmailComposeForm pairId={pair.id} onLogged={() => setComposing(false)} />}

      {inboxEvents.length === 0 ? (
        <EmptyState message="No emails logged yet. Use “+ Log new email” to add one." />
      ) : (
        <div className="inbox-list">
          {inboxEvents.map((e) => {
            const open = openEventId === e.id;
            const actioned = isActioned(e.date);
            return (
              <div className={`inbox-item${open ? ' inbox-item--open' : ''}`} key={e.id}>
                <button type="button" className="inbox-item-header" onClick={() => setOpenEventId(open ? null : e.id)}>
                  <span className={`chip inbox-type-chip${e.type === 'reply_received' ? ' inbox-type-chip--reply' : ''}`}>
                    {e.type === 'outreach_sent' ? 'Sent' : 'Received'}
                  </span>
                  <span className="inbox-item-main">
                    <span className="inbox-item-subject">{e.subject || '(no subject)'}</span>
                    {!open && <span className="inbox-item-snippet">{snippet(e.body)}</span>}
                  </span>
                  {actioned && (
                    <span className="chip inbox-actioned-chip" title="Task updated after this email">
                      ✓ Actioned
                    </span>
                  )}
                  <span className="inbox-item-date">{formatDateTime(e.date)}</span>
                </button>

                {open && (
                  <div className="inbox-item-expanded">
                    <p className="inbox-item-body">{e.body || '(no body)'}</p>
                    <TaskUpdateForm
                      startup={startup}
                      fund={fund}
                      pair={pair}
                      onSaved={() => setOpenEventId(null)}
                      onClose={() => setOpenEventId(null)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
