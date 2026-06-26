import { useMemo, useState } from 'react';
import { useAppStore } from '../store';
import { showToast } from '../toast';
import type { Fund, Pair, Startup } from '../types';

interface TaskUpdateFormProps {
  startup: Startup;
  fund: Fund;
  pair: Pair;
  onSaved?: () => void;
  onClose?: () => void;
  closeLabel?: string;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function TaskUpdateForm({ startup, fund, pair, onSaved, onClose, closeLabel = '✕ Close Mail' }: TaskUpdateFormProps) {
  const statuses = useAppStore((s) => s.statuses);
  const updatePair = useAppStore((s) => s.updatePair);
  const addCommEvent = useAppStore((s) => s.addCommEvent);
  const addStatus = useAppStore((s) => s.addStatus);

  const [taskStatus, setTaskStatus] = useState(pair.status ?? '');
  const [taskFollowUp, setTaskFollowUp] = useState(pair.followUpDate ?? '');
  const [taskNotes, setTaskNotes] = useState(pair.description ?? '');
  const [addingStatus, setAddingStatus] = useState(false);
  const [newStatusLabel, setNewStatusLabel] = useState('');

  const today = todayIso();

  const statusOptions = useMemo(() => {
    const sorted = [...statuses].sort((a, b) => a.order - b.order);
    return [{ value: '', label: '— Not yet contacted —' }, ...sorted.map((s) => ({ value: s.id, label: s.label }))];
  }, [statuses]);

  function handleAddStatus() {
    if (!newStatusLabel.trim()) return;
    const created = addStatus(newStatusLabel);
    setTaskStatus(created.id);
    setNewStatusLabel('');
    setAddingStatus(false);
  }

  function handleFollowUpChange(value: string) {
    if (value !== '' && value < today) {
      setTaskFollowUp(today);
      return;
    }
    setTaskFollowUp(value);
  }

  function handleSave() {
    updatePair(pair.id, {
      status: taskStatus === '' ? null : taskStatus,
      followUpDate: taskFollowUp === '' ? null : taskFollowUp,
      description: taskNotes,
    });
    addCommEvent(pair.id, 'note', new Date().toISOString(), 'Task updated', taskNotes);
    showToast('Task updated');
    onSaved?.();
  }

  return (
    <div className="task-update-form">
      <h4 className="task-update-title">📋 Create Task Update</h4>
      <p className="task-update-subtitle">Log this interaction for tracking and follow-up.</p>

      <div className="field-grid">
        <div className="field">
          <label>Startup</label>
          <div className="input readonly-display">{startup.name}</div>
        </div>
        <div className="field">
          <label>Investor</label>
          <div className="input readonly-display">{fund.fundName}</div>
        </div>
        <div className="field">
          <label htmlFor={`task-status-${pair.id}`}>Status</label>
          <div className="status-field-row">
            <select
              id={`task-status-${pair.id}`}
              className="select"
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-sm btn-icon"
              onClick={() => setAddingStatus(true)}
              aria-label="Add new status"
              title="Add new status"
            >
              +
            </button>
          </div>
          {addingStatus && (
            <div className="quick-add-status">
              <input
                className="input"
                placeholder="New status name"
                value={newStatusLabel}
                onChange={(e) => setNewStatusLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddStatus();
                  }
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    setAddingStatus(false);
                    setNewStatusLabel('');
                  }
                }}
                autoFocus
              />
              <button type="button" className="btn btn-sm btn-primary" onClick={handleAddStatus} disabled={!newStatusLabel.trim()}>
                Add
              </button>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => {
                  setAddingStatus(false);
                  setNewStatusLabel('');
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        <div className="field">
          <label htmlFor={`task-followup-${pair.id}`}>Follow-up date</label>
          <input
            id={`task-followup-${pair.id}`}
            className="input"
            type="date"
            min={today}
            value={taskFollowUp}
            onChange={(e) => handleFollowUpChange(e.target.value)}
          />
          <p className="field-hint">Only today or future dates allowed</p>
        </div>
      </div>

      <div className="field">
        <label htmlFor={`task-notes-${pair.id}`}>Next Step / Notes</label>
        <textarea
          id={`task-notes-${pair.id}`}
          className="input textarea"
          rows={3}
          value={taskNotes}
          onChange={(e) => setTaskNotes(e.target.value)}
        />
      </div>

      <div className="task-update-actions">
        <button type="button" className="btn btn-primary" onClick={handleSave}>
          💾 Save Task
        </button>
        {onClose && (
          <button type="button" className="btn" onClick={onClose}>
            {closeLabel}
          </button>
        )}
      </div>
    </div>
  );
}
