import type { Fund } from '../types';
import { useAppStore } from '../store';
import { SECTOR_TAGS, STAGES, LOCATION_TAGS, PRIORITIES, INVESTOR_TYPES } from '../constants';
import MultiSelect from './MultiSelect';
import ContactsEditor from './ContactsEditor';
import ConfirmButton from './ConfirmButton';
import InlineEditText from './InlineEditText';
import InlineEditSelect from './InlineEditSelect';
import EditableHeading from './EditableHeading';

interface FundCardProps {
  fund: Fund;
}

const PRIORITY_OPTIONS = [{ value: '', label: '—' }, ...PRIORITIES.map((p) => ({ value: p, label: p }))];
const INVESTOR_TYPE_OPTIONS = [{ value: '', label: '—' }, ...INVESTOR_TYPES.map((t) => ({ value: t, label: t }))];

export default function FundCard({ fund }: FundCardProps) {
  const updateFund = useAppStore((s) => s.updateFund);
  const deleteFund = useAppStore((s) => s.deleteFund);

  function patch(p: Partial<Fund>) {
    updateFund(fund.id, p);
  }

  return (
    <div className="fund-card card-actions-host">
      <div className="fund-card-header">
        <div>
          <EditableHeading
            value={fund.fundName}
            onSave={(v) => patch({ fundName: v })}
            ariaLabel="fund name"
            textClassName="editable-heading-text editable-heading-text--fund"
          />
          <span className="fund-id-tag">{fund.id}</span>
        </div>
        <span className="row-actions">
          <ConfirmButton label="Delete" confirmLabel="Confirm delete" onConfirm={() => deleteFund(fund.id)} />
        </span>
      </div>

      <div className="field-grid">
        <div className="field">
          <label>City</label>
          <InlineEditText value={fund.city} onSave={(v) => patch({ city: v })} ariaLabel="city" />
        </div>
        <div className="field">
          <label>Min ticket ($M)</label>
          <InlineEditText
            type="number"
            value={fund.minTicket === null ? '' : String(fund.minTicket)}
            onSave={(v) => patch({ minTicket: v === '' ? null : Number(v) })}
            ariaLabel="minimum ticket"
          />
        </div>
        <div className="field">
          <label>Max ticket ($M)</label>
          <InlineEditText
            type="number"
            value={fund.maxTicket === null ? '' : String(fund.maxTicket)}
            onSave={(v) => patch({ maxTicket: v === '' ? null : Number(v) })}
            ariaLabel="maximum ticket"
          />
        </div>
        <div className="field">
          <label>Priority</label>
          <InlineEditSelect
            value={fund.priority ?? ''}
            options={PRIORITY_OPTIONS}
            onSave={(v) => patch({ priority: v === '' ? null : (v as Fund['priority']) })}
            ariaLabel="priority"
          />
        </div>
        <div className="field">
          <label>Investor type</label>
          <InlineEditSelect
            value={fund.investorType ?? ''}
            options={INVESTOR_TYPE_OPTIONS}
            onSave={(v) => patch({ investorType: v === '' ? null : (v as Fund['investorType']) })}
            ariaLabel="investor type"
          />
        </div>
      </div>

      <div className="field-grid">
        <div className="field">
          <label>Focus areas</label>
          <MultiSelect
            options={SECTOR_TAGS}
            value={fund.focusAreas}
            onChange={(v) => patch({ focusAreas: v })}
            placeholder="No sectors selected"
          />
        </div>
        <div className="field">
          <label>Stages</label>
          <MultiSelect
            options={STAGES}
            value={fund.stages}
            onChange={(v) => patch({ stages: v })}
            placeholder="Unknown"
          />
        </div>
        <div className="field">
          <label>Locations</label>
          <MultiSelect
            options={LOCATION_TAGS}
            value={fund.locations}
            onChange={(v) => patch({ locations: v })}
            placeholder="Unknown"
          />
        </div>
      </div>

      <ContactsEditor contacts={fund.contacts} onChange={(v) => patch({ contacts: v })} />
    </div>
  );
}
