import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * Toast — notification légère (3s auto-dismiss)
 * Usage: <Toast message="✓ Profil sauvegardé" type="success" onDone={() => setToast(null)} />
 */
export default function Toast({ message, type = 'success', onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  const bg = type === 'error' ? 'bg-red-600' : 'bg-gray-900';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.25 }}
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 ${bg} text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg`}
      >
        {message}
      </motion.div>
    </AnimatePresence>
  );
}
