import { useState } from 'react';
import { useAppStore } from '../store';
import { showToast } from '../toast';
import type { CommEventType } from '../types';

interface EmailComposeFormProps {
  pairId: string;
  account?: string;
  onLogged?: () => void;
}

function nowForInput(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export default function EmailComposeForm({ pairId, account, onLogged }: EmailComposeFormProps) {
  const addCommEvent = useAppStore((s) => s.addCommEvent);

  const [type, setType] = useState<CommEventType>('outreach_sent');
  const [date, setDate] = useState(nowForInput);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  function handleSave() {
    addCommEvent(pairId, type, new Date(date).toISOString(), subject, body, account);
    showToast('Email logged');
    setSubject('');
    setBody('');
    setDate(nowForInput());
    onLogged?.();
  }

  return (
    <div className="compose-form">
      <div className="field-grid">
        <div className="field">
          <label htmlFor={`compose-type-${pairId}`}>Type</label>
          <select
            id={`compose-type-${pairId}`}
            className="select"
            value={type}
            onChange={(e) => setType(e.target.value as CommEventType)}
          >
            <option value="outreach_sent">Outreach sent</option>
            <option value="reply_received">Reply received</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor={`compose-date-${pairId}`}>Date</label>
          <input
            id={`compose-date-${pairId}`}
            className="input"
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor={`compose-subject-${pairId}`}>Subject</label>
        <input
          id={`compose-subject-${pairId}`}
          className="input"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
        />
      </div>
      <div className="field">
        <label htmlFor={`compose-body-${pairId}`}>Body</label>
        <textarea
          id={`compose-body-${pairId}`}
          className="input textarea"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Email body…"
          rows={3}
        />
      </div>
      <div className="compose-actions">
        <button type="button" className="btn btn-primary btn-sm" onClick={handleSave} disabled={!subject.trim()}>
          Save email
        </button>
      </div>
    </div>
  );
}
