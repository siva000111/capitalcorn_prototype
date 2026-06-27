import { useEffect, useRef, useState } from 'react';
import { showToast } from '../toast';

interface EditableHeadingProps {
  value: string;
  onSave: (value: string) => void;
  ariaLabel?: string;
  /** Class applied to the static text and the input, controlling size/weight. */
  textClassName?: string;
  savedMessage?: string;
}

/**
 * Identity-field heading: the record's name is shown as static text plus an
 * explicit pencil/Edit affordance. It NEVER enters edit mode just from a click
 * on the text — that click is reserved for navigation by the parent. Renaming
 * is deliberate: Edit → input (Enter saves / Escape cancels) → Save / Cancel.
 */
export default function EditableHeading({
  value,
  onSave,
  ariaLabel = 'name',
  textClassName = 'editable-heading-text',
  savedMessage = 'Saved',
}: EditableHeadingProps) {
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

  function save() {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed !== '' && trimmed !== value) {
      onSave(trimmed);
      showToast(savedMessage);
    }
  }

  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  if (editing) {
    return (
      <span className="editable-heading editable-heading--editing">
        <input
          ref={inputRef}
          className={`input editable-heading-input ${textClassName}`}
          value={draft}
          aria-label={`Edit ${ariaLabel}`}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              save();
            }
            if (e.key === 'Escape') {
              e.preventDefault();
              cancel();
            }
          }}
        />
        <button type="button" className="btn btn-sm btn-primary" onClick={save}>
          Save
        </button>
        <button type="button" className="btn btn-sm" onClick={cancel}>
          Cancel
        </button>
      </span>
    );
  }

  return (
    <span className="editable-heading">
      <span className={textClassName}>{value}</span>
      <button
        type="button"
        className="btn btn-sm btn-icon editable-heading-edit"
        onClick={() => setEditing(true)}
        aria-label={`Edit ${ariaLabel}`}
        title={`Edit ${ariaLabel}`}
      >
        ✎
      </button>
    </span>
  );
}
