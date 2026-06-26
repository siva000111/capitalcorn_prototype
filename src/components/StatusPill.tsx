import type { PairStatus } from '../types';
import { NOT_YET_CONTACTED, getStatusTone } from '../constants';

interface StatusPillProps {
  status: PairStatus | null;
}

export default function StatusPill({ status }: StatusPillProps) {
  const tone = getStatusTone(status);
  return <span className={`status-pill status-pill--${tone}`}>{status ?? NOT_YET_CONTACTED}</span>;
}
