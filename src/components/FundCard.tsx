import type { Fund } from '../types';
import { useAppStore } from '../store';
import { SECTOR_TAGS, STAGES, LOCATION_TAGS, PRIORITIES, INVESTOR_TYPES } from '../constants';
import MultiSelect from './MultiSelect';
import ContactsEditor from './ContactsEditor';
import ConfirmButton from './ConfirmButton';

interface FundCardProps {
  fund: Fund;
}

export default function FundCard({ fund }: FundCardProps) {
  const updateFund = useAppStore((s) => s.updateFund);
  const deleteFund = useAppStore((s) => s.deleteFund);

  function patch(p: Partial<Fund>) {
    updateFund(fund.id, p);
  }

  return (
    <div className="fund-card">
      <div className="fund-card-header">
        <div>
          <input
            className="fund-name-input"
            value={fund.fundName}
            onChange={(e) => patch({ fundName: e.target.value })}
            aria-label="Fund name"
          />
          <span className="fund-id-tag">{fund.id}</span>
        </div>
        <ConfirmButton label="Delete" confirmLabel="Confirm delete" onConfirm={() => deleteFund(fund.id)} />
      </div>

      <div className="field-grid">
        <div className="field">
          <label htmlFor={`${fund.id}-city`}>City</label>
          <input
            id={`${fund.id}-city`}
            className="input"
            value={fund.city}
            onChange={(e) => patch({ city: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor={`${fund.id}-min`}>Min ticket ($M)</label>
          <input
            id={`${fund.id}-min`}
            className="input"
            type="number"
            value={fund.minTicket ?? ''}
            onChange={(e) => patch({ minTicket: e.target.value === '' ? null : Number(e.target.value) })}
          />
        </div>
        <div className="field">
          <label htmlFor={`${fund.id}-max`}>Max ticket ($M)</label>
          <input
            id={`${fund.id}-max`}
            className="input"
            type="number"
            value={fund.maxTicket ?? ''}
            onChange={(e) => patch({ maxTicket: e.target.value === '' ? null : Number(e.target.value) })}
          />
        </div>
        <div className="field">
          <label htmlFor={`${fund.id}-priority`}>Priority</label>
          <select
            id={`${fund.id}-priority`}
            className="select"
            value={fund.priority ?? ''}
            onChange={(e) =>
              patch({ priority: e.target.value === '' ? null : (e.target.value as Fund['priority']) })
            }
          >
            <option value="">—</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor={`${fund.id}-type`}>Investor type</label>
          <select
            id={`${fund.id}-type`}
            className="select"
            value={fund.investorType ?? ''}
            onChange={(e) =>
              patch({ investorType: e.target.value === '' ? null : (e.target.value as Fund['investorType']) })
            }
          >
            <option value="">—</option>
            {INVESTOR_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
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
