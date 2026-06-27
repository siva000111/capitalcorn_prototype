import { useMemo, useState } from 'react';
import { useAppStore } from '../store';
import EmptyState from './EmptyState';
import TaskUpdateForm from './TaskUpdateForm';
import { showToast } from '../toast';
import type { CommEventType, Fund, Pair, Startup } from '../types';

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

function nowForInput(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function PairDetailPanel({ startup, fund, pair, onOpenFund }: PairDetailPanelProps) {
  const allEvents = useAppStore((s) => s.events);
  const addCommEvent = useAppStore((s) => s.addCommEvent);

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
  const [composeType, setComposeType] = useState<CommEventType>('outreach_sent');
  const [composeDate, setComposeDate] = useState(nowForInput);
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  function handleLogEmail() {
    addCommEvent(pair.id, composeType, new Date(composeDate).toISOString(), composeSubject, composeBody);
    showToast('Email logged');
    setComposing(false);
    setComposeSubject('');
    setComposeBody('');
    setComposeDate(nowForInput());
  }

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

      {composing && (
        <div className="compose-form">
          <div className="field-grid">
            <div className="field">
              <label htmlFor="compose-type">Type</label>
              <select
                id="compose-type"
                className="select"
                value={composeType}
                onChange={(e) => setComposeType(e.target.value as CommEventType)}
              >
                <option value="outreach_sent">Outreach sent</option>
                <option value="reply_received">Reply received</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="compose-date">Date</label>
              <input
                id="compose-date"
                className="input"
                type="datetime-local"
                value={composeDate}
                onChange={(e) => setComposeDate(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="compose-subject">Subject</label>
            <input
              id="compose-subject"
              className="input"
              value={composeSubject}
              onChange={(e) => setComposeSubject(e.target.value)}
              placeholder="Subject"
            />
          </div>
          <div className="field">
            <label htmlFor="compose-body">Body</label>
            <textarea
              id="compose-body"
              className="input textarea"
              value={composeBody}
              onChange={(e) => setComposeBody(e.target.value)}
              placeholder="Email body…"
              rows={3}
            />
          </div>
          <div className="compose-actions">
            <button type="button" className="btn btn-primary btn-sm" onClick={handleLogEmail} disabled={!composeSubject.trim()}>
              Save email
            </button>
          </div>
        </div>
      )}

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
