import { useMemo, useState } from 'react';
import { useAppStore } from '../store';
import { PAIR_STATUSES, NOT_YET_CONTACTED } from '../constants';
import StartupPicker from './StartupPicker';

export default function Reports() {
  const startups = useAppStore((s) => s.startups);
  const funds = useAppStore((s) => s.funds);
  const pairs = useAppStore((s) => s.pairs);

  const [startupId, setStartupId] = useState<string | null>(null);
  const startup = startups.find((s) => s.id === startupId) ?? null;

  const startupPairs = useMemo(() => {
    if (!startup) return [];
    return pairs.filter((p) => p.startupId === startup.id);
  }, [startup, pairs]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    map.set(NOT_YET_CONTACTED, 0);
    PAIR_STATUSES.forEach((s) => map.set(s, 0));
    startupPairs.forEach((p) => {
      const key = p.status ?? NOT_YET_CONTACTED;
      map.set(key, (map.get(key) ?? 0) + 1);
    });
    return map;
  }, [startupPairs]);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Pipeline status for a startup's matched funds.</p>
        </div>
      </div>

      <section className="match-step">
        <h2 className="step-title">Select a startup</h2>
        <StartupPicker selectedId={startupId} onSelect={setStartupId} />
      </section>

      {startup && (
        <section className="match-step">
          <div className="report-cards">
            <div className="report-card">
              <div className="report-card-count">{counts.get(NOT_YET_CONTACTED)}</div>
              <div className="report-card-label">{NOT_YET_CONTACTED}</div>
            </div>
            {PAIR_STATUSES.map((s) => (
              <div className="report-card" key={s}>
                <div className="report-card-count">{counts.get(s)}</div>
                <div className="report-card-label">{s}</div>
              </div>
            ))}
          </div>

          {startupPairs.length === 0 ? (
            <div className="placeholder-card">No funds matched with this startup yet.</div>
          ) : (
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Fund</th>
                    <th>Status</th>
                    <th>Follow-up date</th>
                  </tr>
                </thead>
                <tbody>
                  {startupPairs.map((p) => {
                    const fund = funds.find((f) => f.id === p.fundId);
                    return (
                      <tr key={p.id}>
                        <td>{fund?.fundName ?? '(deleted fund)'}</td>
                        <td>{p.status ?? NOT_YET_CONTACTED}</td>
                        <td>{p.followUpDate ?? '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </>
  );
}
