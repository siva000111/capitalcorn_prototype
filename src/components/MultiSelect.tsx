import { useEffect, useRef, useState } from 'react';

interface MultiSelectProps<T extends string> {
  options: readonly T[];
  value: T[];
  onChange: (next: T[]) => void;
  placeholder?: string;
}

export default function MultiSelect<T extends string>({
  options,
  value,
  onChange,
  placeholder = 'Select…',
}: MultiSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [open]);

  function toggle(opt: T) {
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  }

  return (
    <div className="multiselect" ref={ref}>
      <button
        type="button"
        className="multiselect-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {value.length === 0 ? (
          <span className="muted">{placeholder}</span>
        ) : (
          <span className="chip-row">
            {value.map((v) => (
              <span className="chip" key={v}>
                {v}
              </span>
            ))}
          </span>
        )}
      </button>
      {open && (
        <div className="multiselect-panel" role="listbox">
          {options.map((opt) => (
            <label className="multiselect-option" key={opt}>
              <input type="checkbox" checked={value.includes(opt)} onChange={() => toggle(opt)} />
              {opt}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
