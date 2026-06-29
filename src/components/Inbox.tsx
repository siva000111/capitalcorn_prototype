import { useMemo, useState } from 'react';
import { useAppStore } from '../store';
import StartupPicker from './StartupPicker';
import TaskUpdateForm from './TaskUpdateForm';
import EmailComposeForm from './EmailComposeForm';
import EmptyState from './EmptyState';
import type { CommEvent, Fund, Pair, Startup } from '../types';

type Filter = 'needsAction' | 'all';

interface InboxRow {
  event: CommEvent;
  pair: Pair;
  startup: Startup;
  fund: Fund;
  actioned: boolean;
  sender: string;
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

function senderFor(event: CommEvent, fund: Fund): string {
  if (event.type !== 'reply_received') return 'outreach@capitalcorn.com';
  const contact = fund.contacts.find((c) => c.name || c.email);
  return contact?.name || contact?.email || fund.fundName;
}

export default function Inbox() {
  const events = useAppStore((s) => s.events);
  const pairs = useAppStore((s) => s.pairs);
  const startups = useAppStore((s) => s.startups);
  const funds = useAppStore((s) => s.funds);

  const [filter, setFilter] = useState<Filter>('needsAction');
  const [search, setSearch] = useState('');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [loggingNew, setLoggingNew] = useState(false);
  const [composeStartupId, setComposeStartupId] = useState<string | null>(null);
  const [composePairId, setComposePairId] = useState<string | null>(null);

  const rows = useMemo(() => {
    return events
      .filter((e) => e.type === 'outreach_sent' || e.type === 'reply_received')
      .map((e): InboxRow | null => {
        const pair = pairs.find((p) => p.id === e.pairId);
        if (!pair) return null;
        const startup = startups.find((s) => s.id === pair.startupId);
        const fund = funds.find((f) => f.id === pair.fundId);
        if (!startup || !fund) return null;
        const actioned = events.some((n) => n.pairId === pair.id && n.type === 'note' && n.date >= e.date);
        return { event: e, pair, startup, fund, actioned, sender: senderFor(e, fund) };
      })
      .filter((r): r is InboxRow => r !== null)
      .sort((a, b) => (a.event.date < b.event.date ? 1 : -1));
  }, [events, pairs, startups, funds]);

  const needsActionCount = useMemo(() => rows.filter((r) => !r.actioned).length, [rows]);

  const visibleRows = useMemo(() => {
    let list = filter === 'needsAction' ? rows.filter((r) => !r.actioned) : rows;
    const term = search.trim().toLowerCase();
    if (term) {
      list = list.filter(
        (r) =>
          r.startup.name.toLowerCase().includes(term) ||
          r.fund.fundName.toLowerCase().includes(term) ||
          (r.event.subject ?? '').toLowerCase().includes(term)
      );
    }
    return list;
  }, [rows, filter, search]);

  function closeLogNew() {
    setLoggingNew(false);
    setComposeStartupId(null);
    setComposePairId(null);
  }

  const composeStartupPairs = useMemo(
    () => (composeStartupId ? pairs.filter((p) => p.startupId === composeStartupId) : []),
    [pairs, composeStartupId]
  );

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Inbox</h1>
          <p className="page-subtitle">Every sent and received email, across every startup–investor pair.</p>
        </div>
        <div className="page-header-actions">
          <button type="button" className="btn btn-primary" onClick={() => setLoggingNew((v) => !v)}>
            {loggingNew ? 'Cancel' : '+ Log new email'}
          </button>
        </div>
      </div>

      {loggingNew && (
        <div className="inbox-log-new">
          {!composeStartupId ? (
            <>
              <h3 className="inbox-log-new-step-title">1. Select a startup</h3>
              <StartupPicker selectedId={composeStartupId} onSelect={setComposeStartupId} />
            </>
          ) : !composePairId ? (
            <>
              <h3 className="inbox-log-new-step-title">
                2. Select an investor for{' '}
                {startups.find((s) => s.id === composeStartupId)?.name}
              </h3>
              {composeStartupPairs.length === 0 ? (
                <EmptyState message="No matched investors for this startup yet. Use the Match tab to find candidates first." />
              ) : (
                <div className="startup-picker">
                  {composeStartupPairs.map((p) => {
                    const fund = funds.find((f) => f.id === p.fundId);
                    if (!fund) return null;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        className="startup-pick-row"
                        onClick={() => setComposePairId(p.id)}
                      >
                        <span className="startup-pick-name">{fund.fundName}</span>
                        <span className="startup-pick-meta">{fund.city}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              <button type="button" className="btn btn-sm" onClick={() => setComposeStartupId(null)}>
                ← Back to startups
              </button>
            </>
          ) : (
            <>
              <h3 className="inbox-log-new-step-title">
                3. Log email — {startups.find((s) => s.id === composeStartupId)?.name} ×{' '}
                {funds.find((f) => f.id === pairs.find((p) => p.id === composePairId)?.fundId)?.fundName}
              </h3>
              <EmailComposeForm pairId={composePairId} onLogged={closeLogNew} />
              <button type="button" className="btn btn-sm" onClick={() => setComposePairId(null)}>
                ← Back to investors
              </button>
            </>
          )}
        </div>
      )}

      <div className="inbox-toolbar">
        <input
          className="input inbox-search"
          placeholder="Search by startup, investor, or subject…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search inbox"
        />
        <div className="inbox-filter-toggle">
          <button
            type="button"
            className={`inbox-filter-btn${filter === 'needsAction' ? ' active' : ''}`}
            onClick={() => setFilter('needsAction')}
          >
            Needs action ({needsActionCount})
          </button>
          <button
            type="button"
            className={`inbox-filter-btn${filter === 'all' ? ' active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({rows.length})
          </button>
        </div>
      </div>

      {visibleRows.length === 0 ? (
        <EmptyState
          message={
            filter === 'needsAction'
              ? 'Nothing needs action right now.'
              : 'No emails logged yet. Use “+ Log new email” to add one.'
          }
        />
      ) : (
        <div className="inbox-list">
          {visibleRows.map((r) => {
            const open = expandedEventId === r.event.id;
            return (
              <div className={`inbox-item${open ? ' inbox-item--open' : ''}`} key={r.event.id}>
                <button
                  type="button"
                  className="inbox-item-header"
                  onClick={() => setExpandedEventId(open ? null : r.event.id)}
                >
                  <span className={`chip inbox-type-chip${r.event.type === 'reply_received' ? ' inbox-type-chip--reply' : ''}`}>
                    {r.event.type === 'outreach_sent' ? 'Sent' : 'Received'}
                  </span>
                  <span className="inbox-item-main">
                    <span className="inbox-row-pair">
                      {r.startup.name} → {r.fund.fundName}
                    </span>
                    <span className={`inbox-item-subject${r.actioned ? '' : ' inbox-row-needs-action'}`}>
                      {r.sender}: {r.event.subject || '(no subject)'}
                    </span>
                    {!open && <span className="inbox-item-snippet">{snippet(r.event.body)}</span>}
                  </span>
                  {r.actioned && (
                    <span className="chip inbox-actioned-chip" title="Task updated after this email">
                      ✓ Actioned
                    </span>
                  )}
                  <span className="inbox-item-date">{formatDateTime(r.event.date)}</span>
                </button>

                {open && (
                  <div className="inbox-item-expanded">
                    <p className="inbox-item-body">{r.event.body || '(no body)'}</p>
                    <TaskUpdateForm
                      startup={r.startup}
                      fund={r.fund}
                      pair={r.pair}
                      onSaved={() => setExpandedEventId(null)}
                      onClose={() => setExpandedEventId(null)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
