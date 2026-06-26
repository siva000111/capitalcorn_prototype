import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useAppStore } from '../store';

interface QuickSearchProps {
  onClose: () => void;
  onSelectFund: (fundId: string) => void;
  onSelectStartup: (startupId: string) => void;
}

interface SearchResult {
  type: 'fund' | 'startup';
  id: string;
  label: string;
  meta: string;
}

export default function QuickSearch({ onClose, onSelectFund, onSelectStartup }: QuickSearchProps) {
  const funds = useAppStore((s) => s.funds);
  const startups = useAppStore((s) => s.startups);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo<SearchResult[]>(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    const fundResults: SearchResult[] = funds
      .filter((f) => f.fundName.toLowerCase().includes(term))
      .map((f) => ({ type: 'fund' as const, id: f.id, label: f.fundName, meta: f.city }));
    const startupResults: SearchResult[] = startups
      .filter((s) => s.name.toLowerCase().includes(term))
      .map((s) => ({ type: 'startup' as const, id: s.id, label: s.name, meta: s.sector }));
    return [...fundResults, ...startupResults];
  }, [query, funds, startups]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  function select(result: SearchResult) {
    if (result.type === 'fund') onSelectFund(result.id);
    else onSelectStartup(result.id);
    onClose();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const result = results[activeIndex];
      if (result) select(result);
    }
  }

  const fundResults = results.filter((r) => r.type === 'fund');
  const startupResults = results.filter((r) => r.type === 'startup');

  return (
    <div
      className="search-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="search-panel" onKeyDown={handleKeyDown}>
        <div className="search-input-row">
          <input
            ref={inputRef}
            className="search-input"
            placeholder="Search funds and startups…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Quick search"
          />
        </div>
        <div className="search-results">
          {query.trim() === '' ? (
            <div className="search-empty">Type to search funds and startups.</div>
          ) : results.length === 0 ? (
            <div className="search-empty">No matches for "{query}".</div>
          ) : (
            <>
              {fundResults.length > 0 && (
                <>
                  <div className="search-section-label">Funds</div>
                  {fundResults.map((r) => (
                    <button
                      key={`fund-${r.id}`}
                      type="button"
                      className={`search-result${results.indexOf(r) === activeIndex ? ' active' : ''}`}
                      onClick={() => select(r)}
                      onMouseEnter={() => setActiveIndex(results.indexOf(r))}
                    >
                      <span>{r.label}</span>
                      <span className="search-result-meta">{r.meta}</span>
                    </button>
                  ))}
                </>
              )}
              {startupResults.length > 0 && (
                <>
                  <div className="search-section-label">Startups</div>
                  {startupResults.map((r) => (
                    <button
                      key={`startup-${r.id}`}
                      type="button"
                      className={`search-result${results.indexOf(r) === activeIndex ? ' active' : ''}`}
                      onClick={() => select(r)}
                      onMouseEnter={() => setActiveIndex(results.indexOf(r))}
                    >
                      <span>{r.label}</span>
                      <span className="search-result-meta">{r.meta}</span>
                    </button>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
