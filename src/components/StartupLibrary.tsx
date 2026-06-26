import { useEffect, useRef, useState } from 'react';
import type { Startup } from '../types';
import { useAppStore } from '../store';
import { SECTOR_TAGS, STAGES, LOCATION_TAGS } from '../constants';
import ConfirmButton from './ConfirmButton';
import InlineEditText from './InlineEditText';
import InlineEditSelect from './InlineEditSelect';
import EmptyState from './EmptyState';
import StartupRelationshipPanel from './StartupRelationshipPanel';
import LogActivityPanel from './LogActivityPanel';

const SECTOR_OPTIONS = SECTOR_TAGS.map((tag) => ({ value: tag, label: tag }));
const STAGE_OPTIONS = STAGES.map((stage) => ({ value: stage, label: stage }));
const LOCATION_OPTIONS = LOCATION_TAGS.map((loc) => ({ value: loc, label: loc }));

interface StartupLibraryProps {
  jumpStartupId?: string | null;
  jumpRelationshipFundId?: string | null;
  onJumpHandled?: () => void;
  onRelationshipJumpHandled?: () => void;
}

export default function StartupLibrary({
  jumpStartupId,
  jumpRelationshipFundId,
  onJumpHandled,
  onRelationshipJumpHandled,
}: StartupLibraryProps) {
  const startups = useAppStore((s) => s.startups);
  const pairs = useAppStore((s) => s.pairs);
  const updateStartup = useAppStore((s) => s.updateStartup);
  const addStartup = useAppStore((s) => s.addStartup);
  const deleteStartup = useAppStore((s) => s.deleteStartup);

  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [viewStartupId, setViewStartupId] = useState<string | null>(null);
  const [logActivityOpen, setLogActivityOpen] = useState(false);
  const rowRefs = useRef(new Map<string, HTMLTableRowElement>());

  useEffect(() => {
    if (!jumpStartupId) return;
    rowRefs.current.get(jumpStartupId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setHighlightId(jumpStartupId);
    setViewStartupId(jumpStartupId);
    onJumpHandled?.();
    const timer = setTimeout(() => setHighlightId(null), 2000);
    return () => clearTimeout(timer);
  }, [jumpStartupId, onJumpHandled]);

  function patch(id: string, p: Partial<Startup>) {
    updateStartup(id, p);
  }

  function pairCount(startupId: string): number {
    return pairs.filter((p) => p.startupId === startupId).length;
  }

  const viewStartup = startups.find((s) => s.id === viewStartupId) ?? null;

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Startup library</h1>
          <p className="page-subtitle">{startups.length} startups on file</p>
        </div>
        <div className="page-header-actions">
          <button type="button" className="btn btn-sm" onClick={() => setLogActivityOpen(true)}>
            + Log activity
          </button>
          <button type="button" className="btn btn-primary" onClick={addStartup}>
            + Add startup
          </button>
        </div>
      </div>

      {logActivityOpen && <LogActivityPanel onClose={() => setLogActivityOpen(false)} />}

      {startups.length === 0 ? (
        <EmptyState message="No startups yet." action={{ label: '+ Add startup', onClick: addStartup }} />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Sector</th>
                <th>Stage</th>
                <th className="cell-numeric">Raise ($M)</th>
                <th>Location</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {startups.map((s) => (
                <tr
                  key={s.id}
                  ref={(el) => {
                    if (el) rowRefs.current.set(s.id, el);
                    else rowRefs.current.delete(s.id);
                  }}
                  className={highlightId === s.id ? 'row-highlight' : undefined}
                >
                  <td>
                    <InlineEditText value={s.name} onSave={(v) => patch(s.id, { name: v })} ariaLabel="startup name" />
                  </td>
                  <td>
                    <InlineEditSelect
                      value={s.sector}
                      options={SECTOR_OPTIONS}
                      onSave={(v) => patch(s.id, { sector: v as Startup['sector'] })}
                      ariaLabel="sector"
                    />
                  </td>
                  <td>
                    <InlineEditSelect
                      value={s.stage}
                      options={STAGE_OPTIONS}
                      onSave={(v) => patch(s.id, { stage: v as Startup['stage'] })}
                      ariaLabel="stage"
                    />
                  </td>
                  <td className="cell-numeric">
                    <InlineEditText
                      type="number"
                      value={String(s.raise)}
                      onSave={(v) => patch(s.id, { raise: v === '' ? 0 : Number(v) })}
                      ariaLabel="raise in millions USD"
                    />
                  </td>
                  <td>
                    <InlineEditSelect
                      value={s.location}
                      options={LOCATION_OPTIONS}
                      onSave={(v) => patch(s.id, { location: v as Startup['location'] })}
                      ariaLabel="location"
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`btn btn-sm${viewStartupId === s.id ? ' btn-primary' : ''}`}
                      onClick={() => setViewStartupId(viewStartupId === s.id ? null : s.id)}
                    >
                      Relationships ({pairCount(s.id)})
                    </button>
                  </td>
                  <td>
                    <span className="row-actions">
                      <ConfirmButton label="Delete" confirmLabel="Confirm delete" onConfirm={() => deleteStartup(s.id)} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewStartup && (
        <StartupRelationshipPanel
          startup={viewStartup}
          jumpFundId={jumpRelationshipFundId}
          onJumpHandled={onRelationshipJumpHandled}
        />
      )}
    </>
  );
}
