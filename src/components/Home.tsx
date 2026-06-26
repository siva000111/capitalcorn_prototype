import { useMemo } from 'react';
import { useAppStore } from '../store';
import FollowUpList, { type FollowUpRow } from './FollowUpList';

interface HomeProps {
  onSelectPair: (startupId: string, fundId: string) => void;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00.000Z');
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function Home({ onSelectPair }: HomeProps) {
  const startups = useAppStore((s) => s.startups);
  const funds = useAppStore((s) => s.funds);
  const pairs = useAppStore((s) => s.pairs);
  const statuses = useAppStore((s) => s.statuses);
  const events = useAppStore((s) => s.events);

  const today = todayIso();
  const sevenDaysOut = addDays(today, 7);

  function isClosed(statusId: string | null): boolean {
    if (statusId === null) return false;
    return statuses.find((s) => s.id === statusId)?.closed ?? false;
  }

  function buildRows(predicate: (followUpDate: string) => boolean): FollowUpRow[] {
    const rows: FollowUpRow[] = [];
    for (const pair of pairs) {
      if (pair.followUpDate === null) continue;
      if (!predicate(pair.followUpDate)) continue;
      if (isClosed(pair.status)) continue;
      const startup = startups.find((s) => s.id === pair.startupId);
      const fund = funds.find((f) => f.id === pair.fundId);
      if (!startup || !fund) continue;
      rows.push({ pair, startupName: startup.name, fundId: fund.id, fundName: fund.fundName });
    }
    return rows.sort((a, b) => (a.pair.followUpDate! < b.pair.followUpDate! ? -1 : 1));
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const todaysFollowUps = useMemo(() => buildRows((d) => d === today), [pairs, startups, funds, statuses, today]);
  // Pending = everything outstanding except exactly-today (overdue + any future), overdue sorts first.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pendingFollowUps = useMemo(() => buildRows((d) => d !== today), [pairs, startups, funds, statuses, today]);
  // Upcoming = the future-only slice of Pending, bounded to the next 7 days.
  const upcomingFollowUps = useMemo(
    () => buildRows((d) => d > today && d <= sevenDaysOut),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pairs, startups, funds, statuses, today, sevenDaysOut]
  );

  const stats = useMemo(() => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const investorsContacted = new Set(pairs.map((p) => p.fundId)).size;
    const repliesThisWeek = events.filter(
      (e) => e.type === 'reply_received' && new Date(e.date).getTime() >= sevenDaysAgo
    ).length;
    const meetingsScheduledThisWeek = events.filter(
      (e) => e.type === 'meeting_scheduled' && new Date(e.date).getTime() >= sevenDaysAgo
    ).length;
    return {
      totalStartups: startups.length,
      investorsContacted,
      repliesThisWeek,
      meetingsScheduledThisWeek,
    };
  }, [pairs, startups, events]);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Home</h1>
          <p className="page-subtitle">What needs your attention today.</p>
        </div>
      </div>

      <FollowUpList
        title="Today's Follow-ups"
        rows={todaysFollowUps}
        today={today}
        emptyMessage="Nothing due today."
        onSelectPair={onSelectPair}
      />

      <FollowUpList
        title="Pending Follow-ups"
        rows={pendingFollowUps}
        today={today}
        emptyMessage="No pending follow-ups."
        onSelectPair={onSelectPair}
      />

      <FollowUpList
        title="Upcoming Follow-ups (next 7 days)"
        rows={upcomingFollowUps}
        today={today}
        emptyMessage="Nothing coming up in the next 7 days."
        onSelectPair={onSelectPair}
      />

      <div className="report-cards">
        <div className="report-card">
          <div className="report-card-count">{stats.totalStartups}</div>
          <div className="report-card-label">Total Startups</div>
        </div>
        <div className="report-card">
          <div className="report-card-count">{stats.investorsContacted}</div>
          <div className="report-card-label">Total Investors Contacted</div>
        </div>
        <div className="report-card">
          <div className="report-card-count">{stats.repliesThisWeek}</div>
          <div className="report-card-label">Total Replies This Week</div>
        </div>
        <div className="report-card">
          <div className="report-card-count">{stats.meetingsScheduledThisWeek}</div>
          <div className="report-card-label">Meetings Scheduled This Week</div>
        </div>
      </div>
    </>
  );
}
