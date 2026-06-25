import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Placeholder from './components/Placeholder';
import InvestorLibrary from './components/InvestorLibrary';
import StartupLibrary from './components/StartupLibrary';
import Matchmaking from './components/Matchmaking';
import InvestorHistory from './components/InvestorHistory';
import Reports from './components/Reports';
import type { Section } from './constants';

const BUILT_SECTIONS: Section[] = [
  'Investor library',
  'Startup library',
  'Matchmaking & outreach',
  'Investor history',
  'Reports',
];

function App() {
  const [section, setSection] = useState<Section>('Home');

  return (
    <div className="app-shell">
      <Sidebar active={section} onSelect={setSection} />
      <main className="app-content">
        {section === 'Investor library' && <InvestorLibrary />}
        {section === 'Startup library' && <StartupLibrary />}
        {section === 'Matchmaking & outreach' && <Matchmaking />}
        {section === 'Investor history' && <InvestorHistory />}
        {section === 'Reports' && <Reports />}
        {!BUILT_SECTIONS.includes(section) && <Placeholder title={section} />}
      </main>
    </div>
  );
}

export default App;
