import { SECTIONS, type Section } from '../constants';
import { useAppStore } from '../store';
import ConfirmButton from './ConfirmButton';

interface SidebarProps {
  active: Section;
  onSelect: (section: Section) => void;
}

export default function Sidebar({ active, onSelect }: SidebarProps) {
  const resetToSeed = useAppStore((s) => s.resetToSeed);

  return (
    <aside className="sidebar">
      <div className="sidebar-wordmark">CAPITALCORN</div>
      <div className="sidebar-rule" />
      <nav className="sidebar-nav">
        {SECTIONS.map((section) => (
          <button
            key={section}
            type="button"
            className={`sidebar-item${section === active ? ' active' : ''}`}
            onClick={() => onSelect(section)}
            aria-current={section === active ? 'page' : undefined}
          >
            {section}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <ConfirmButton
          label="Reset to seed"
          confirmLabel="Confirm reset"
          className="btn btn-sm"
          onConfirm={resetToSeed}
        />
      </div>
    </aside>
  );
}
