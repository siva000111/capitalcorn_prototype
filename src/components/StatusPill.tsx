import { useAppStore } from '../store';
import { NOT_YET_CONTACTED } from '../constants';

interface StatusPillProps {
  statusId: string | null;
}

export default function StatusPill({ statusId }: StatusPillProps) {
  const statuses = useAppStore((s) => s.statuses);
  const status = statusId ? statuses.find((s) => s.id === statusId) : undefined;

  if (!status) {
    return <span className="status-pill status-pill--slate">{NOT_YET_CONTACTED}</span>;
  }

  return <span className={`status-pill status-pill--${status.color}`}>{status.label}</span>;
}
