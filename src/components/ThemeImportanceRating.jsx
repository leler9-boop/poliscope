import React from 'react';
import { THEMES_ORDER, THEME_LABELS, THEME_COLORS } from '../data/questions.js';
import {
  IMPORTANCE_ORDER, IMPORTANCE_LABELS, IMPORTANCE_LEVEL,
} from '../engine/priorityWeights.js';

/**
 * POLISCOP — Huit évaluations INDÉPENDANTES de l'importance des thèmes.
 *
 * POURQUOI CE COMPOSANT REMPLACE LE CLASSEMENT OBLIGATOIRE
 * --------------------------------------------------------
 * Le glisser-déposer imposait de comparer huit thèmes entre eux AVANT même de commencer le
 * quiz : il fallait comprendre la logique du classement pour pouvoir avancer. Ici, chaque
 * thème se juge seul, sur cinq niveaux, dans n'importe quel ordre — et un thème non touché
 * garde une valeur moyenne parfaitement utilisable.
 *
 * ⚠ La question posée est « quelle importance dans VOTRE CHOIX en 2027 », pas « ce sujet
 * est-il important en général ». Le mot « importance » seul serait ambigu : il faut dire de
 * quoi on parle, sinon la donnée récoltée ne veut rien dire.
 *
 * Accessibilité : un `radiogroup` par thème, navigable au clavier, annoncé aux lecteurs
 * d'écran. Pas de curseur — un curseur à cinq crans est imprécis à la souris et pénible au
 * clavier, et rien n'y indique ce que vaut la position choisie.
 */

const THEME_HELP = {
  fr: {
    ECONOMY:         'Salaires, prix, emploi, impôts, entreprises et dette publique.',
    SOCIAL:          'Retraites, inégalités, aides sociales, droits et conditions de vie.',
    IMMIGRATION:     'Entrée sur le territoire, accueil, intégration, asile et expulsions.',
    SECURITY:        'Police, justice, prisons, délinquance et protection de la population.',
    ENVIRONMENT:     'Climat, énergie, transports, agriculture et protection de la nature.',
    DEMOCRACY:       'Élections, Parlement, référendums, pouvoirs du président et participation citoyenne.',
    GLOBAL:          'Union européenne, diplomatie, armée, guerres et relations avec les autres pays.',
    PUBLIC_SERVICES: 'École, santé, hôpitaux, transports publics et administrations.',
  },
  en: {
    ECONOMY:         'Wages, prices, jobs, taxes, businesses and public debt.',
    SOCIAL:          'Pensions, inequality, welfare, rights and living conditions.',
    IMMIGRATION:     'Entry, reception, integration, asylum and removals.',
    SECURITY:        'Police, courts, prisons, crime and public protection.',
    ENVIRONMENT:     'Climate, energy, transport, farming and nature protection.',
    DEMOCRACY:       'Elections, Parliament, referendums, presidential powers and citizen participation.',
    GLOBAL:          'European Union, diplomacy, armed forces, wars and foreign relations.',
    PUBLIC_SERVICES: 'Schools, health, hospitals, public transport and administration.',
  },
};

export default function ThemeImportanceRating({ language = 'fr', levels, onChange }) {
  const fr = language !== 'en';
  const labels = IMPORTANCE_LABELS[fr ? 'fr' : 'en'];
  const help = THEME_HELP[fr ? 'fr' : 'en'];

  return (
    <div className="space-y-4">
      {THEMES_ORDER.map(theme => {
        const color = THEME_COLORS[theme];
        const current = levels?.[theme] ?? IMPORTANCE_LEVEL.MEDIUM;
        const groupId = `importance-${theme}`;
        return (
          <fieldset
            key={theme}
            className="rounded-xl border border-slate-200 bg-white p-3.5"
            aria-describedby={`${groupId}-help`}
          >
            <legend className="flex items-center gap-2 px-1">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <span className="text-sm font-semibold text-slate-900">
                {THEME_LABELS[fr ? 'fr' : 'en'][theme]}
              </span>
            </legend>
            <p id={`${groupId}-help`} className="text-xs text-slate-500 leading-relaxed mt-1 mb-2.5">
              {help[theme]}
            </p>
            <div role="radiogroup" aria-label={THEME_LABELS[fr ? 'fr' : 'en'][theme]} className="flex flex-wrap gap-1.5">
              {IMPORTANCE_ORDER.map(level => {
                const selected = current === level;
                return (
                  <button
                    key={level}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => onChange(theme, level)}
                    // min-h 44px : cible tactile confortable, et aucune dépendance au survol.
                    className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex-1 min-w-[calc(50%-0.375rem)] sm:min-w-0 ${
                      selected
                        ? 'text-white border-transparent'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                    style={selected ? { backgroundColor: color } : undefined}
                  >
                    {labels[level]}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}
