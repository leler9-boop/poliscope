import React, { useState } from 'react';
import { Reorder, motion } from 'motion/react';
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

  const handleConfirm = () => {
    setPriority(order);
    startTest(testMode ?? 'medium');
  };

  const handleSkip = () => {
    setPriority([...THEMES_ORDER]);
    startTest(testMode ?? 'medium');
  };

  const title = language === 'fr'
    ? 'Quels sujets politiques comptent le plus pour vous ?'
    : 'What political issues matter most to you?';

  const subtitle = language === 'fr'
    ? 'Classez les thèmes selon leur importance dans vos choix politiques (vote, opinions, priorités publiques).'
    : 'Rank themes by how much they matter in your political choices — votes, opinions, public priorities.';

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => navigate('selectTest')}
        className="text-sm text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1 transition-colors"
      >
        ← {t('back')}
      </button>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">
          {title}
        </h1>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">{subtitle}</p>
      </motion.div>

      {/* Drag hint */}
      <motion.p
        className="text-xs text-gray-400 mb-3 flex items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span>⠿</span>
        {language === 'fr' ? 'Glissez pour réorganiser' : 'Drag to reorder'}
      </motion.p>

      {/* Labels */}
      <div className="flex justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
        <span>{t('priorities_most')}</span>
      </div>

      {/* Draggable list */}
      <Reorder.Group
        axis="y"
        values={order}
        onReorder={setOrder}
        className="space-y-2 mb-2 select-none"
        style={{ listStyle: 'none', padding: 0, margin: 0 }}
      >
        {order.map((theme, idx) => {
          const label = THEME_LABELS[language]?.[theme] ?? theme;
          const color = THEME_COLORS[theme] ?? '#6b7280';
          return (
            <Reorder.Item
              key={theme}
              value={theme}
              whileDrag={{
                scale: 1.02,
                boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                zIndex: 10,
                cursor: 'grabbing',
              }}
              className="bg-white border border-gray-200 rounded-xl px-4 py-3.5 flex items-center gap-3 cursor-grab active:cursor-grabbing"
              style={{ listStyle: 'none' }}
              transition={{ duration: 0.18 }}
            >
              {/* Grip icon */}
              <span className="text-gray-300 text-sm select-none flex-shrink-0" style={{ letterSpacing: '-1px' }}>
                ⠿
              </span>

              {/* Color dot */}
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: color }}
              />

              {/* Label */}
              <span className="text-sm font-medium text-gray-800 flex-1">{label}</span>

              {/* Rank badge */}
              <span
                className="text-xs font-bold tabular-nums w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}18`, color }}
              >
                {idx + 1}
              </span>
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      <div className="flex justify-end text-xs font-semibold text-gray-400 uppercase tracking-wider mt-2 mb-8 px-1">
        <span>{t('priorities_least')}</span>
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3">
        <motion.button
          onClick={handleConfirm}
          className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
        >
          {t('priorities_confirm')}
        </motion.button>
        <button
          onClick={handleSkip}
          className="w-full text-gray-400 hover:text-gray-600 font-medium py-2 text-sm transition-colors"
        >
          {t('priorities_skip')}
        </button>
      </div>
    </div>
  );
}
