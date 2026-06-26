import { useEffect, useRef, useState, type ReactNode } from 'react';
import { showToast } from '../toast';

interface Option {
  value: string;
  label: string;
}

interface InlineEditSelectProps {
  value: string;
  options: Option[];
  onSave: (value: string) => void;
  renderDisplay?: (value: string) => ReactNode;
  placeholder?: string;
  ariaLabel?: string;
  savedMessage?: string;
}

export default function InlineEditSelect({
  value,
  options,
  onSave,
  renderDisplay,
  placeholder,
  ariaLabel,
  savedMessage = 'Saved',
}: InlineEditSelectProps) {
  const [editing, setEditing] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    if (editing) selectRef.current?.focus();
  }, [editing]);

  function commit(next: string) {
    setEditing(false);
    if (next !== value) {
      onSave(next);
      showToast(savedMessage);
    }
  }

  if (editing) {
    return (
      <select
        ref={selectRef}
        className="select inline-edit-input"
        defaultValue={value}
        aria-label={ariaLabel}
        onChange={(e) => commit(e.target.value)}
        onBlur={() => setEditing(false)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            setEditing(false);
          }
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  const current = options.find((opt) => opt.value === value);

  return (
    <button
      type="button"
      className="inline-edit-display"
      onClick={() => setEditing(true)}
      aria-label={ariaLabel ? `Edit ${ariaLabel}` : 'Edit'}
    >
      <span className="inline-edit-display-text">
        {renderDisplay ? (
          renderDisplay(value)
        ) : (
          <span className={current?.label ? '' : 'muted'}>{current?.label || placeholder || '—'}</span>
        )}
      </span>
      <span className="inline-edit-pencil" aria-hidden="true">
        ✎
      </span>
    </button>
  );
}
