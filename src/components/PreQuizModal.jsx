import React from 'react';
import { motion } from 'motion/react';

export default function PreQuizModal({ language = 'fr', onStart }) {
  const content = {
    fr: {
      title: 'Avant de commencer',
      intro: 'Il n’y a pas de bonne ou de mauvaise réponse. Voici comment obtenir un profil qui vous ressemble vraiment.',
      tips: [
        { icon: '3', title: '« Entre les deux »', text: 'Choisissez 3 seulement si votre avis se situe réellement entre l’accord et le désaccord.' },
        { icon: '?', title: '« Je ne sais pas »', text: 'Si vous ne connaissez pas le sujet ou n’avez pas d’avis, passez la question. Elle ne comptera pas dans votre profil.' },
        { icon: '💡', title: 'Besoin de comprendre ?', text: 'Le bouton « Comprendre cet enjeu » donne du contexte. La rubrique « J’y connais rien » permet d’apprendre les bases à votre rythme.' },
      ],
      button: "C'est parti",
      privacyNote: "Tes réponses restent sur cet appareil. Si tu crées un compte et actives la sauvegarde en ligne, on te demandera ton accord séparément avant d'envoyer quoi que ce soit.",
    },
    en: {
      title: 'Before you start',
      intro: 'There are no right or wrong answers. Here is how to get a profile that truly reflects your views.',
      tips: [
        { icon: '3', title: '“In between”', text: 'Choose 3 only when your view genuinely falls between agreement and disagreement.' },
        { icon: '?', title: '“I don’t know”', text: 'If you do not know the topic or have no opinion, skip it. It will not count toward your profile.' },
        { icon: '💡', title: 'Need some context?', text: 'Use “Understand this issue” for a quick explanation. Visit Politics 101 to learn the basics at your own pace.' },
      ],
      button: "Let's go",
      privacyNote: "Your answers stay on this device. If you create an account and enable cloud save, we'll ask your consent separately before sending anything.",
    },
  };

  const c = content[language] ?? content.fr;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md"
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
        <button
          onClick={onStart}
          className="w-full py-3 rounded-xl bg-gray-900 hover:bg-black text-white text-sm font-semibold transition-colors"
        >
          {c.button}
        </button>
        {/* Privacy notice — informational only, NOT a consent mechanism.
            Real RGPD consent (political-opinion data, Article 9) happens later,
            explicitly, in ConsentModal.jsx — see audit/rgpd-remediation-2026-07/. */}
        <p className="mt-4 text-[11px] text-gray-400 leading-relaxed">
          {c.privacyNote}
        </p>
      </motion.div>
    </motion.div>
  );
}
