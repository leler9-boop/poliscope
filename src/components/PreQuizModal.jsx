import React from 'react';
import { motion } from 'motion/react';

import { PURPOSES, consentTextFor } from '../lib/consent.js';

/**
 * POLISCOP — Écran d'entrée du questionnaire : conseils d'usage ET choix de collecte.
 *
 * ⚠ CE QUI ÉTAIT FAUX ICI
 * -----------------------
 * Cet écran affirmait sans condition que les réponses ne quittaient jamais le terminal.
 * C'était inexact dans le principe (la plateforme de collecte anonyme est écrite et prête) et,
 * surtout, cela remplaçait un choix par une affirmation : personne n'a jamais pu ACCEPTER
 * la collecte, faute qu'on la lui propose. Un refus par défaut non demandé n'est pas un
 * refus — c'est une absence de question.
 *
 * La phrase est donc devenue conditionnelle, et le choix est réellement offert : accepter,
 * ou refuser et continuer sur l'appareil. Rien n'est précoché, les deux boutons ont le même
 * poids visuel, et refuser n'enlève AUCUNE fonctionnalité du produit.
 *
 * ⚠ Ce consentement n'est PAS celui de la sauvegarde liée à un compte (`cloud_save`), qui
 * transporte un identifiant de compte et se demande séparément dans `ConsentModal`.
 *
 * @param {(accepted: boolean) => void} onStart  décision explicite, jamais implicite
 */
export default function PreQuizModal({ language = 'fr', onStart, askConsent = true }) {
  const content = {
    fr: {
      title: 'Avant de commencer',
      intro: 'Il n’y a pas de bonne ou de mauvaise réponse. Voici comment obtenir un profil qui vous ressemble vraiment.',
      tips: [
        { icon: '3', title: '« Entre les deux »', text: 'Choisissez 3 seulement si votre avis se situe réellement entre l’accord et le désaccord.' },
        { icon: '?', title: '« Je ne sais pas »', text: 'Si vous ne connaissez pas le sujet ou n’avez pas d’avis, passez la question. Elle ne comptera pas dans votre profil.' },
        { icon: '💡', title: 'Besoin de comprendre ?', text: 'Le bouton « Comprendre cet enjeu » donne du contexte. La rubrique « J’y connais rien » permet d’apprendre les bases à votre rythme.' },
      ],
      consentTitle: 'Nous aider à améliorer le questionnaire ?',
      consentIntro: 'C’est un choix libre : le questionnaire et votre profil fonctionnent exactement pareil si vous refusez.',
      collected: [
        'vos réponses aux questions politiques',
        'le temps passé activement sur chaque question',
        'le mode de quiz et la version du questionnaire',
        'l’importance que vous donnez aux thèmes et l’influence sur votre vote',
      ],
      never: 'Jamais dans ce flux : votre nom, votre adresse électronique, ni aucun identifiant de compte.',
      start: 'C’est parti',
      accept: 'Accepter et commencer',
      decline: 'Refuser et continuer sur cet appareil',
      reversible: 'Vous pouvez changer d’avis à tout moment depuis « Mes données ». Un retrait arrête immédiatement les envois suivants.',
    },
    en: {
      title: 'Before you start',
      intro: 'There are no right or wrong answers. Here is how to get a profile that truly reflects your views.',
      tips: [
        { icon: '3', title: '“In between”', text: 'Choose 3 only when your view genuinely falls between agreement and disagreement.' },
        { icon: '?', title: '“I don’t know”', text: 'If you do not know the topic or have no opinion, skip it. It will not count toward your profile.' },
        { icon: '💡', title: 'Need some context?', text: 'Use “Understand this issue” for a quick explanation. Visit Politics 101 to learn the basics at your own pace.' },
      ],
      consentTitle: 'Help us improve the questionnaire?',
      consentIntro: 'It is entirely your choice: the questionnaire and your profile work exactly the same if you decline.',
      collected: [
        'your answers to the political questions',
        'the time actively spent on each question',
        'the quiz mode and questionnaire version',
        'the importance you give to themes and the influence on your vote',
      ],
      never: 'Never in this flow: your name, your email address, or any account identifier.',
      start: 'Let’s go',
      accept: 'Accept and start',
      decline: 'Decline and continue on this device',
      reversible: 'You can change your mind at any time from “My data”. Withdrawing stops all further sending immediately.',
    },
  };

  const c = content[language] ?? content.fr;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label={c.title}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md my-8"
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.34, 1.1, 0.64, 1] }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">{c.title}</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-5 text-center">{c.intro}</p>
        <div className="space-y-2.5 mb-6">
          {c.tips.map((tip) => (
            <div key={tip.title} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-left">
              <span className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-sm font-bold text-blue-600 shrink-0">
                {tip.icon}
              </span>
              <span>
                <span className="block text-sm font-semibold text-slate-800 mb-0.5">{tip.title}</span>
                <span className="block text-xs text-slate-500 leading-relaxed">{tip.text}</span>
              </span>
            </div>
          ))}
        </div>

        {/* ── Choix de collecte : posé UNIQUEMENT si aucune décision en cours de
            validité n'existe. Redemander à chaque session réécrirait une décision déjà
            prise et brouillerait sa date. ─────────────────────────────────────── */}
        {askConsent && (
        <div className="rounded-xl border border-slate-200 p-3.5 mb-4 text-left">
          <p className="text-sm font-semibold text-slate-800 mb-1">{c.consentTitle}</p>
          <p className="text-xs text-slate-500 leading-relaxed mb-2">{c.consentIntro}</p>
          {/* ⚠ TEXTE CANONIQUE — SOURCE UNIQUE.
              L'empreinte enregistrée par `recordCollectionConsent()` est calculée sur
              `consentTextFor(POLITICAL_ANALYTICS, language)`. Réécrire ici une formulation
              « équivalente » ferait enregistrer l'empreinte d'un texte jamais présenté :
              la preuve porterait sur autre chose que ce que la personne a lu. */}
          <p
            data-testid="consent-canonical-text"
            className="text-xs text-slate-700 leading-relaxed mb-2 p-2.5 rounded-lg bg-white border border-slate-200"
          >
            {consentTextFor(PURPOSES.POLITICAL_ANALYTICS, language)}
          </p>
          <ul className="text-xs text-slate-600 leading-relaxed list-disc pl-4 mb-2">
            {c.collected.map(item => <li key={item}>{item}</li>)}
          </ul>
          <p className="text-[11px] text-slate-500 leading-relaxed">{c.never}</p>
        </div>
        )}

        {/* Les deux issues ont le MÊME poids : un bouton refus en lien discret
            transformerait le refus en parcours du combattant. */}
        {askConsent ? (
          <div className="flex flex-col gap-2">
            <button
              onClick={() => onStart(true)}
              className="w-full py-3 rounded-xl bg-gray-900 hover:bg-black text-white text-sm font-semibold transition-colors"
            >
              {c.accept}
            </button>
            <button
              onClick={() => onStart(false)}
              className="w-full py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors"
            >
              {c.decline}
            </button>
          </div>
        ) : (
          // Décision déjà prise et toujours valable : on démarre sans rien réécrire.
          <button
            onClick={() => onStart(null)}
            className="w-full py-3 rounded-xl bg-gray-900 hover:bg-black text-white text-sm font-semibold transition-colors"
          >
            {c.start}
          </button>
        )}

        <p className="mt-4 text-[11px] text-gray-400 leading-relaxed">{c.reversible}</p>
      </motion.div>
    </motion.div>
  );
}
