import React from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';
import { useAuth } from '../lib/auth.jsx';

export default function Header() {
  const language    = useStore(s => s.language);
  const setLanguage = useStore(s => s.setLanguage);
  const navigate    = useStore(s => s.navigate);
  const profile     = useStore(s => s.profile);
  const userId      = useStore(s => s.userId);
  const userEmail   = useStore(s => s.userEmail);
  const t = createTranslator(language);

  const { signOut } = useAuth();
  const { pathname } = useLocation();
  const isLoggedIn = Boolean(userId);

  const navItems = [
    { key: 'home',      label: t('nav_home'),      page: 'landing',   path: '/' },
    { key: 'profile',   label: t('nav_profile'),   page: 'profile',   path: '/profile',   disabled: !profile },
    { key: 'elections', label: t('nav_elections'), page: 'elections', path: '/elections' },
    { key: 'figures',        label: t('nav_figures'),        page: 'figures',        path: '/figures' },
    { key: 'french_figures', label: t('nav_french_figures'), page: 'frenchFigures',  path: '/france' },
  ];

  const infoItems = [
    { key: 'beginner',     label: t('nav_beginner'),     page: 'beginner',     path: '/learn',        highlight: true },
    { key: 'mission',      label: t('nav_mission'),      page: 'mission',      path: '/mission' },
    { key: 'transparency', label: t('nav_transparency'), page: 'transparency', path: '/transparency' },
  ];

  // Active state based on URL, not store
  const isActive = (path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  const hideNav = pathname === '/quiz';

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
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              <circle cx="16" cy="16" r="15" fill="#111827"/>
              <path d="M16 16 L16 2 A14 14 0 0 1 25.9 6.1 Z" fill="#f59e0b" opacity="0.9"/>
              <path d="M16 16 L25.9 6.1 A14 14 0 0 1 30 16 Z" fill="#8b5cf6" opacity="0.9"/>
              <path d="M16 16 L30 16 A14 14 0 0 1 25.9 25.9 Z" fill="#ef4444" opacity="0.9"/>
              <path d="M16 16 L25.9 25.9 A14 14 0 0 1 16 30 Z" fill="#6b7280" opacity="0.9"/>
              <path d="M16 16 L16 30 A14 14 0 0 1 6.1 25.9 Z" fill="#10b981" opacity="0.9"/>
              <path d="M16 16 L6.1 25.9 A14 14 0 0 1 2 16 Z" fill="#3b82f6" opacity="0.9"/>
              <path d="M16 16 L2 16 A14 14 0 0 1 6.1 6.1 Z" fill="#06b6d4" opacity="0.9"/>
              <path d="M16 16 L6.1 6.1 A14 14 0 0 1 16 2 Z" fill="#f97316" opacity="0.9"/>
              <circle cx="16" cy="16" r="5" fill="white"/>
              <circle cx="16" cy="16" r="2" fill="#111827"/>
            </svg>
            <span className="font-bold text-base tracking-tight text-gray-900">Poliscop</span>
          </button>

          {/* Desktop nav */}
          {!hideNav && (
            <nav className="hidden sm:flex items-center">
              {navItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => !item.disabled && navigate(item.page)}
                  className={`relative px-4 py-1.5 text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-gray-900'
                      : item.disabled
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                  title={item.disabled ? (language === 'fr' ? `Créez d'abord votre profil` : 'Complete your profile first') : ''}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <span className="absolute bottom-0 left-4 right-4 h-px bg-gray-900" />
                  )}
                </button>
              ))}
              <span className="mx-1 text-gray-200 select-none">|</span>
              {infoItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => navigate(item.page)}
                  className={`relative px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive(item.path)
                      ? item.highlight ? 'text-amber-700' : 'text-gray-900'
                      : item.highlight
                      ? 'text-amber-600 hover:text-amber-800'
                      : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <span className={`absolute bottom-0 left-3 right-3 h-px ${item.highlight ? 'bg-amber-600' : 'bg-gray-900'}`} />
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
                  isActive('/auth')
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
                  isActive(item.path)
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
                  isActive(item.path)
                    ? item.highlight ? 'text-amber-700 bg-amber-50' : 'text-gray-900 bg-gray-100'
                    : item.highlight
                    ? 'text-amber-600 hover:text-amber-800 hover:bg-amber-50'
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
