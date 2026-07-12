import React, { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore.js';
import { createTranslator } from './i18n/translations.js';
import { useAuth } from './lib/auth.jsx';
import { setRouterNavigate } from './lib/router.js';
import Header from './components/Header.jsx';
import OnboardingModal from './components/OnboardingModal.jsx';
import SyncConflictModal from './components/SyncConflictModal.jsx';
import Toast from './components/Toast.jsx';

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
const FrenchFigures     = lazy(() => import('./pages/FrenchFigures.jsx'));
const Auth             = lazy(() => import('./pages/Auth.jsx'));
const Mission          = lazy(() => import('./pages/Mission.jsx'));
const Transparency     = lazy(() => import('./pages/Transparency.jsx'));
const CandidateProfile = lazy(() => import('./pages/CandidateProfile.jsx'));
const CandidateCompare = lazy(() => import('./pages/CandidateCompare.jsx'));
const Beginner         = lazy(() => import('./pages/Beginner.jsx'));
const LearnHub         = lazy(() => import('./pages/LearnHub.jsx'));
const LearnPage        = lazy(() => import('./pages/LearnPage.jsx'));
const LearnDico        = lazy(() => import('./pages/LearnDico.jsx'));
const LearnAcademy     = lazy(() => import('./pages/LearnAcademy.jsx'));
const Privacy          = lazy(() => import('./pages/Privacy.jsx'));
const Terms            = lazy(() => import('./pages/Terms.jsx'));
const FounderDashboard = lazy(() => import('./pages/FounderDashboard.jsx'));

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
  const language        = useStore(s => s.language);
  const answers         = useStore(s => s.answers);
  const profile         = useStore(s => s.profile);
  const needsOnboarding = useStore(s => s.needsOnboarding);
  const syncConflict    = useStore(s => s.syncConflict);
  const hasConsent      = useStore(s => s.consent?.politicalData === true);
  const t = createTranslator(language);

  const { saveUserProfile, isAuthenticated } = useAuth();
  const saveTimer = useRef(null);
  const [toast, setToast] = useState(null);

  // Debounced profile save to Supabase.
  // Gated on hasConsent: without it, saveUserProfile() internally no-ops
  // (see hasPoliticalDataConsent() in auth.jsx), but skipping the call here
  // too avoids a pointless request and, more importantly, a misleading
  // "save failed" toast for a user who deliberately declined consent — that's
  // expected behavior, not an error. Re-runs on hasConsent so granting
  // consent triggers an immediate first sync of the already-computed profile.
  useEffect(() => {
    if (!isAuthenticated || !profile || !hasConsent) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      const { error } = await saveUserProfile(profile);
      if (error) {
        setToast({ message: '⚠️ Sauvegarde échouée', type: 'error' });
      } else {
        setToast({ message: '✓ Profil sauvegardé', type: 'success' });
      }
    }, 3000);
    return () => clearTimeout(saveTimer.current);
  }, [answers, hasConsent]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-[#f7f7f5] flex flex-col">
      <NavigationBridge />
      <ScrollToTop />
      <Header t={t} />
      {syncConflict && <SyncConflictModal />}
      {needsOnboarding && !syncConflict && <OnboardingModal />}
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
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
            <Route path="/france"       element={<FrenchFigures />} />
            <Route path="/auth"         element={<Auth />} />
            <Route path="/mission"      element={<Mission />} />
            <Route path="/transparency" element={<Transparency />} />
            <Route path="/learn"          element={<LearnHub />} />
            <Route path="/learn/explorer" element={<Beginner />} />
            <Route path="/learn/dico"     element={<LearnDico />} />
            <Route path="/learn/academy"  element={<LearnAcademy />} />
            <Route path="/learn/:section/:slug" element={<LearnPage />} />
            <Route path="/privacy"      element={<Privacy />} />
            <Route path="/terms"        element={<Terms />} />
            <Route path="/founder"      element={<FounderDashboard />} />
            <Route path="*"             element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <footer className="border-t border-gray-200 py-8 text-center bg-white">
        <p className="text-xs text-gray-400 tracking-wide">
          Poliscop
          <span className="mx-2 text-gray-300">·</span>
          {language === 'fr'
            ? 'Outil analytique et éducatif. Pas une recommandation de vote.'
            : 'An analytical and educational tool. Not a voting recommendation.'}
        </p>
        <p className="mt-2 text-xs text-gray-300 space-x-3">
          <a href="/privacy" className="hover:text-gray-500 transition-colors">
            {language === 'fr' ? 'Confidentialité' : 'Privacy Policy'}
          </a>
          <span>·</span>
          <a href="/terms" className="hover:text-gray-500 transition-colors">
            {language === 'fr' ? 'CGU' : 'Terms of Service'}
          </a>
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
