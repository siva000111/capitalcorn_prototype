import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppStore } from '../store';
import { SECTOR_TAGS, STAGES, LOCATION_TAGS, PRIORITIES, INVESTOR_TYPES } from '../constants';
import type { SectorTag, Stage, LocationTag } from '../types';
import FundCard from './FundCard';
import EmptyState from './EmptyState';

interface InvestorLibraryProps {
  jumpFundId?: string | null;
  onJumpHandled?: () => void;
}

export default function InvestorLibrary({ jumpFundId, onJumpHandled }: InvestorLibraryProps) {
  const funds = useAppStore((s) => s.funds);
  const addFund = useAppStore((s) => s.addFund);

  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState<SectorTag | ''>('');
  const [stageFilter, setStageFilter] = useState<Stage | ''>('');
  const [locationFilter, setLocationFilter] = useState<LocationTag | ''>('');
  const [typeFilter, setTypeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [ticketMin, setTicketMin] = useState('');
  const [ticketMax, setTicketMax] = useState('');
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const cardRefs = useRef(new Map<string, HTMLDivElement>());

  function clearFilters() {
    setSearch('');
    setSectorFilter('');
    setStageFilter('');
    setLocationFilter('');
    setTypeFilter('');
    setPriorityFilter('');
    setTicketMin('');
    setTicketMax('');
  }

  const filtered = useMemo(() => {
    const qMin = ticketMin === '' ? -Infinity : Number(ticketMin);
    const qMax = ticketMax === '' ? Infinity : Number(ticketMax);
    const term = search.trim().toLowerCase();

    return funds.filter((f) => {
      if (term && !f.fundName.toLowerCase().includes(term)) return false;
      if (sectorFilter && !f.focusAreas.includes(sectorFilter)) return false;
      if (stageFilter && !f.stages.includes(stageFilter)) return false;
      if (locationFilter && !f.locations.includes(locationFilter)) return false;
      if (typeFilter && f.investorType !== typeFilter) return false;
      if (priorityFilter && f.priority !== priorityFilter) return false;

      const fMin = f.minTicket ?? -Infinity;
      const fMax = f.maxTicket ?? Infinity;
      if (!(fMin <= qMax && fMax >= qMin)) return false;

      return true;
    });
  }, [funds, search, sectorFilter, stageFilter, locationFilter, typeFilter, priorityFilter, ticketMin, ticketMax]);

  useEffect(() => {
    if (!jumpFundId) return;
    clearFilters();
    setHighlightId(jumpFundId);
    onJumpHandled?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jumpFundId, onJumpHandled]);

  useEffect(() => {
    if (!highlightId) return;
    cardRefs.current.get(highlightId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const timer = setTimeout(() => setHighlightId(null), 2000);
    return () => clearTimeout(timer);
  }, [highlightId]);

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Investor library</h1>
          <p className="page-subtitle">{funds.length} funds on file</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={addFund}>
          + Add fund
        </button>
      </div>

      <div className="filter-bar">
        <div className="filter-field search-field">
          <label htmlFor="fund-search">Search</label>
          <input
            id="fund-search"
            className="input"
            placeholder="Fund name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-field">
          <label htmlFor="filter-sector">Sector</label>
          <select
            id="filter-sector"
            className="select"
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value as SectorTag | '')}
          >
            <option value="">All sectors</option>
            {SECTOR_TAGS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="filter-stage">Stage</label>
          <select
            id="filter-stage"
            className="select"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as Stage | '')}
          >
            <option value="">All stages</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="filter-location">Location</label>
          <select
            id="filter-location"
            className="select"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value as LocationTag | '')}
          >
            <option value="">All locations</option>
            {LOCATION_TAGS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="filter-type">Investor type</label>
          <select id="filter-type" className="select" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All types</option>
            {INVESTOR_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-field">
          <label htmlFor="filter-priority">Priority</label>
          <select
            id="filter-priority"
            className="select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All priorities</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-field">
          <label>Ticket range ($M)</label>
          <div className="filter-range">
            <input
              className="input"
              type="number"
              placeholder="Min"
              value={ticketMin}
              onChange={(e) => setTicketMin(e.target.value)}
            />
            <span className="muted">–</span>
            <input
              className="input"
              type="number"
              placeholder="Max"
              value={ticketMax}
              onChange={(e) => setTicketMax(e.target.value)}
            />
          </div>
        </div>
        <div className="filter-bar-actions">
          <button type="button" className="btn btn-sm" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      </div>

      <p className="result-count">
        Showing {filtered.length} of {funds.length} funds
      </p>

      {filtered.length === 0 ? (
        <EmptyState message="No funds match the current filters." action={{ label: 'Clear filters', onClick: clearFilters }} />
      ) : (
        filtered.map((fund) => (
          <div
            key={fund.id}
            ref={(el) => {
              if (el) cardRefs.current.set(fund.id, el);
              else cardRefs.current.delete(fund.id);
            }}
            className={highlightId === fund.id ? 'row-highlight' : undefined}
          >
            <FundCard fund={fund} />
          </div>
        ))
      )}
    </>
  );
}
