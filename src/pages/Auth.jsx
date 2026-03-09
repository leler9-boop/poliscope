// Auth page — optional sign-in / sign-up
// The app works fully without authenticating.
import React, { useState } from 'react';
import { useAuth } from '../lib/auth.jsx';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';

export default function Auth() {
  const { signIn, signUp, isSupabaseEnabled } = useAuth();
  const language = useStore(s => s.language);
  const navigate = useStore(s => s.navigate);
  const t = createTranslator(language);

  const [mode, setMode]         = useState('signin'); // 'signin' | 'signup'
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);

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
              ? 'La connexion Supabase n\'est pas configurée. Vous pouvez utiliser Poliscope en mode invité sans vous connecter.'
              : 'Supabase connection is not configured. You can use Poliscope as a guest without signing in.'}
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
