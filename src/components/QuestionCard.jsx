import React, { useState } from 'react';
import { THEME_LABELS, THEME_COLORS } from '../data/questions.js';

const LIKERT_LABELS = {
  en: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
  fr: ['Pas du tout d\'accord', 'Pas d\'accord', 'Neutre', 'D\'accord', 'Tout à fait d\'accord'],
};

export default function QuestionCard({ question, currentAnswer, onAnswer, language = 'en' }) {
  const [showInfo, setShowInfo] = useState(false);
  const labels = LIKERT_LABELS[language] ?? LIKERT_LABELS.en;
  const themeLabel = THEME_LABELS[language]?.[question.theme] ?? question.theme;
  const themeColor = THEME_COLORS[question.theme] ?? '#6b7280';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-2xl mx-auto w-full">
      {/* Theme badge */}
      <div className="flex items-center gap-2 mb-5">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ backgroundColor: themeColor }}
        />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {language === 'fr' ? 'Thème : ' : 'Theme: '}{themeLabel}
        </span>
      </div>

      {/* Question text + info button */}
      <div className="flex items-start gap-3 mb-8">
        <p className="text-lg sm:text-xl font-medium text-gray-900 leading-relaxed flex-1">
          {question.text[language]}
        </p>
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-7 h-7 rounded-full border border-gray-300 text-gray-400 hover:text-blue-600 hover:border-blue-400 flex items-center justify-center text-sm font-bold transition-colors"
            title={language === 'fr' ? 'En savoir plus' : 'Learn more'}
          >
            i
          </button>
        </div>
      </div>

      {/* Info tooltip */}
      {showInfo && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-gray-700 leading-relaxed">
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
            </svg>
            <p>{question.info[language]}</p>
          </div>
          <button
            onClick={() => setShowInfo(false)}
            className="mt-2 text-xs text-blue-500 hover:text-blue-700 font-medium"
          >
            {language === 'fr' ? 'Fermer' : 'Close'}
          </button>
        </div>
      )}

      {/* Likert scale */}
      <div className="space-y-3">
        {/* Labels row */}
        <div className="hidden sm:flex justify-between text-xs text-gray-400 px-1 mb-1">
          <span>{labels[0]}</span>
          <span>{labels[4]}</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 sm:gap-3">
          {[1, 2, 3, 4, 5].map((val) => {
            const isSelected = currentAnswer === val;
            const label = labels[val - 1];
            return (
              <button
                key={val}
                onClick={() => onAnswer(val)}
                title={label}
                className={`flex-1 relative group flex flex-col items-center gap-2 py-3 rounded-lg border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {/* Circle indicator */}
                <div className={`w-3 h-3 rounded-full border-2 transition-colors ${
                  isSelected ? 'border-white bg-white' : 'border-gray-300 group-hover:border-blue-400'
                }`} />
                {/* Value label on mobile */}
                <span className="text-xs font-medium sm:hidden leading-tight text-center px-0.5">
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Full labels on desktop */}
        <div className="hidden sm:grid grid-cols-5 gap-2 px-0">
          {labels.map((label, i) => (
            <p key={i} className="text-xs text-center text-gray-400 leading-tight">{label}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
