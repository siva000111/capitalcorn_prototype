import { useState } from 'react';
import MatchTab from './MatchTab';
import OutreachTab from './OutreachTab';

type Tab = 'Match' | 'Outreach';

const TABS: Tab[] = ['Match', 'Outreach'];

interface MatchmakingProps {
  onOpenFund: (fundId: string) => void;
}

export default function Matchmaking({ onOpenFund }: MatchmakingProps) {
  const [tab, setTab] = useState<Tab>('Match');

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="page-title">Matchmaking & outreach</h1>
          <p className="page-subtitle">Find eligible funds for a startup, confirm matches, and prep outreach.</p>
        </div>
      </div>

      <div className="tab-bar">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            className={`tab-button${t === tab ? ' active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Match' ? <MatchTab onOpenFund={onOpenFund} /> : <OutreachTab onOpenFund={onOpenFund} />}
    </>
  );
}
