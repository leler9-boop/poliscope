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

        {/* ── Step 1 — Archetype ──────────────────────────────────────────── */}
        {step === 1 && (
          <motion.div
            key="step1"
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.34, 1.08, 0.64, 1] }}
          >
            {/* Eyebrow */}
            <p
              className="text-xs font-bold tracking-widest uppercase mb-5 text-center"
              style={{ color: hexAlpha(color, 0.85) }}
            >
              {lang === 'fr' ? 'Votre archétype politique' : 'Your political archetype'}
            </p>

            {/* Archetype name */}
            <h1
              className="text-4xl sm:text-5xl font-black text-white text-center leading-tight mb-5"
              style={{ textShadow: `0 0 60px ${hexAlpha(color, 0.6)}` }}
            >
              {topArchetype?.name?.[lang] ?? (lang === 'fr' ? 'Profil en cours…' : 'Profile forming…')}
            </h1>

            {/* Accent line */}
            <div
              className="mx-auto rounded-full mb-6"
              style={{ width: 64, height: 4, background: `linear-gradient(90deg, ${color}, ${hexAlpha(color, 0.2)})` }}
            />

            {/* Description */}
            {topArchetype?.description?.[lang] && (
              <p className="text-slate-300 text-sm sm:text-base text-center leading-relaxed mb-6 px-2">
                {topArchetype.description[lang]}
              </p>
            )}

            {/* Trait pills */}
            {traits.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {traits.slice(0, 3).map((trait, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{
                      border: `1px solid ${hexAlpha(color, 0.45)}`,
                      backgroundColor: hexAlpha(color, 0.15),
                      color: 'rgba(255,255,255,0.85)',
                    }}
                  >
                    {trait}
                  </span>
                ))}
              </div>
            )}

            {/* CTA */}
            <button
              onClick={() => setStep(2)}
              className="w-full py-4 rounded-2xl font-bold text-white text-base transition-all active:scale-95"
              style={{ background: `linear-gradient(135deg, ${color} 0%, ${hexAlpha(color, 0.75)} 100%)` }}
            >
              {lang === 'fr' ? 'Voir mon meilleur match 2027 →' : 'See my best 2027 match →'}
            </button>

            <button
              onClick={onDismiss}
              className="w-full mt-3 py-3 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
            >
              {lang === 'fr' ? 'Passer directement au profil' : 'Skip to full profile'}
            </button>
          </motion.div>
        )}

        {/* ── Step 2 — Candidate match ─────────────────────────────────────── */}
        {step === 2 && (
          <motion.div
            key="step2"
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.34, 1.08, 0.64, 1] }}
          >
            {/* Eyebrow */}
            <p className="text-xs font-bold tracking-widest uppercase mb-5 text-center text-slate-400">
              {lang === 'fr' ? 'Votre meilleur match 2027' : 'Your best 2027 match'}
            </p>

            {topCandidate ? (
              <>
                {/* Alignment score — big number */}
                <div
                  className="text-center mb-3"
                  style={{ color: topCandidate.color ?? color }}
                >
                  <span
                    className="text-7xl font-black tabular-nums"
                    style={{ textShadow: `0 0 40px ${hexAlpha(topCandidate.color ?? color, 0.55)}` }}
                  >
                    {topCandidate.alignment}
                  </span>
                  <span className="text-4xl font-black" style={{ opacity: 0.7 }}>%</span>
                </div>

                <p className="text-slate-400 text-xs text-center mb-6">
                  {lang === 'fr' ? "de compatibilité avec" : "alignment with"}
                </p>

                {/* Candidate card */}
                <div
                  className="rounded-2xl p-5 mb-6"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    border: `1px solid ${hexAlpha(topCandidate.color ?? color, 0.3)}`,
                  }}
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
                </div>

                <p className="text-slate-500 text-xs text-center mb-8 px-4">
                  {lang === 'fr'
                    ? "Ces scores sont analytiques, basés sur les positions publiques. Ce n'est pas une recommandation de vote."
                    : "Alignment scores are analytical, based on public positions. Not a voting recommendation."}
                </p>
              </>
            ) : (
              <p className="text-slate-400 text-center mb-8">
                {lang === 'fr' ? 'Aucun candidat disponible.' : 'No candidates available.'}
              </p>
            )}

            {/* CTA — dismiss to full profile */}
            <button
              onClick={onDismiss}
              className="w-full py-4 rounded-2xl font-bold text-white text-base bg-slate-700 hover:bg-slate-600 transition-all active:scale-95"
            >
              {lang === 'fr' ? 'Découvrir mon profil complet →' : 'Explore my full profile →'}
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
}
