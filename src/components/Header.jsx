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
    { key: 'home',          label: t('nav_home'),          page: 'landing',      path: '/' },
    { key: 'profile',       label: t('nav_profile'),       page: 'profile',      path: '/profile',  disabled: !profile },
    { key: 'elections',     label: t('nav_elections'),     page: 'elections',    path: '/elections' },
    { key: 'figures',       label: t('nav_figures'),       page: 'figures',      path: '/figures' },
    { key: 'french_figures',label: t('nav_french_figures'),page: 'frenchFigures',path: '/france' },
  ];

  const infoItems = [
    { key: 'beginner',     label: t('nav_beginner'),     page: 'beginner',     path: '/learn',        highlight: true },
    { key: 'mission',      label: t('nav_mission'),      page: 'mission',      path: '/mission' },
    { key: 'transparency', label: t('nav_transparency'), page: 'transparency', path: '/transparency' },
  ];

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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* ── Logo ── */}
          <button
            onClick={() => navigate('landing')}
            className="flex items-center gap-2 hover:opacity-70 transition-opacity shrink-0"
          >
            {/* Poliscop "p" lettermark */}
            <svg width="24" height="29" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="10" y="14" width="23" height="82" rx="5" fill="#5270A0"/>
              <polygon points="10,96 33,96 21.5,112" fill="#5270A0"/>
              <circle cx="54" cy="46" r="40" fill="#5270A0"/>
              <circle cx="56" cy="44" r="26" fill="white"/>
              <circle cx="56" cy="44" r="13" fill="#5270A0"/>
            </svg>
            <span className="font-bold text-[15px] tracking-tight" style={{ color: '#1A2845' }}>
              Poliscop
            </span>
          </button>

          {/* ── Navigation desktop ── */}
          {!hideNav && (
            <nav className="hidden sm:flex items-center">
              {navItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => !item.disabled && navigate(item.page)}
                  className={`relative px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-slate-900'
                      : item.disabled
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                  title={item.disabled ? (language === 'fr' ? 'Créez d\'abord votre profil' : 'Complete your profile first') : ''}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-px bg-slate-900 rounded-full" />
                  )}
                </button>
              ))}

              <span className="mx-1 text-slate-200 select-none text-xs">|</span>

              {infoItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => navigate(item.page)}
                  className={`relative px-3 py-1.5 text-[13px] font-medium transition-colors whitespace-nowrap ${
                    isActive(item.path)
                      ? item.highlight ? 'text-amber-700' : 'text-slate-900'
                      : item.highlight
                      ? 'text-amber-600 hover:text-amber-800'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <span className={`absolute bottom-0 left-3 right-3 h-px rounded-full ${
                      item.highlight ? 'bg-amber-600' : 'bg-slate-900'
                    }`} />
                  )}
                </button>
              ))}
            </nav>
          )}

          {/* ── Droite : langue + auth ── */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Toggle langue */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
              className="text-[12px] font-semibold text-slate-400 hover:text-slate-700 px-2 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
            >
              {t('lang_switch')}
            </button>

            {/* Auth */}
            {isLoggedIn ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigate('profile')}
                  className="text-[12px] font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors max-w-[130px] truncate"
                  title={userEmail ?? ''}
                >
                  {userEmail ?? (language === 'fr' ? 'Mon profil' : 'My profile')}
                </button>
                <button
                  onClick={handleSignOut}
                  className="text-[12px] text-slate-300 hover:text-red-400 px-1.5 py-1.5 rounded transition-colors"
                  title={language === 'fr' ? 'Se déconnecter' : 'Sign out'}
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('auth')}
                className={`text-[12px] font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                  isActive('/auth')
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {language === 'fr' ? 'Connexion' : 'Sign in'}
              </button>
            )}
          </div>
        </div>

        {/* ── Navigation mobile ── */}
        {!hideNav && (
          <div className="sm:hidden flex gap-0.5 pb-2 overflow-x-auto scrollbar-none">
            {[...navItems, ...infoItems].map(item => (
              <button
                key={item.key}
                onClick={() => !item.disabled && navigate(item.page)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive(item.path)
                    ? item.highlight
                      ? 'text-amber-700 bg-amber-50'
                      : 'text-slate-900 bg-slate-100'
                    : item.disabled
                    ? 'text-slate-300'
                    : item.highlight
                    ? 'text-amber-600 hover:bg-amber-50'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            {!isLoggedIn && (
              <button
                onClick={() => navigate('auth')}
                className="px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap text-slate-500 hover:text-slate-900 hover:bg-slate-50"
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
