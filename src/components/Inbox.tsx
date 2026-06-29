import { useMemo, useState } from 'react';
import { useAppStore } from '../store';
import TaskUpdateForm from './TaskUpdateForm';
import EmptyState from './EmptyState';
import { showToast } from '../toast';
import type { CommEvent, Fund, MailAccount, Pair, Startup } from '../types';

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

// Gmail-style relative date: "2h ago" today, "Yesterday", "3 Jun", or "3 Jun 2025" for prior years.
function relativeDate(iso: string): string {
  const then = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfThen = new Date(then.getFullYear(), then.getMonth(), then.getDate());
  const dayDiff = Math.round((startOfToday.getTime() - startOfThen.getTime()) / 86400000);

  if (dayDiff === 0) {
    const diffHr = Math.floor(diffMin / 60);
    return `${diffHr}h ago`;
  }
  if (dayDiff === 1) return 'Yesterday';

  const sameYear = then.getFullYear() === now.getFullYear();
  return then.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
}

function fullDateTime(iso: string): string {
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

function senderFor(event: CommEvent, fund: Fund, accounts: MailAccount[]): string {
  if (event.type === 'reply_received') {
    const contact = fund.contacts.find((c) => c.name || c.email);
    return contact?.name || contact?.email || fund.fundName;
  }
  // outreach_sent → the simulated connected account that sent it
  const acct = accounts.find((a) => a.id === event.account);
  return acct?.address ?? 'outreach@capitalcorn.com';
}

export default function Inbox() {
  const events = useAppStore((s) => s.events);
  const pairs = useAppStore((s) => s.pairs);
  const startups = useAppStore((s) => s.startups);
  const funds = useAppStore((s) => s.funds);
  const mailAccounts = useAppStore((s) => s.mailAccounts);
  const addMailAccount = useAppStore((s) => s.addMailAccount);

  const [filter, setFilter] = useState<Filter>('needsAction');
  const [search, setSearch] = useState('');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // Account switcher: null = "All accounts".
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  // Simulated "connect an account" placeholder.
  const [addingAccount, setAddingAccount] = useState(false);
  const [newAddress, setNewAddress] = useState('');

  const selectedAccount = mailAccounts.find((a) => a.id === selectedAccountId) ?? null;

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
        return { event: e, pair, startup, fund, actioned, sender: senderFor(e, fund, mailAccounts) };
      })
      .filter((r): r is InboxRow => r !== null)
      .sort((a, b) => (a.event.date < b.event.date ? 1 : -1));
  }, [events, pairs, startups, funds, mailAccounts]);

  // Rows scoped to the selected connected account (or all).
  const accountRows = useMemo(
    () => (selectedAccountId ? rows.filter((r) => r.event.account === selectedAccountId) : rows),
    [rows, selectedAccountId]
  );

  const needsActionCount = useMemo(() => accountRows.filter((r) => !r.actioned).length, [accountRows]);

  const visibleRows = useMemo(() => {
    let list = filter === 'needsAction' ? accountRows.filter((r) => !r.actioned) : accountRows;
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
  }, [accountRows, filter, search]);

  function handleAddAccount() {
    const addr = newAddress.trim();
    if (!addr) return;
    const created = addMailAccount(addr);
    setSelectedAccountId(created.id);
    setNewAddress('');
    setAddingAccount(false);
    showToast('Mail account connected');
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Inbox</h1>
          <p className="page-subtitle">Every sent and received email, across every startup–investor pair.</p>
        </div>
        <div className="page-header-actions">
          {/* Gmail-style account switcher */}
          <div className="account-switcher">
            <button
              type="button"
              className="account-switcher-trigger"
              onClick={() => setSwitcherOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={switcherOpen}
            >
              <span className="account-switcher-avatar" aria-hidden="true">
                {(selectedAccount?.label ?? 'A')[0].toUpperCase()}
              </span>
              <span className="account-switcher-label">
                {selectedAccount ? selectedAccount.address : 'All accounts'}
              </span>
              <span aria-hidden="true">▾</span>
            </button>
            {switcherOpen && (
              <>
                <div className="dropdown-backdrop" onClick={() => setSwitcherOpen(false)} />
                <div className="account-switcher-menu" role="menu">
                  <button
                    type="button"
                    className={`account-switcher-item${selectedAccountId === null ? ' active' : ''}`}
                    onClick={() => {
                      setSelectedAccountId(null);
                      setSwitcherOpen(false);
                    }}
                  >
                    All accounts
                  </button>
                  {mailAccounts.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      className={`account-switcher-item${selectedAccountId === a.id ? ' active' : ''}`}
                      onClick={() => {
                        setSelectedAccountId(a.id);
                        setSwitcherOpen(false);
                      }}
                    >
                      <span className="account-switcher-avatar" aria-hidden="true">
                        {a.label[0].toUpperCase()}
                      </span>
                      <span className="account-switcher-item-text">
                        <span className="account-switcher-item-addr">{a.address}</span>
                        <span className="account-switcher-item-name">{a.label}</span>
                      </span>
                    </button>
                  ))}
                  <div className="account-switcher-divider" />
                  <button
                    type="button"
                    className="account-switcher-item account-switcher-add"
                    onClick={() => {
                      setSwitcherOpen(false);
                      setAddingAccount(true);
                    }}
                  >
                    + Add new mail
                  </button>
                </div>
              </>
            )}
          </div>
          <button type="button" className="btn btn-primary">
            + Log email
          </button>
        </div>
      </div>

      {addingAccount && (
        <div className="search-backdrop" onMouseDown={(e) => e.target === e.currentTarget && setAddingAccount(false)}>
          <div className="settings-panel add-account-panel">
            <div className="settings-header">
              <h2 className="step-title">Connect a mail account</h2>
              <button type="button" className="btn btn-sm" onClick={() => setAddingAccount(false)}>
                Close
              </button>
            </div>
            <p className="add-account-note">
              Prototype stand-in — this simulates connecting an account. No real Gmail sign-in or OAuth happens; it
              just adds a mock sending address to the switcher.
            </p>
            <div className="field">
              <label htmlFor="new-account-address">Email address</label>
              <input
                id="new-account-address"
                className="input"
                placeholder="name@capitalcorn.com"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddAccount();
                  }
                }}
                autoFocus
              />
            </div>
            <div className="compose-actions">
              <button type="button" className="btn btn-primary btn-sm" onClick={handleAddAccount} disabled={!newAddress.trim()}>
                Connect account
              </button>
            </div>
          </div>
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
            All ({accountRows.length})
          </button>
        </div>
      </div>

      {visibleRows.length === 0 ? (
        <EmptyState
          message={filter === 'needsAction' ? 'Nothing needs action right now.' : 'No emails logged yet.'}
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
                  <span className="inbox-item-date" title={fullDateTime(r.event.date)}>
                    {relativeDate(r.event.date)}
                  </span>
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
