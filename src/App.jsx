import React, { useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore.js';
import { createTranslator } from './i18n/translations.js';
import { useAuth } from './lib/auth.jsx';
import { setRouterNavigate } from './lib/router.js';
import Header from './components/Header.jsx';

// Eager — core quiz flow
import Landing from './pages/Landing.jsx';
import SelectTest from './pages/SelectTest.jsx';
import PriorityRanking from './pages/PriorityRanking.jsx';
import Questionnaire from './pages/Questionnaire.jsx';

// Lazy — loaded on demand
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

/** Feeds react-router's navigate into the module-level bridge used by the store. */
function NavigationBridge() {
  const navigate = useNavigate();
  useEffect(() => { setRouterNavigate(navigate); }, [navigate]);
  return null;
}

/** Scrolls to top on every route change. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
}

/** Guard: redirect to /test if the quiz queue is empty (e.g. direct URL access). */
function QuizGuard({ children }) {
  const questionsQueue = useStore(s => s.questionsQueue);
  if (questionsQueue.length === 0) return <Navigate to="/test" replace />;
  return children;
}

/** Guard: redirect to / if no profile yet. */
function ProfileGuard({ children }) {
  const profile = useStore(s => s.profile);
  if (!profile) return <Navigate to="/" replace />;
  return children;
}

function AppInner() {
  const language = useStore(s => s.language);
  const answers  = useStore(s => s.answers);
  const profile  = useStore(s => s.profile);
  const t = createTranslator(language);

  const { saveUserProfile, isAuthenticated } = useAuth();
  const saveTimer = useRef(null);

  // Debounced profile save to Supabase
  useEffect(() => {
    if (!isAuthenticated || !profile) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => { saveUserProfile(profile); }, 3000);
    return () => clearTimeout(saveTimer.current);
  }, [answers]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex flex-col">
      <NavigationBridge />
      <ScrollToTop />
      <Header t={t} />
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"             element={<Landing />} />
            <Route path="/test"         element={<SelectTest />} />
            <Route path="/priorities"   element={<PriorityRanking />} />
            <Route path="/quiz"         element={<QuizGuard><Questionnaire /></QuizGuard>} />
            <Route path="/profile"      element={<ProfileGuard><Profile /></ProfileGuard>} />
            <Route path="/elections"    element={<Elections />} />
            <Route path="/elections/:id" element={<ElectionDetail />} />
            <Route path="/candidates/:id" element={<CandidateProfile />} />
            <Route path="/compare/:id1/:id2" element={<CandidateCompare />} />
            <Route path="/figures"      element={<HistoricalFigures />} />
            <Route path="/auth"         element={<Auth />} />
            <Route path="/mission"      element={<Mission />} />
            <Route path="/transparency" element={<Transparency />} />
            <Route path="/learn"        element={<Beginner />} />
            <Route path="*"             element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="border-t border-gray-200 py-8 text-center bg-white">
        <p className="text-xs text-gray-400 tracking-wide">
          Poliscope
          <span className="mx-2 text-gray-300">·</span>
          {language === 'fr'
            ? 'Outil analytique et éducatif. Pas une recommandation de vote.'
            : 'An analytical and educational tool. Not a voting recommendation.'}
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
