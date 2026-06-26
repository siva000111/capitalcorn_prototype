import StatusPill from './StatusPill';
import EmptyState from './EmptyState';
import type { Pair } from '../types';

export interface FollowUpRow {
  pair: Pair;
  startupName: string;
  fundId: string;
  fundName: string;
}

interface FollowUpListProps {
  title: string;
  rows: FollowUpRow[];
  today: string;
  emptyMessage: string;
  onSelectPair: (startupId: string, fundId: string) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function FollowUpList({ title, rows, today, emptyMessage, onSelectPair }: FollowUpListProps) {
  return (
    <section className="home-section">
      <h2 className="step-title">
        {title} ({rows.length})
      </h2>
      {rows.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <div className="table-wrap home-needs-attention">
          <table className="data-table">
            <thead>
              <tr>
                <th>Startup</th>
                <th>Fund</th>
                <th>Status</th>
                <th>Follow-up date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ pair, startupName, fundId, fundName }) => {
                const overdue = pair.followUpDate! < today;
                return (
                  <tr
                    key={pair.id}
                    tabIndex={0}
                    role="button"
                    onClick={() => onSelectPair(pair.startupId, fundId)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectPair(pair.startupId, fundId);
                      }
                    }}
                  >
                    <td>{startupName}</td>
                    <td>{fundName}</td>
                    <td>
                      <StatusPill statusId={pair.status} />
                    </td>
                    <td className={overdue ? 'home-overdue-tag' : undefined}>
                      {formatDate(pair.followUpDate!)}
                      {overdue ? ' · overdue' : ''}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
