import type { Contact } from '../types';
import InlineEditText from './InlineEditText';

interface ContactsEditorProps {
  contacts: Contact[];
  onChange: (next: Contact[]) => void;
}

const MAX_CONTACTS = 10;

export default function ContactsEditor({ contacts, onChange }: ContactsEditorProps) {
  function updateContact(i: number, patch: Partial<Contact>) {
    onChange(contacts.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }

  function removeContact(i: number) {
    onChange(contacts.filter((_, idx) => idx !== i));
  }

  function addContact() {
    if (contacts.length >= MAX_CONTACTS) return;
    onChange([...contacts, { name: null, email: null }]);
  }

  return (
    <details className="contacts-toggle">
      <summary>
        Contacts ({contacts.length}/{MAX_CONTACTS})
      </summary>
      <div className="contacts-editor">
        {contacts.map((c, i) => (
          <div className="contact-row card-actions-host" key={i}>
            <InlineEditText
              value={c.name ?? ''}
              placeholder={`Name ${i + 1}`}
              onSave={(v) => updateContact(i, { name: v === '' ? null : v })}
              ariaLabel={`name ${i + 1}`}
            />
            <InlineEditText
              type="email"
              value={c.email ?? ''}
              placeholder={`Email ${i + 1}`}
              onSave={(v) => updateContact(i, { email: v === '' ? null : v })}
              ariaLabel={`email ${i + 1}`}
            />
            <span className="row-actions">
              <button
                type="button"
                className="btn btn-sm btn-icon btn-danger"
                onClick={() => removeContact(i)}
                aria-label={`Remove contact ${i + 1}`}
              >
                ×
              </button>
            </span>
          </div>
        ))}
        {contacts.length < MAX_CONTACTS && (
          <button type="button" className="btn btn-sm" onClick={addContact}>
            + Add contact
          </button>
        )}
      </div>
    </details>
  );
}
