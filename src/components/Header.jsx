import React from 'react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';
import { useAuth } from '../lib/auth.jsx';

export default function Header() {
  const language    = useStore(s => s.language);
  const setLanguage = useStore(s => s.setLanguage);
  const navigate    = useStore(s => s.navigate);
  const profile     = useStore(s => s.profile);
  const currentPage = useStore(s => s.currentPage);
  const userId      = useStore(s => s.userId);
  const userEmail   = useStore(s => s.userEmail);
  const t = createTranslator(language);

  const { signOut } = useAuth();
  const isLoggedIn  = Boolean(userId);

  const navItems = [
    { key: 'home',      label: t('nav_home'),       page: 'landing' },
    { key: 'profile',   label: t('nav_profile'),    page: 'profile',    disabled: !profile },
    { key: 'elections', label: t('nav_elections'),  page: 'elections' },
    { key: 'figures',   label: t('nav_figures'),    page: 'figures' },
  ];

  const infoItems = [
    { key: 'beginner',     label: t('nav_beginner'),     page: 'beginner' },
    { key: 'mission',      label: t('nav_mission'),      page: 'mission' },
    { key: 'transparency', label: t('nav_transparency'), page: 'transparency' },
  ];

  const hideNav = currentPage === 'questionnaire';

  const handleSignOut = async () => {
    await signOut();
    navigate('landing');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <button
            onClick={() => navigate('landing')}
            className="flex items-center gap-2.5 hover:opacity-70 transition-opacity"
          >
            <div className="w-6 h-6 rounded-full border-2 border-gray-900 flex items-center justify-center flex-shrink-0">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <circle cx="5" cy="5" r="4" stroke="#111827" strokeWidth="1.2"/>
                <path d="M5 2v6M2 5h6" stroke="#111827" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-bold text-base tracking-tight text-gray-900">Poliscope</span>
          </button>

          {/* Desktop nav */}
          {!hideNav && (
            <nav className="hidden sm:flex items-center">
              {navItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => !item.disabled && navigate(item.page)}
                  className={`relative px-4 py-1.5 text-sm font-medium transition-colors ${
                    currentPage === item.page
                      ? 'text-gray-900'
                      : item.disabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  title={item.disabled ? (language === 'fr' ? `Créez d'abord votre profil` : 'Complete your profile first') : ''}
                >
                  {item.label}
                  {currentPage === item.page && (
                    <span className="absolute bottom-0 left-4 right-4 h-px bg-gray-900" />
                  )}
                </button>
              ))}
              <span className="mx-1 text-gray-200 select-none">|</span>
              {infoItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => navigate(item.page)}
                  className={`relative px-3 py-1.5 text-sm font-medium transition-colors ${
                    currentPage === item.page
                      ? 'text-gray-900'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {item.label}
                  {currentPage === item.page && (
                    <span className="absolute bottom-0 left-3 right-3 h-px bg-gray-900" />
                  )}
                </button>
              ))}
            </nav>
          )}

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="text-xs font-semibold text-gray-500 hover:text-gray-900 px-2.5 py-1.5 rounded-md hover:bg-gray-100 transition-colors"
            >
              {t('lang_switch')}
            </button>

            {/* Auth */}
            {isLoggedIn ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigate('profile')}
                  className="text-xs font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-md border border-gray-200 hover:border-gray-300 transition-colors max-w-[140px] truncate"
                  title={userEmail ?? ''}
                >
                  {userEmail ?? (language === 'fr' ? 'Mon profil' : 'My profile')}
                </button>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-gray-400 hover:text-red-500 px-1.5 py-1.5 rounded transition-colors"
                  title={language === 'fr' ? 'Se déconnecter' : 'Sign out'}
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('auth')}
                className={`text-xs font-semibold px-3 py-1.5 rounded-md border transition-colors ${
                  currentPage === 'auth'
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {language === 'fr' ? 'Connexion' : 'Sign in'}
              </button>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        {!hideNav && (
          <div className="sm:hidden flex gap-0.5 pb-2 overflow-x-auto">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => !item.disabled && navigate(item.page)}
                className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                  currentPage === item.page
                    ? 'text-gray-900 bg-gray-100'
                    : item.disabled
                    ? 'text-gray-300'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            {infoItems.map(item => (
              <button
                key={item.key}
                onClick={() => navigate(item.page)}
                className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                  currentPage === item.page
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-400 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            {!isLoggedIn && (
              <button
                onClick={() => navigate('auth')}
                className="px-3 py-1 rounded text-xs font-medium whitespace-nowrap text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              >
                {language === 'fr' ? 'Connexion' : 'Sign in'}
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
