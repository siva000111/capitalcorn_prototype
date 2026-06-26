import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import InvestorLibrary from './components/InvestorLibrary';
import StartupLibrary from './components/StartupLibrary';
import Matchmaking from './components/Matchmaking';
import InvestorHistory from './components/InvestorHistory';
import Reports from './components/Reports';
import Home from './components/Home';
import QuickSearch from './components/QuickSearch';
import ToastContainer from './components/ToastContainer';
import Settings from './components/Settings';
import type { Section } from './constants';

function App() {
  const [section, setSection] = useState<Section>('Home');
  const [jumpFundId, setJumpFundId] = useState<string | null>(null);
  const [jumpStartupId, setJumpStartupId] = useState<string | null>(null);
  const [jumpRelationshipFundId, setJumpRelationshipFundId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  function navigateToFundHistory(fundId: string) {
    setSection('Investor history');
    setJumpFundId(fundId);
  }

  function navigateToStartupLibrary(startupId: string) {
    setSection('Startup library');
    setJumpStartupId(startupId);
  }

  function navigateToRelationship(startupId: string, fundId: string) {
    setSection('Startup library');
    setJumpStartupId(startupId);
    setJumpRelationshipFundId(fundId);
  }

  return (
    <div className="app-shell">
      <Sidebar
        active={section}
        onSelect={setSection}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      />
      <main className="app-content">
        {section === 'Home' && <Home onSelectPair={navigateToRelationship} />}
        {section === 'Investor library' && <InvestorLibrary />}
        {section === 'Startup library' && (
          <StartupLibrary
            jumpStartupId={jumpStartupId}
            jumpRelationshipFundId={jumpRelationshipFundId}
            onJumpHandled={() => setJumpStartupId(null)}
            onRelationshipJumpHandled={() => setJumpRelationshipFundId(null)}
          />
        )}
        {section === 'Matchmaking & outreach' && <Matchmaking />}
        {section === 'Investor history' && (
          <InvestorHistory jumpFundId={jumpFundId} onJumpHandled={() => setJumpFundId(null)} />
        )}
        {section === 'Reports' && <Reports />}
      </main>

      {searchOpen && (
        <QuickSearch
          onClose={() => setSearchOpen(false)}
          onSelectFund={navigateToFundHistory}
          onSelectStartup={navigateToStartupLibrary}
        />
      )}

      {settingsOpen && <Settings onClose={() => setSettingsOpen(false)} />}

      <ToastContainer />
    </div>
  );
}

export default App;
