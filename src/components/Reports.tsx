import { useMemo, useState } from 'react';
import { useAppStore } from '../store';
import StartupPicker from './StartupPicker';
import EmptyState from './EmptyState';

// Stable seed ids for the statuses this report tracks by identity (never by current label),
// so renaming a status in Settings relabels these cards without breaking their counts.
const STATUS_ID = {
  reachedOut: 'status-01',
  interested: 'status-02',
  secondCall: 'status-04',
  dueDiligence: 'status-05',
  investment: 'status-06',
  pass: 'status-07',
  passAfterMeeting: 'status-08',
} as const;

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatWeekLabel(start: Date, end: Date): string {
  const fmt = (d: Date) => d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}, ${end.getFullYear()}`;
}

export default function Reports() {
  const startups = useAppStore((s) => s.startups);
  const pairs = useAppStore((s) => s.pairs);
  const events = useAppStore((s) => s.events);
  const statuses = useAppStore((s) => s.statuses);

  const [startupId, setStartupId] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);

  const startup = startups.find((s) => s.id === startupId) ?? null;

  const { weekStart, weekEnd, weekLabel } = useMemo(() => {
    const start = startOfWeek(new Date());
    start.setDate(start.getDate() + weekOffset * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { weekStart: start, weekEnd: end, weekLabel: formatWeekLabel(start, end) };
  }, [weekOffset]);

  function inWeek(iso: string): boolean {
    const t = new Date(iso).getTime();
    return t >= weekStart.getTime() && t <= weekEnd.getTime();
  }

  const statusByKey = useMemo(() => {
    const find = (id: string) => statuses.find((s) => s.id === id);
    return {
      reachedOut: find(STATUS_ID.reachedOut),
      interested: find(STATUS_ID.interested),
      secondCall: find(STATUS_ID.secondCall),
      dueDiligence: find(STATUS_ID.dueDiligence),
      investment: find(STATUS_ID.investment),
      pass: find(STATUS_ID.pass),
      passAfterMeeting: find(STATUS_ID.passAfterMeeting),
    };
  }, [statuses]);

  const metrics = useMemo(() => {
    if (!startup) return null;
    const todayIso = new Date().toISOString().slice(0, 10);
    const startupPairs = pairs.filter((p) => p.startupId === startup.id);
    const pairIds = new Set(startupPairs.map((p) => p.id));
    const startupEvents = events.filter((e) => pairIds.has(e.pairId));

    const countStatus = (def?: { id: string }) => (def ? startupPairs.filter((p) => p.status === def.id).length : 0);

    const pendingFollowUps = startupPairs.filter((p) => {
      if (p.followUpDate === null) return false;
      const def = statuses.find((s) => s.id === p.status);
      if (def?.closed) return false;
      return p.followUpDate >= todayIso;
    }).length;

    const noResponse = startupPairs.filter((p) => {
      if (p.status !== statusByKey.reachedOut?.id) return false;
      return !startupEvents.some((e) => e.pairId === p.id && e.type === 'reply_received');
    }).length;

    return {
      totalOutreach: startupPairs.length,
      repliesThisWeek: startupEvents.filter((e) => e.type === 'reply_received' && inWeek(e.date)).length,
      meetingsScheduledThisWeek: startupEvents.filter((e) => e.type === 'meeting_scheduled' && inWeek(e.date)).length,
      meetingsCompletedThisWeek: startupEvents.filter((e) => e.type === 'meeting_completed' && inWeek(e.date)).length,
      interested: countStatus(statusByKey.interested),
      secondMeetings: countStatus(statusByKey.secondCall),
      dueDiligence: countStatus(statusByKey.dueDiligence),
      investments: countStatus(statusByKey.investment),
      pass: countStatus(statusByKey.pass),
      passAfterMeeting: countStatus(statusByKey.passAfterMeeting),
      pendingFollowUps,
      noResponse,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startup, pairs, events, statuses, statusByKey, weekStart, weekEnd]);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Weekly Report</h1>
          <p className="page-subtitle">Pipeline activity for a startup's matched investors.</p>
        </div>
      </div>

      <div className="week-selector">
        <button type="button" className="btn btn-sm" onClick={() => setWeekOffset((o) => o - 1)} aria-label="Previous week">
          ◀
        </button>
        <span className="week-selector-label">{weekLabel}</span>
        <button type="button" className="btn btn-sm" onClick={() => setWeekOffset((o) => o + 1)} aria-label="Next week">
          ▶
        </button>
        {weekOffset !== 0 && (
          <button type="button" className="btn btn-sm" onClick={() => setWeekOffset(0)}>
            This week
          </button>
        )}
      </div>

      <section className="match-step">
        <h2 className="step-title">Select a startup</h2>
        <StartupPicker selectedId={startupId} onSelect={setStartupId} />
      </section>

      {startup && metrics && (
        <section className="match-step">
          <div className="report-group">
            <h3 className="report-group-title">Pipeline</h3>
            <div className="report-cards">
              <div className="report-card">
                <div className="report-card-count">{metrics.totalOutreach}</div>
                <div className="report-card-label">Total Investor Outreach</div>
              </div>
              <div className="report-card">
                <div className="report-card-count">{metrics.interested}</div>
                <div className="report-card-label">{statusByKey.interested?.label ?? 'Interested Investors'}</div>
              </div>
              <div className="report-card">
                <div className="report-card-count">{metrics.secondMeetings}</div>
                <div className="report-card-label">{statusByKey.secondCall?.label ?? 'Second Meetings'}</div>
              </div>
              <div className="report-card">
                <div className="report-card-count">{metrics.dueDiligence}</div>
                <div className="report-card-label">{statusByKey.dueDiligence?.label ?? 'Due Diligence'}</div>
              </div>
              <div className="report-card">
                <div className="report-card-count">{metrics.investments}</div>
                <div className="report-card-label">{statusByKey.investment?.label ?? 'Investments'}</div>
              </div>
              <div className="report-card">
                <div className="report-card-count">{metrics.pass}</div>
                <div className="report-card-label">{statusByKey.pass?.label ?? 'Pass'}</div>
              </div>
              <div className="report-card">
                <div className="report-card-count">{metrics.passAfterMeeting}</div>
                <div className="report-card-label">{statusByKey.passAfterMeeting?.label ?? 'Pass After Meeting'}</div>
              </div>
            </div>
          </div>

          <div className="report-group">
            <h3 className="report-group-title">Engagement</h3>
            <div className="report-cards">
              <div className="report-card">
                <div className="report-card-count">{metrics.repliesThisWeek}</div>
                <div className="report-card-label">Total Replies Received</div>
              </div>
              <div className="report-card">
                <div className="report-card-count">{metrics.meetingsScheduledThisWeek}</div>
                <div className="report-card-label">Total Meetings Scheduled</div>
              </div>
              <div className="report-card">
                <div className="report-card-count">{metrics.meetingsCompletedThisWeek}</div>
                <div className="report-card-label">Total Meetings Completed</div>
              </div>
            </div>
          </div>

          <div className="report-group">
            <h3 className="report-group-title">Attention</h3>
            <div className="report-cards">
              <div className="report-card">
                <div className="report-card-count">{metrics.pendingFollowUps}</div>
                <div className="report-card-label">Pending Follow-ups</div>
              </div>
              <div className="report-card">
                <div className="report-card-count">{metrics.noResponse}</div>
                <div className="report-card-label">No Response</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {!startup && <EmptyState message="Select a startup to see its weekly report." />}
    </>
  );
}
