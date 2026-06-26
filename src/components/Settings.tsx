import { useState } from 'react';
import { useAppStore } from '../store';
import InlineEditText from './InlineEditText';
import ConfirmButton from './ConfirmButton';

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const statuses = useAppStore((s) => s.statuses);
  const countPairsUsingStatus = useAppStore((s) => s.countPairsUsingStatus);
  const updateStatus = useAppStore((s) => s.updateStatus);
  const addStatus = useAppStore((s) => s.addStatus);
  const deleteStatus = useAppStore((s) => s.deleteStatus);
  const reorderStatuses = useAppStore((s) => s.reorderStatuses);

  const sorted = [...statuses].sort((a, b) => a.order - b.order);
  const [dragId, setDragId] = useState<string | null>(null);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);

  function handleDelete(statusId: string) {
    const count = countPairsUsingStatus(statusId);
    if (count > 0) {
      setBlockedMessage(`${count} pair${count === 1 ? '' : 's'} use this status — change their status first.`);
      return;
    }
    setBlockedMessage(null);
    deleteStatus(statusId);
  }

  function handleDrop(targetId: string) {
    if (!dragId || dragId === targetId) {
      setDragId(null);
      return;
    }
    const ids = sorted.map((s) => s.id);
    const fromIdx = ids.indexOf(dragId);
    const toIdx = ids.indexOf(targetId);
    ids.splice(fromIdx, 1);
    ids.splice(toIdx, 0, dragId);
    reorderStatuses(ids);
    setDragId(null);
  }

  return (
    <div
      className="search-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="settings-panel" onKeyDown={(e) => e.key === 'Escape' && onClose()}>
        <div className="settings-header">
          <h2 className="step-title">Statuses</h2>
          <button type="button" className="btn btn-sm" onClick={onClose}>
            Close
          </button>
        </div>

        {blockedMessage && <p className="settings-blocked-message">{blockedMessage}</p>}

        <div className="settings-status-list">
          {sorted.map((status) => (
            <div
              key={status.id}
              className={`settings-status-row${dragId === status.id ? ' dragging' : ''}`}
              draggable
              onDragStart={() => setDragId(status.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(status.id)}
              onDragEnd={() => setDragId(null)}
            >
              <span className="settings-drag-handle" aria-hidden="true" title="Drag to reorder">
                ⠿
              </span>
              <span className={`color-dot color-dot--${status.color}`} aria-hidden="true" />
              <span className="settings-status-label">
                <InlineEditText
                  value={status.label}
                  onSave={(v) => updateStatus(status.id, { label: v })}
                  ariaLabel="status label"
                />
              </span>
              <label className="settings-closed-toggle">
                <input
                  type="checkbox"
                  checked={status.closed}
                  onChange={(e) => updateStatus(status.id, { closed: e.target.checked })}
                />
                Closed
              </label>
              <ConfirmButton label="Delete" confirmLabel="Confirm delete" onConfirm={() => handleDelete(status.id)} />
            </div>
          ))}
        </div>

        <button type="button" className="btn btn-sm" onClick={() => addStatus()}>
          + Add status
        </button>
      </div>
    </div>
  );
}
