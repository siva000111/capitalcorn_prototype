import type { Contact } from '../types';

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
      <summary>Contacts ({contacts.length}/{MAX_CONTACTS})</summary>
      <div className="contacts-editor">
        {contacts.map((c, i) => (
          <div className="contact-row" key={i}>
            <input
              className="input"
              placeholder={`Name ${i + 1}`}
              value={c.name ?? ''}
              onChange={(e) => updateContact(i, { name: e.target.value === '' ? null : e.target.value })}
            />
            <input
              className="input"
              placeholder={`Email ${i + 1}`}
              value={c.email ?? ''}
              onChange={(e) => updateContact(i, { email: e.target.value === '' ? null : e.target.value })}
            />
            <button
              type="button"
              className="btn btn-sm btn-icon btn-danger"
              onClick={() => removeContact(i)}
              aria-label={`Remove contact ${i + 1}`}
            >
              ×
            </button>
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
