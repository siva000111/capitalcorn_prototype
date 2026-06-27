import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { useAppStore } from '../store';
import StartupPicker from './StartupPicker';
import StatusPill from './StatusPill';
import InlineEditText from './InlineEditText';
import ConfirmButton from './ConfirmButton';
import EmptyState from './EmptyState';
import { showToast } from '../toast';

const CONTACT_SLOTS = Array.from({ length: 10 }, (_, i) => i);

interface OutreachTabProps {
  onOpenFund: (fundId: string) => void;
}

export default function OutreachTab({ onOpenFund }: OutreachTabProps) {
  const startups = useAppStore((s) => s.startups);
  const funds = useAppStore((s) => s.funds);
  const pairs = useAppStore((s) => s.pairs);
  const updateContactName = useAppStore((s) => s.updateContactName);
  const deletePair = useAppStore((s) => s.deletePair);

  const [startupId, setStartupId] = useState<string | null>(null);
  const [contactIndex, setContactIndex] = useState(0);
  const [uncheckedFundIds, setUncheckedFundIds] = useState<Set<string>>(new Set());

  const startup = startups.find((s) => s.id === startupId) ?? null;

  function selectStartup(id: string) {
    setStartupId(id);
    setContactIndex(0);
    setUncheckedFundIds(new Set());
  }

  function changeIndex(index: number) {
    setContactIndex(index);
    setUncheckedFundIds(new Set());
  }

  const rows = useMemo(() => {
    if (!startup) return [];
    return pairs
      .filter((p) => p.startupId === startup.id)
      .map((pair) => {
        const fund = funds.find((f) => f.id === pair.fundId);
        if (!fund) return null;
        const contact = fund.contacts[contactIndex] ?? { email: null, name: null };
        const eligible = !!contact.email;
        return { pair, fund, contact, eligible };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);
  }, [startup, pairs, funds, contactIndex]);

  const eligibleRows = rows.filter((r) => r.eligible);
  const checkedRows = eligibleRows.filter((r) => !uncheckedFundIds.has(r.fund.id));

  function toggleRow(fundId: string) {
    setUncheckedFundIds((prev) => {
      const next = new Set(prev);
      if (next.has(fundId)) next.delete(fundId);
      else next.add(fundId);
      return next;
    });
  }

  function selectAll() {
    setUncheckedFundIds(new Set());
  }

  function deselectAll() {
    setUncheckedFundIds(new Set(eligibleRows.map((r) => r.fund.id)));
  }

  function handleDownload() {
    if (!startup || checkedRows.length === 0) return;
    const col = contactIndex + 1;
    const data = checkedRows.map((r) => ({
      'Fund Name': r.fund.fundName,
      [`Email ${col}`]: r.contact.email,
      [`Name ${col}`]: r.contact.name ?? '',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Outreach');
    const filename = `outreach-${startup.name}-email${col}.xlsx`;
    XLSX.writeFile(wb, filename);
    showToast(`Exported ${filename}`);
  }

  function handleUnmatch(pairId: string) {
    deletePair(pairId);
    showToast('Match removed');
  }

  return (
    <>
      <section className="match-step">
        <h2 className="step-title">Select a startup</h2>
        <StartupPicker selectedId={startupId} onSelect={selectStartup} />
      </section>

      {startup && (
        <section className="match-step">
          {rows.length === 0 ? (
            <EmptyState message="No funds matched to this startup yet. Use the Match tab to find candidates." />
          ) : (
            <>
              <div className="outreach-controls">
                <div className="field">
                  <label htmlFor="contact-index">Email / Name index</label>
                  <select
                    id="contact-index"
                    className="select"
                    value={contactIndex}
                    onChange={(e) => changeIndex(Number(e.target.value))}
                  >
                    {CONTACT_SLOTS.map((i) => (
                      <option key={i} value={i}>
                        Email {i + 1} / Name {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="outreach-controls-actions">
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={selectAll}
                    disabled={eligibleRows.length === 0}
                  >
                    Select all
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm"
                    onClick={deselectAll}
                    disabled={eligibleRows.length === 0}
                  >
                    Deselect all
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleDownload}
                    disabled={checkedRows.length === 0}
                  >
                    Download xlsx ({checkedRows.length})
                  </button>
                </div>
              </div>

              <div className="table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Fund</th>
                      <th>Status</th>
                      <th>Email {contactIndex + 1}</th>
                      <th>Name {contactIndex + 1}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ pair, fund, contact, eligible }) => (
                      <tr key={pair.id} className={eligible ? undefined : 'row-disabled'}>
                        <td>
                          <input
                            type="checkbox"
                            checked={eligible && !uncheckedFundIds.has(fund.id)}
                            disabled={!eligible}
                            onChange={() => toggleRow(fund.id)}
                            aria-label={`Select ${fund.fundName}`}
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className="record-name-link"
                            onClick={() => onOpenFund(fund.id)}
                            aria-label={`Open ${fund.fundName}`}
                          >
                            {fund.fundName}
                          </button>
                        </td>
                        <td>
                          <StatusPill statusId={pair.status} />
                        </td>
                        <td>
                          {eligible ? contact.email : <span className="chip">No Email {contactIndex + 1}</span>}
                        </td>
                        <td>
                          <InlineEditText
                            value={contact.name ?? ''}
                            placeholder={`Name ${contactIndex + 1}`}
                            onSave={(v) => updateContactName(fund.id, contactIndex, v === '' ? null : v)}
                            ariaLabel={`name for ${fund.fundName}`}
                          />
                        </td>
                        <td>
                          <span className="row-actions">
                            <ConfirmButton
                              label="Unmatch"
                              prompt="Remove this match? This cannot be undone."
                              confirmLabel="Remove"
                              onConfirm={() => handleUnmatch(pair.id)}
                            />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      )}
    </>
  );
}
