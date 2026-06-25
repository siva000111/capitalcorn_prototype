import { useMemo, useState } from 'react';
import { useAppStore } from '../store';
import { SECTOR_TAGS, STAGES, LOCATION_TAGS } from '../constants';
import { getEligibleFunds } from '../matching';
import type { SectorTag, Stage, LocationTag, Fund } from '../types';
import StartupPicker from './StartupPicker';

export default function MatchTab() {
  const startups = useAppStore((s) => s.startups);
  const funds = useAppStore((s) => s.funds);
  const pairs = useAppStore((s) => s.pairs);
  const createPairs = useAppStore((s) => s.createPairs);

  const [startupId, setStartupId] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage | null>(null);
  const [location, setLocation] = useState<LocationTag | null>(null);
  const [selectedSectors, setSelectedSectors] = useState<SectorTag[]>([]);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [matchedThisSession, setMatchedThisSession] = useState<Fund[]>([]);

  const startup = startups.find((s) => s.id === startupId) ?? null;

  function selectStartup(id: string) {
    const s = startups.find((st) => st.id === id);
    if (!s) return;
    setStartupId(id);
    setStage(s.stage);
    setLocation(s.location);
    setSelectedSectors([]);
    setChecked(new Set());
    setMatchedThisSession([]);
  }

  function toggleSector(tag: SectorTag) {
    setSelectedSectors((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    setChecked(new Set());
  }

  const eligible = useMemo(() => {
    if (!startup || !stage || !location) return [];
    return getEligibleFunds(startup, funds, pairs, selectedSectors, stage, location);
  }, [startup, funds, pairs, selectedSectors, stage, location]);

  function toggleChecked(fundId: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(fundId)) next.delete(fundId);
      else next.add(fundId);
      return next;
    });
  }

  function handleConfirm() {
    if (!startup || checked.size === 0) return;
    const fundIds = [...checked];
    createPairs(startup.id, fundIds);
    const matchedFunds = funds.filter((f) => fundIds.includes(f.id));
    setMatchedThisSession((prev) => [...prev, ...matchedFunds]);
    setChecked(new Set());
  }

  return (
    <>
      <section className="match-step">
        <h2 className="step-title">1. Select a startup</h2>
        <StartupPicker selectedId={startupId} onSelect={selectStartup} />
      </section>

      {startup && stage && location && (
        <>
          <section className="match-step">
            <h2 className="step-title">2. Base filters</h2>
            <div className="field-grid">
              <div className="field">
                <label>Ticket size (context)</label>
                <div className="input readonly-display">${startup.raise}M raise</div>
              </div>
              <div className="field">
                <label htmlFor="match-stage">Stage</label>
                <select
                  id="match-stage"
                  className="select"
                  value={stage}
                  onChange={(e) => {
                    setStage(e.target.value as Stage);
                    setChecked(new Set());
                  }}
                >
                  {STAGES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="match-location">Location</label>
                <select
                  id="match-location"
                  className="select"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value as LocationTag);
                    setChecked(new Set());
                  }}
                >
                  {LOCATION_TAGS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="match-step">
            <h2 className="step-title">3. Sector selection</h2>
            <div className="sector-chip-grid">
              {SECTOR_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`sector-chip-toggle${selectedSectors.includes(tag) ? ' selected' : ''}`}
                  onClick={() => toggleSector(tag)}
                  aria-pressed={selectedSectors.includes(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </section>

          <section className="match-step">
            <h2 className="step-title">4. Candidates</h2>
            {selectedSectors.length === 0 ? (
              <div className="placeholder-card">Select at least one sector to see candidates.</div>
            ) : (
              <>
                <p className="result-count">
                  {eligible.length} candidate fund{eligible.length === 1 ? '' : 's'}
                </p>
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Fund</th>
                        <th>City</th>
                        <th>Why it matched</th>
                      </tr>
                    </thead>
                    <tbody>
                      {eligible.map(({ fund, reasons }) => (
                        <tr key={fund.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={checked.has(fund.id)}
                              onChange={() => toggleChecked(fund.id)}
                              aria-label={`Select ${fund.fundName}`}
                            />
                          </td>
                          <td>{fund.fundName}</td>
                          <td>{fund.city}</td>
                          <td>
                            <span className="chip-row">
                              {reasons.map((r) => (
                                <span className="chip" key={r}>
                                  {r}
                                </span>
                              ))}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {eligible.length === 0 && (
                        <tr>
                          <td colSpan={4} className="muted">
                            No funds match these filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="match-confirm-bar">
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={checked.size === 0}
                    onClick={handleConfirm}
                  >
                    Confirm matches ({checked.size})
                  </button>
                </div>

                {matchedThisSession.length > 0 && (
                  <div className="matched-session">
                    <h3 className="matched-session-title">Matched this session</h3>
                    <ul className="matched-session-list">
                      {matchedThisSession.map((f, i) => (
                        <li key={`${f.id}-${i}`}>{f.fundName}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </section>
        </>
      )}
    </>
  );
}
