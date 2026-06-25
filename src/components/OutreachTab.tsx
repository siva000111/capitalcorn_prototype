import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { useAppStore } from '../store';
import { NOT_YET_CONTACTED } from '../constants';
import StartupPicker from './StartupPicker';

const CONTACT_SLOTS = Array.from({ length: 10 }, (_, i) => i);

export default function OutreachTab() {
  const startups = useAppStore((s) => s.startups);
  const funds = useAppStore((s) => s.funds);
  const pairs = useAppStore((s) => s.pairs);
  const updateContactName = useAppStore((s) => s.updateContactName);

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
    XLSX.writeFile(wb, `outreach-${startup.name}-email${col}.xlsx`);
  }

  return (
    <>
      <section className="match-step">
        <h2 className="step-title">Select a startup</h2>
        <StartupPicker selectedId={startupId} onSelect={selectStartup} />
      </section>

      {startup && (
        <section className="match-step">
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
              <button type="button" className="btn btn-sm" onClick={selectAll} disabled={eligibleRows.length === 0}>
                Select all
              </button>
              <button type="button" className="btn btn-sm" onClick={deselectAll} disabled={eligibleRows.length === 0}>
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
                    <td>{fund.fundName}</td>
                    <td>{pair.status ?? NOT_YET_CONTACTED}</td>
                    <td>
                      {eligible ? (
                        contact.email
                      ) : (
                        <span className="chip">No Email {contactIndex + 1}</span>
                      )}
                    </td>
                    <td>
                      <input
                        className="input"
                        value={contact.name ?? ''}
                        placeholder={`Name ${contactIndex + 1}`}
                        onChange={(e) =>
                          updateContactName(fund.id, contactIndex, e.target.value === '' ? null : e.target.value)
                        }
                        aria-label={`Edit name for ${fund.fundName}`}
                      />
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="muted">
                      No funds matched to this startup yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </>
  );
}
