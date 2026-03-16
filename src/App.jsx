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
import Mission from './pages/Mission.jsx';
import Transparency from './pages/Transparency.jsx';
import CandidateProfile from './pages/CandidateProfile.jsx';
import CandidateCompare from './pages/CandidateCompare.jsx';

export default function App() {
  const currentPage = useStore(s => s.currentPage);
  const language    = useStore(s => s.language);
  const answers     = useStore(s => s.answers);
  const profile     = useStore(s => s.profile);
  const t = createTranslator(language);

  const { saveAnswers, saveUserProfile, isAuthenticated } = useAuth();
  const saveTimer = useRef(null);

  // Debounced profile snapshot save — answers are now saved per-question in the store.
  // This just keeps the user_profiles table in sync after each answer batch.
  useEffect(() => {
    if (!isAuthenticated || !profile) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
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
    mission:          <Mission />,
    transparency:     <Transparency />,
    candidateProfile: <CandidateProfile />,
    compareView:      <CandidateCompare />,
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex flex-col">
      <Header t={t} />
      <main className="flex-1 page-transition" key={currentPage}>
        {pages[currentPage] ?? <Landing />}
      </main>
      <footer className="border-t border-gray-200 py-8 text-center bg-white">
        <p className="text-xs text-gray-400 tracking-wide">
          Poliscope
          <span className="mx-2 text-gray-300">·</span>
          {language === 'fr' ? 'Outil analytique et éducatif. Pas une recommandation de vote.' : 'An analytical and educational tool. Not a voting recommendation.'}
        </p>
      </footer>
    </div>
  );
}
