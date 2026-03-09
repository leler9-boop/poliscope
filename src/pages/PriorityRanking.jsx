import React, { useState } from 'react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';
import { THEMES_ORDER, THEME_LABELS, THEME_COLORS } from '../data/questions.js';

export default function PriorityRanking() {
  const language       = useStore(s => s.language);
  const navigate       = useStore(s => s.navigate);
  const testMode       = useStore(s => s.testMode);
  const startTest      = useStore(s => s.startTest);
  const setPriority    = useStore(s => s.setPriorityOrder);
  const storedPriority = useStore(s => s.priorityOrder);
  const t = createTranslator(language);

  const [order, setOrder] = useState(storedPriority ?? [...THEMES_ORDER]);

  const moveUp = (idx) => {
    if (idx === 0) return;
    const next = [...order];
    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
    setOrder(next);
  };

  const moveDown = (idx) => {
    if (idx === order.length - 1) return;
    const next = [...order];
    [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    setOrder(next);
  };

  const handleConfirm = () => {
    setPriority(order);
    startTest(testMode ?? 'medium');
  };

  const handleSkip = () => {
    setPriority([...THEMES_ORDER]);
    startTest(testMode ?? 'medium');
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => navigate('selectTest')}
        className="text-sm text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1"
      >
        ← {t('back')}
      </button>

      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
        {t('priorities_title')}
      </h1>
      <p className="text-gray-500 mb-6 text-sm">{t('priorities_subtitle')}</p>

      {/* Ranked list */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">
          <span>{t('priorities_most')}</span>
        </div>

        <div className="space-y-2">
          {order.map((theme, idx) => {
            const label = THEME_LABELS[language]?.[theme] ?? theme;
            const color = THEME_COLORS[theme] ?? '#6b7280';
            return (
              <div key={theme} className="priority-item">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color }}
                />
                <div className="flex-1">
                  <span className="text-sm font-medium text-gray-800">{label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className={`w-6 h-6 flex items-center justify-center rounded text-gray-400 transition-colors ${
                      idx === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 hover:text-gray-700'
                    }`}
                    aria-label="Move up"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === order.length - 1}
                    className={`w-6 h-6 flex items-center justify-center rounded text-gray-400 transition-colors ${
                      idx === order.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100 hover:text-gray-700'
                    }`}
                    aria-label="Move down"
                  >
                    ▼
                  </button>
                  <span className="w-5 text-center text-xs font-semibold text-gray-400 ml-1">
                    #{idx + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end text-xs font-semibold text-gray-400 uppercase tracking-wider mt-3 px-1">
          <span>{t('priorities_least')}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleConfirm}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-lg transition-colors"
        >
          {t('priorities_confirm')}
        </button>
        <button
          onClick={handleSkip}
          className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 text-sm"
        >
          {t('priorities_skip')}
        </button>
      </div>
    </div>
  );
}
