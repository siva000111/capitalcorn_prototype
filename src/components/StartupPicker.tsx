import { useAppStore } from '../store';

interface StartupPickerProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function StartupPicker({ selectedId, onSelect }: StartupPickerProps) {
  const startups = useAppStore((s) => s.startups);

  return (
    <div className="startup-picker">
      {startups.map((s) => (
        <button
          key={s.id}
          type="button"
          className={`startup-pick-row${s.id === selectedId ? ' active' : ''}`}
          onClick={() => onSelect(s.id)}
        >
          <span className="startup-pick-name">{s.name}</span>
          <span className="startup-pick-meta">
            {s.sector} · {s.stage} · ${s.raise}M · {s.location}
          </span>
        </button>
      ))}
    </div>
  );
}
