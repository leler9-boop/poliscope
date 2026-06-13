/**
 * ProfileReveal — step-by-step reveal overlay shown once after quiz completion.
 *
 * Steps:
 *   1. Archetype reveal  — big name, description, 3 trait pills
 *   2. Candidate match   — top 2027 match with alignment %
 *   3. Dismissed         — user sees normal profile page
 *
 * Triggered by `profileRevealPending` in store, cleared on dismiss.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

function hexAlpha(hex, alpha) {
  if (!hex || hex.length < 7) return `rgba(37,99,235,${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function ProfileReveal({
  topArchetype,
  topCandidate,
  language,
  answeredCount,
  onDismiss,
}) {
  const [step, setStep] = useState(1); // 1 | 2
  const lang = language === 'fr' ? 'fr' : 'en';
  const color = topArchetype?.color ?? '#2563eb';
  const traits = topArchetype?.traits?.[lang] ?? topArchetype?.traits?.fr ?? [];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(12px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      <AnimatePresence mode="wait">

        {/* ── Step 1 — Archetype reveal ───────────────────────────────────── */}
        {step === 1 && (
          <motion.div
            key="step1"
            className="w-full max-w-md"
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Eyebrow — first signal */}
            <motion.p
              className="text-xs font-bold tracking-widest uppercase mb-6 text-center"
              style={{ color: hexAlpha(color, 0.8) }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {lang === 'fr' ? 'Votre archétype politique' : 'Your political archetype'}
            </motion.p>

            {/* Accent line — draws in, builds anticipation */}
            <motion.div
              className="mx-auto rounded-full mb-7"
              style={{ height: 3, background: `linear-gradient(90deg, ${color}, ${hexAlpha(color, 0.2)})` }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 56, opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.55, ease: [0.34, 1.08, 0.64, 1] }}
            />

            {/* Archetype name — the reveal, springs in */}
            <motion.h1
              className="text-4xl sm:text-5xl font-black text-white text-center leading-tight mb-7"
              style={{ textShadow: `0 0 64px ${hexAlpha(color, 0.65)}` }}
              initial={{ opacity: 0, scale: 0.80, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.88, ease: [0.34, 1.12, 0.64, 1] }}
            >
              {topArchetype?.name?.[lang] ?? (lang === 'fr' ? 'Profil en cours…' : 'Profile forming…')}
            </motion.h1>

            {/* Description */}
            {topArchetype?.description?.[lang] && (
              <motion.p
                className="text-slate-300 text-sm sm:text-base text-center leading-relaxed mb-6 px-2"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.42 }}
              >
                {topArchetype.description[lang].length > 160
                  ? topArchetype.description[lang].slice(0, 157).trimEnd() + '…'
                  : topArchetype.description[lang]}
              </motion.p>
            )}

            {/* Trait pills — staggered entry */}
            {traits.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {traits.slice(0, 3).map((trait, i) => (
                  <motion.span
                    key={i}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{
                      border: `1px solid ${hexAlpha(color, 0.45)}`,
                      backgroundColor: hexAlpha(color, 0.15),
                      color: 'rgba(255,255,255,0.85)',
                    }}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 1.62 + i * 0.1 }}
                  >
                    {trait}
                  </motion.span>
                ))}
              </div>
            )}

            {/* CTA — last to appear */}
            <motion.button
              onClick={() => setStep(2)}
              className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
              style={{ background: `linear-gradient(135deg, ${color} 0%, ${hexAlpha(color, 0.75)} 100%)` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 2.0 }}
              whileTap={{ scale: 0.97 }}
            >
              {lang === 'fr' ? 'Voir mon meilleur match 2027 →' : 'See my best 2027 match →'}
            </motion.button>

            <motion.button
              onClick={onDismiss}
              className="w-full mt-3 py-3 text-xs font-medium text-slate-600 hover:text-slate-400 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 2.2 }}
            >
              {lang === 'fr' ? 'Passer →' : 'Skip →'}
            </motion.button>
          </motion.div>
        )}

        {/* ── Step 2 — Candidate match ─────────────────────────────────────── */}
        {step === 2 && (
          <motion.div
            key="step2"
            className="w-full max-w-md"
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Eyebrow */}
            <motion.p
              className="text-xs font-bold tracking-widest uppercase mb-5 text-center text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {lang === 'fr' ? 'Votre meilleur match 2027' : 'Your best 2027 match'}
            </motion.p>

            {topCandidate ? (
              <>
                {/* Alignment score — springs in as the reveal */}
                <motion.div
                  className="text-center mb-3"
                  style={{ color: topCandidate.color ?? color }}
                  initial={{ opacity: 0, scale: 0.72, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.35, ease: [0.34, 1.12, 0.64, 1] }}
                >
                  <span
                    className="text-7xl font-black tabular-nums"
                    style={{ textShadow: `0 0 40px ${hexAlpha(topCandidate.color ?? color, 0.55)}` }}
                  >
                    {topCandidate.alignment}
                  </span>
                  <span className="text-4xl font-black" style={{ opacity: 0.7 }}>%</span>
                </motion.div>

                <motion.p
                  className="text-slate-400 text-xs text-center mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.85 }}
                >
                  {lang === 'fr' ? "de compatibilité avec" : "alignment with"}
                </motion.p>

                {/* Candidate card */}
                <motion.div
                  className="rounded-2xl p-5 mb-6"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: `1px solid ${hexAlpha(topCandidate.color ?? color, 0.3)}`,
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.0 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex-shrink-0"
                      style={{ backgroundColor: topCandidate.color ?? color, opacity: 0.85 }}
                    />
                    <div>
                      <p className="font-bold text-white text-lg">{topCandidate.name}</p>
                      <p className="text-slate-400 text-sm mt-0.5">
                        {topCandidate.party?.[lang] ?? topCandidate.party?.fr ?? ''}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.p
                  className="text-slate-600 text-xs text-center mb-8 px-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 1.25 }}
                >
                  {lang === 'fr'
                    ? "Score basé sur les positions publiques. Pas une recommandation de vote."
                    : "Based on public positions. Not a voting recommendation."}
                </motion.p>
              </>
            ) : (
              <p className="text-slate-400 text-center mb-8">
                {lang === 'fr' ? 'Aucun candidat disponible.' : 'No candidates available.'}
              </p>
            )}

            {/* CTA — dismiss to full profile */}
            <motion.button
              onClick={onDismiss}
              className="w-full py-4 rounded-2xl font-bold text-white text-base bg-slate-700 hover:bg-slate-600 transition-all active:scale-95"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: topCandidate ? 1.45 : 0.4 }}
              whileTap={{ scale: 0.97 }}
            >
              {lang === 'fr' ? 'Découvrir mon profil complet →' : 'Explore my full profile →'}
            </motion.button>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
