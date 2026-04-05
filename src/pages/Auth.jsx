// Auth page — optional sign-in / sign-up
// The app works fully without authenticating.
import React, { useState } from 'react';
import { useAuth } from '../lib/auth.jsx';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';

export default function Auth() {
  const { signIn, signUp, signInWithGoogle, isSupabaseEnabled } = useAuth();
  const language = useStore(s => s.language);
  const navigate = useStore(s => s.navigate);
  const t = createTranslator(language);

  const [mode, setMode]           = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const fr = language === 'fr';

  if (!isSupabaseEnabled) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <p className="text-amber-800 font-medium mb-2">
            {fr ? 'Authentification non disponible' : 'Authentication not available'}
          </p>
          <p className="text-amber-700 text-sm mb-4">
            {fr
              ? 'La connexion Supabase n\'est pas configurée. Vous pouvez utiliser Poliscop en mode invité sans vous connecter.'
              : 'Supabase connection is not configured. You can use Poliscop as a guest without signing in.'}
          </p>
          <button
            onClick={() => navigate('landing')}
            className="text-blue-600 font-medium text-sm"
          >
            ← {fr ? 'Retour à l\'accueil' : 'Back to home'}
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const fn = mode === 'signup' ? signUp : signIn;
      const { error: authError } = await fn(email, password);

      if (authError) {
        setError(authError.message);
      } else if (mode === 'signup') {
        setSuccess(fr
          ? 'Compte créé ! Vérifiez votre email pour confirmer.'
          : 'Account created! Check your email to confirm.');
      } else {
        navigate('profile');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {mode === 'signup'
            ? (fr ? 'Créer un compte' : 'Create account')
            : (fr ? 'Se connecter' : 'Sign in')}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {fr
            ? 'Pour sauvegarder votre profil politique et y accéder depuis n\'importe quel appareil.'
            : 'To save your political profile and access it from any device.'}
        </p>

        {/* Google sign-in */}
        <button
          type="button"
          disabled={googleLoading}
          onClick={async () => {
            setGoogleLoading(true);
            setError('');
            const { error: e } = await signInWithGoogle();
            if (e) { setError(e.message); setGoogleLoading(false); }
            // On success, the page redirects to Google — no further action needed
          }}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-4 disabled:opacity-60"
        >
          {/* Google logo */}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          {googleLoading
            ? (fr ? 'Redirection…' : 'Redirecting…')
            : (fr ? 'Continuer avec Google' : 'Continue with Google')}
        </button>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2">
            <span className="bg-white px-2">{fr ? 'ou par email' : 'or with email'}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {fr ? 'Mot de passe' : 'Password'}
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm text-green-700">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors"
          >
            {loading
              ? (fr ? 'Chargement…' : 'Loading…')
              : mode === 'signup'
                ? (fr ? 'Créer mon compte' : 'Create account')
                : (fr ? 'Se connecter' : 'Sign in')}
          </button>
        </form>

        <div className="mt-5 text-center space-y-2">
          <button
            onClick={() => { setMode(m => m === 'signin' ? 'signup' : 'signin'); setError(''); setSuccess(''); }}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {mode === 'signin'
              ? (fr ? 'Pas de compte ? Créer un compte' : 'No account? Create one')
              : (fr ? 'Déjà un compte ? Se connecter' : 'Already have an account? Sign in')}
          </button>
          <br />
          <button
            onClick={() => navigate('landing')}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            {fr ? 'Continuer sans compte →' : 'Continue without account →'}
          </button>
        </div>
      </div>
    </div>
  );
}
