import React from 'react';
import { motion } from 'motion/react';

export default function PreQuizModal({ language = 'fr', onStart }) {
  const content = {
    fr: {
      title: 'Avant de commencer',
      text: "N'hésitez pas à passer une question si vous n'avez pas d'avis ou si le sujet ne vous concerne pas.\nRépondre au hasard peut fausser votre profil.",
      button: 'Commencer',
    },
    en: {
      title: 'Before you start',
      text: "Feel free to skip any question if you don't have an opinion or if it doesn't matter to you.\nRandom answers can affect your results.",
      button: 'Start',
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
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center"
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.34, 1.1, 0.64, 1] }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">{c.title}</h2>
        <p className="text-sm text-gray-500 leading-relaxed mb-8 whitespace-pre-line">{c.text}</p>
        <button
          onClick={onStart}
          className="w-full py-3 rounded-xl bg-gray-900 hover:bg-black text-white text-sm font-semibold transition-colors"
        >
          {c.button}
        </button>
      </motion.div>
    </motion.div>
  );
}
