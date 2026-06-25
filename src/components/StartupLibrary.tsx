import type { Startup } from '../types';
import { useAppStore } from '../store';
import { SECTOR_TAGS, STAGES, LOCATION_TAGS } from '../constants';
import ConfirmButton from './ConfirmButton';

export default function StartupLibrary() {
  const startups = useAppStore((s) => s.startups);
  const updateStartup = useAppStore((s) => s.updateStartup);
  const addStartup = useAppStore((s) => s.addStartup);
  const deleteStartup = useAppStore((s) => s.deleteStartup);

  function patch(id: string, p: Partial<Startup>) {
    updateStartup(id, p);
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Startup library</h1>
          <p className="page-subtitle">{startups.length} startups on file</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={addStartup}>
          + Add startup
        </button>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Sector</th>
              <th>Stage</th>
              <th>Raise ($M)</th>
              <th>Location</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {startups.map((s) => (
              <tr key={s.id}>
                <td>
                  <input
                    className="input"
                    value={s.name}
                    onChange={(e) => patch(s.id, { name: e.target.value })}
                    aria-label="Startup name"
                  />
                </td>
                <td>
                  <select
                    className="select"
                    value={s.sector}
                    onChange={(e) => patch(s.id, { sector: e.target.value as Startup['sector'] })}
                  >
                    {SECTOR_TAGS.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className="select"
                    value={s.stage}
                    onChange={(e) => patch(s.id, { stage: e.target.value as Startup['stage'] })}
                  >
                    {STAGES.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    className="input"
                    type="number"
                    value={s.raise}
                    onChange={(e) => patch(s.id, { raise: e.target.value === '' ? 0 : Number(e.target.value) })}
                    aria-label="Raise in millions USD"
                  />
                </td>
                <td>
                  <select
                    className="select"
                    value={s.location}
                    onChange={(e) => patch(s.id, { location: e.target.value as Startup['location'] })}
                  >
                    {LOCATION_TAGS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <ConfirmButton label="Delete" confirmLabel="Confirm delete" onConfirm={() => deleteStartup(s.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
