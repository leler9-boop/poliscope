import React, { useEffect, useRef, lazy, Suspense } from 'react';
import { useStore } from './store/useStore.js';
import { createTranslator } from './i18n/translations.js';
import { useAuth } from './lib/auth.jsx';
import Header from './components/Header.jsx';

// Eager — core quiz flow (loaded immediately)
import Landing from './pages/Landing.jsx';
import SelectTest from './pages/SelectTest.jsx';
import PriorityRanking from './pages/PriorityRanking.jsx';
import Questionnaire from './pages/Questionnaire.jsx';

// Lazy — loaded only when the user navigates there
const Profile          = lazy(() => import('./pages/Profile.jsx'));
const Elections        = lazy(() => import('./pages/Elections.jsx'));
const ElectionDetail   = lazy(() => import('./pages/ElectionDetail.jsx'));
const HistoricalFigures = lazy(() => import('./pages/HistoricalFigures.jsx'));
const Auth             = lazy(() => import('./pages/Auth.jsx'));
const Mission          = lazy(() => import('./pages/Mission.jsx'));
const Transparency     = lazy(() => import('./pages/Transparency.jsx'));
const CandidateProfile = lazy(() => import('./pages/CandidateProfile.jsx'));
const CandidateCompare = lazy(() => import('./pages/CandidateCompare.jsx'));
const Beginner         = lazy(() => import('./pages/Beginner.jsx'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-6 h-6 rounded-full border-2 border-gray-200 border-t-gray-500 animate-spin" />
    </div>
  );
}

export default function App() {
  const currentPage = useStore(s => s.currentPage);
  const language    = useStore(s => s.language);
  const answers     = useStore(s => s.answers);
  const profile     = useStore(s => s.profile);
  const t = createTranslator(language);

  const { saveAnswers, saveUserProfile, isAuthenticated } = useAuth();
  const saveTimer = useRef(null);

  // Scroll to top on every page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentPage]);

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
    beginner:         <Beginner />,
  };

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex flex-col">
      <Header t={t} />
      <main className="flex-1 page-transition" key={currentPage}>
        <Suspense fallback={<PageLoader />}>
          {pages[currentPage] ?? <Landing />}
        </Suspense>
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
