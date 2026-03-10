import React, { useEffect, useRef } from 'react';
import { useStore } from './store/useStore.js';
import { createTranslator } from './i18n/translations.js';
import { useAuth } from './lib/auth.jsx';
import Header from './components/Header.jsx';
import Landing from './pages/Landing.jsx';
import SelectTest from './pages/SelectTest.jsx';
import PriorityRanking from './pages/PriorityRanking.jsx';
import Questionnaire from './pages/Questionnaire.jsx';
import Profile from './pages/Profile.jsx';
import Elections from './pages/Elections.jsx';
import ElectionDetail from './pages/ElectionDetail.jsx';
import HistoricalFigures from './pages/HistoricalFigures.jsx';
import Auth from './pages/Auth.jsx';

export default function App() {
  const currentPage = useStore(s => s.currentPage);
  const language    = useStore(s => s.language);
  const answers     = useStore(s => s.answers);
  const profile     = useStore(s => s.profile);
  const t = createTranslator(language);

  const { saveAnswers, saveUserProfile, isAuthenticated } = useAuth();
  const saveTimer = useRef(null);

  // Auto-save to Supabase 3s after any answer change (debounced)
  useEffect(() => {
    if (!isAuthenticated || !profile) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveAnswers(answers);
      saveUserProfile(profile);
    }, 3000);
    return () => clearTimeout(saveTimer.current);
  }, [answers]); // eslint-disable-line react-hooks/exhaustive-deps

  const pages = {
    landing:        <Landing />,
    selectTest:     <SelectTest />,
    priorities:     <PriorityRanking />,
    questionnaire:  <Questionnaire />,
    profile:        <Profile />,
    elections:      <Elections />,
    electionDetail: <ElectionDetail />,
    figures:        <HistoricalFigures />,
    auth:           <Auth />,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header t={t} />
      <main className="flex-1 page-transition" key={currentPage}>
        {pages[currentPage] ?? <Landing />}
      </main>
      <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-400 bg-white">
        <p>Poliscope — {language === 'fr' ? 'Un outil analytique, pas une recommandation de vote.' : 'An analytical tool, not a voting recommendation.'}</p>
      </footer>
    </div>
  );
}
