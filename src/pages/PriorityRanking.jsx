import React, { useState } from 'react';
import { Reorder, motion } from 'motion/react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';
import { THEMES_ORDER, THEME_LABELS, THEME_COLORS } from '../data/questions.js';
import { trackPriorityCompleted } from '../lib/analytics.js';
import ThemeImportanceRating from '../components/ThemeImportanceRating.jsx';
import {
  equalImportance, importanceFromRanking, normalizeThemeImportance,
  PRIORITY_SOURCE, IMPORTANCE_LEVEL,
} from '../engine/priorityWeights.js';

// Short descriptions shown under each theme name in the ranking list.
// Aim: a 17-year-old immediately understands what each theme covers.
const THEME_DESCRIPTIONS = {
  fr: {
    ECONOMY:         'Impôts, salaires, entreprises',
    SOCIAL:          'Avortement, mariage, religion',
    IMMIGRATION:     'Frontières, réfugiés, expulsions',
    SECURITY:        'Police, prison, armée',
    ENVIRONMENT:     'Climat, voiture, nucléaire',
    DEMOCRACY:       'Vote, médias, justice',
    GLOBAL:          'Europe, OTAN, commerce',
    PUBLIC_SERVICES: 'École, hôpital, retraites',
  },
  en: {
    ECONOMY:         'Taxes, wages, businesses',
    SOCIAL:          'Abortion, marriage, religion',
    IMMIGRATION:     'Borders, refugees, deportations',
    SECURITY:        'Police, prison, army',
    ENVIRONMENT:     'Climate, cars, nuclear',
    DEMOCRACY:       'Voting, media, justice',
    GLOBAL:          'EU, NATO, trade',
    PUBLIC_SERVICES: 'Schools, hospitals, pensions',
  },
};

export default function PriorityRanking() {
  const language       = useStore(s => s.language);
  const navigate       = useStore(s => s.navigate);
  const testMode       = useStore(s => s.testMode);
  const startTest      = useStore(s => s.startTest);
  const setPriority    = useStore(s => s.setPriorityOrder);
  const setThemeWeights = useStore(s => s.setThemeWeights);
  const storedPriority = useStore(s => s.priorityOrder);
  const t = createTranslator(language);

  const setThemeImportance = useStore(s => s.setThemeImportance);
  const storedImportance   = useStore(s => s.themeImportance);

  const [order, setOrder] = useState(storedPriority ?? [...THEMES_ORDER]);
  // Mode d'évaluation. Le classement par glisser-déposer devient FACULTATIF : il n'est plus
  // qu'un moyen d'affiner, et il alimente exactement le même contrat de pondération.
  const [mode, setMode] = useState('rating');   // 'rating' | 'ranking'
  const [levels, setLevels] = useState(
    () => normalizeThemeImportance({ themeImportance: storedImportance, priorityOrder: storedPriority }).levels,
  );

  const fr = language !== 'en';

  const startWith = (importance, source) => {
    setThemeImportance({ ...importance, source });
    // `themeWeights` (allocation sur 100) appartient à l'ancien modèle : on le neutralise pour
    // qu'il ne coexiste pas avec une importance déclarée, ce qui produirait deux pondérations.
    setThemeWeights(null);
    trackPriorityCompleted({ priorityOrder: order, method: source });
    startTest(testMode ?? 'medium');
  };

  const handleRatingConfirm = () => startWith({ levels }, PRIORITY_SOURCE.INDEPENDENT);
  const handleEqual = () => startWith(equalImportance(), PRIORITY_SOURCE.EQUAL);

  const handleConfirm = () => {
    setPriority(order);
    // Le classement précis est CONVERTI vers le même contrat que les évaluations simples :
    // sans cela, deux parcours produiraient deux échelles de poids incomparables.
    startWith(importanceFromRanking(order), PRIORITY_SOURCE.RANKING);
  };


  const title = language === 'fr'
    ? 'Quels sujets comptent le plus pour vous ?'
    : 'Which topics matter most to you?';

  const bodyLines = language === 'fr'
    ? [
        'Glissez les thèmes du plus important au moins important. Les thèmes en haut auront plus de poids dans votre profil.',
      ]
    : [
        'Drag themes from most to least important. Top themes carry more weight in your final profile.',
      ];

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
          {mode === 'rating'
            ? (fr ? 'Quelle importance ces sujets auront-ils dans votre choix ?' : 'How much will these topics matter in your choice?')
            : title}
        </h1>
        <div className="mb-6 space-y-2">
          {mode === 'rating'
            ? (
              <p className="text-gray-500 text-sm leading-relaxed">
                {fr
                  ? 'Jugez chaque sujet séparément. Il n’y a rien à classer : répondez dans l’ordre que vous voulez, et passez ce que vous ne savez pas trancher.'
                  : 'Rate each topic on its own. Nothing to rank: answer in any order, and skip what you cannot decide.'}
              </p>
            )
            : bodyLines.map((line, i) => (
              <p key={i} className="text-gray-500 text-sm leading-relaxed">{line}</p>
            ))}
        </div>
      </motion.div>

      {mode === 'rating' && (
        <>
          <ThemeImportanceRating
            language={language}
            levels={levels}
            onChange={(theme, level) => setLevels(prev => ({ ...prev, [theme]: level }))}
          />

          <div className="flex flex-col gap-3 mt-8">
            <button
              onClick={handleRatingConfirm}
              className="w-full bg-gray-900 hover:bg-black text-white font-semibold min-h-[56px] py-3.5 rounded-xl transition-colors text-sm"
            >
              {fr ? 'Commencer le questionnaire' : 'Start the questionnaire'}
            </button>
            <button
              onClick={handleEqual}
              className="w-full min-h-[48px] border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium py-2.5 rounded-xl text-sm transition-colors"
            >
              {fr ? 'Tous les sujets comptent à peu près autant' : 'All topics matter about the same'}
            </button>
            <button
              onClick={() => setMode('ranking')}
              className="w-full text-gray-400 hover:text-gray-600 font-medium py-2 text-sm transition-colors"
            >
              {fr ? 'Je préfère faire un classement précis' : 'I would rather rank them precisely'}
            </button>
          </div>
          <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">
            {fr
              ? 'Ces choix servent uniquement à pondérer les sujets dans la comparaison avec les candidats. Ils ne modifient jamais vos réponses ni votre profil politique.'
              : 'These choices only weight topics when comparing with candidates. They never change your answers or your political profile.'}
          </p>
        </>
      )}

      {mode === 'ranking' && (
      <>

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
          const desc  = THEME_DESCRIPTIONS[language]?.[theme] ?? '';
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
              className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex items-center gap-3 cursor-grab active:cursor-grabbing"
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

              {/* Label + description */}
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium text-gray-800 leading-tight">{label}</span>
                {desc && <span className="block text-xs text-gray-400 leading-tight mt-0.5">{desc}</span>}
              </span>

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
          className="w-full bg-gray-900 hover:bg-black text-white font-semibold min-h-[56px] py-3.5 rounded-xl transition-colors text-sm"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.15 }}
        >
          {t('priorities_confirm')}
        </motion.button>
        <button
          onClick={() => setMode('rating')}
          className="w-full text-gray-400 hover:text-gray-600 font-medium py-2 text-sm transition-colors"
        >
          {fr ? '← Revenir aux évaluations simples' : '← Back to simple ratings'}
        </button>
      </div>
      </>
      )}
    </div>
  );
}
