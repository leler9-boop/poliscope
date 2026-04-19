import React from 'react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';

const MODES = [
  {
    id: 'quick',
    questions: 8,
    minutes: '~3',
    color: 'border-green-200 hover:border-green-400',
    badge: 'bg-green-50 text-green-700',
    icon: '⚡',
  },
  {
    id: 'medium',
    questions: 24,
    minutes: '~10',
    color: 'border-blue-200 hover:border-blue-400',
    badge: 'bg-blue-50 text-blue-700',
    icon: '📋',
    recommended: true,
  },
  {
    id: 'full',
    questions: 40,
    minutes: '~20',
    color: 'border-purple-200 hover:border-purple-400',
    badge: 'bg-purple-50 text-purple-700',
    icon: '🔬',
  },
];

export default function SelectTest() {
  const language  = useStore(s => s.language);
  const navigate  = useStore(s => s.navigate);
  const startTest = useStore(s => s.startTest);
  const t = createTranslator(language);
  const [selected, setSelected] = React.useState('medium');

  const handleStart = () => {
    navigate('priorities');
  };

  const descKey = {
    quick: 'test_quick_desc',
    medium: 'test_medium_desc',
    full: 'test_full_desc',
  };
  const labelKey = {
    quick: 'test_quick',
    medium: 'test_medium',
    full: 'test_full',
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <button
        onClick={() => navigate('landing')}
        className="min-h-[44px] text-sm text-gray-400 hover:text-gray-600 mb-5 flex items-center gap-1"
      >
        ← {t('back')}
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1.5">{t('select_test')}</h1>
      <p className="text-gray-500 mb-6 text-sm">{t('test_note')}</p>

      <div className="space-y-3 mb-6">
        {MODES.map(mode => (
          <button
            key={mode.id}
            onClick={() => setSelected(mode.id)}
            className={`w-full text-left bg-white rounded-2xl border-2 p-5 transition-all ${mode.color} ${
              selected === mode.id ? 'border-blue-500 shadow-md ring-2 ring-blue-100' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{mode.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{t(labelKey[mode.id])}</span>
                    {mode.recommended && (
                      <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {language === 'fr' ? 'Recommandé' : 'Recommended'}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">{t(descKey[mode.id])}</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                selected === mode.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              }`}>
                {selected === mode.id && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          // Store selected mode for later use in priorities page
          useStore.setState({ testMode: selected });
          handleStart();
        }}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold min-h-[56px] rounded-2xl transition-colors text-base"
      >
        {t('test_start')} →
      </button>
    </div>
  );
}
