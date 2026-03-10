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

  // Hide nav links during questionnaire, but keep right-side controls visible
  const hideNav = currentPage === 'questionnaire';

  const handleSignOut = async () => {
    await signOut();
    navigate('landing');
  };

  return (
    <header className="bg-blue-950 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <button
            onClick={() => navigate('landing')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-7 h-7 bg-blue-400 rounded-full flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="white" strokeWidth="1.5"/>
                <path d="M7 3v8M3 7h8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-bold text-lg tracking-tight">Poliscope</span>
          </button>

          {/* Nav */}
          {!hideNav && (
            <nav className="hidden sm:flex items-center gap-1">
              {navItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => !item.disabled && navigate(item.page)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    currentPage === item.page
                      ? 'bg-blue-800 text-white'
                      : item.disabled
                      ? 'text-blue-400 cursor-not-allowed opacity-50'
                      : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                  }`}
                  title={item.disabled ? (language === 'fr' ? `Créez d'abord votre profil` : 'Complete your profile first') : ''}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          )}

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="text-xs font-semibold bg-blue-800 hover:bg-blue-700 px-3 py-1.5 rounded transition-colors text-blue-100"
            >
              {t('lang_switch')}
            </button>

            {/* Auth button — always visible */}
            {isLoggedIn ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigate('profile')}
                  className="text-xs font-semibold bg-blue-800 hover:bg-blue-700 px-3 py-1.5 rounded transition-colors text-blue-100 max-w-[140px] truncate"
                  title={userEmail ?? ''}
                >
                  {userEmail ?? (language === 'fr' ? 'Mon profil' : 'My profile')}
                </button>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-blue-400 hover:text-red-400 px-1.5 py-1.5 rounded transition-colors"
                  title={language === 'fr' ? 'Se déconnecter' : 'Sign out'}
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('auth')}
                className={`text-xs font-semibold px-3 py-1.5 rounded transition-colors ${
                  currentPage === 'auth'
                    ? 'bg-white text-blue-900'
                    : 'bg-blue-500 hover:bg-blue-400 text-white'
                }`}
              >
                {language === 'fr' ? 'Connexion' : 'Login'}
              </button>
            )}
          </div>
        </div>

        {/* Mobile nav */}
        {!hideNav && (
          <div className="sm:hidden flex gap-1 pb-2 overflow-x-auto">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => !item.disabled && navigate(item.page)}
                className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                  currentPage === item.page
                    ? 'bg-blue-800 text-white'
                    : item.disabled
                    ? 'text-blue-400 opacity-50'
                    : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                {item.label}
              </button>
            ))}
            {/* Mobile sign-in */}
            {!isLoggedIn && (
              <button
                onClick={() => navigate('auth')}
                className="px-3 py-1 rounded text-xs font-medium whitespace-nowrap bg-blue-500 hover:bg-blue-400 text-white"
              >
                {language === 'fr' ? 'Connexion' : 'Login'}
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
