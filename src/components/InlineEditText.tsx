import { useEffect, useRef, useState } from 'react';
import { showToast } from '../toast';

interface InlineEditTextProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'date' | 'email';
  ariaLabel?: string;
  variant?: 'title';
  savedMessage?: string;
  min?: string;
  hint?: string;
}

export default function InlineEditText({
  value,
  onSave,
  placeholder,
  type = 'text',
  ariaLabel,
  variant,
  savedMessage = 'Saved',
  min,
  hint,
}: InlineEditTextProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setDraft(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function commit() {
    setEditing(false);
    if (draft !== value) {
      onSave(draft);
      showToast(savedMessage);
    }
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  const wrapperClass = variant === 'title' ? 'inline-edit-wrap inline-edit-title' : 'inline-edit-wrap';

  if (editing) {
    return (
      <span className={`${wrapperClass}${hint ? ' inline-edit-wrap--with-hint' : ''}`}>
        <input
          ref={inputRef}
          className="input inline-edit-input"
          type={type}
          value={draft}
          placeholder={placeholder}
          aria-label={ariaLabel}
          min={min}
          onChange={(e) => {
            const v = e.target.value;
            if (type === 'date' && min && v !== '' && v < min) {
              setDraft(min);
              return;
            }
            setDraft(v);
          }}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit();
            }
            if (e.key === 'Escape') {
              e.preventDefault();
              cancel();
            }
          }}
        />
        {hint && <span className="field-hint">{hint}</span>}
      </span>
    );
  }

  return (
    <span className={wrapperClass}>
      <button
        type="button"
        className="inline-edit-display"
        onClick={() => setEditing(true)}
        aria-label={ariaLabel ? `Edit ${ariaLabel}` : 'Edit'}
      >
        <span className={`inline-edit-display-text${value ? '' : ' muted'}`}>{value || placeholder || '—'}</span>
        <span className="inline-edit-pencil" aria-hidden="true">
          ✎
        </span>
      </button>
    </span>
  );
}
