import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Camera, Monitor, CheckCircle2, FileCode } from 'lucide-react';

export const FloatingBadges: React.FC = () => {
  return (
    <div className="hidden lg:block pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Badge 1: Critical issue detected (Top Left) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -8, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.4 },
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-12 left-2 xl:left-8 bg-gray-900/90 border border-rose-500/40 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs text-rose-200"
      >
        <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
        <ShieldAlert className="w-4 h-4 text-rose-400" />
        <span className="font-semibold">Critical issue detected</span>
      </motion.div>

      {/* Badge 2: Screenshot annotated (Top Right) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.6 },
          y: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-20 right-2 xl:right-8 bg-gray-900/90 border border-brand-500/40 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs text-brand-200"
      >
        <Camera className="w-4 h-4 text-brand-400" />
        <span className="font-semibold">Screenshot annotated</span>
      </motion.div>

      {/* Badge 3: Chrome • macOS (Middle Left) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.8 },
          y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-1/2 left-0 xl:-left-4 -translate-y-1/2 bg-gray-900/90 border border-sky-500/40 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs text-sky-200"
      >
        <Monitor className="w-4 h-4 text-sky-400" />
        <span className="font-mono text-[11px] font-semibold">Chrome • macOS Sonoma</span>
      </motion.div>

      {/* Badge 4: Reproduction context captured (Middle Right) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 1 },
          y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-1/2 right-0 xl:-right-4 -translate-y-1/2 bg-gray-900/90 border border-purple-500/40 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs text-purple-200"
      >
        <FileCode className="w-4 h-4 text-purple-400" />
        <span className="font-semibold">Reproduction context captured</span>
      </motion.div>

      {/* Badge 5: Bug report generated (Bottom Right) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -8, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 1.2 },
          y: { duration: 4.8, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute bottom-8 right-12 bg-gray-900/90 border border-emerald-500/40 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs text-emerald-200"
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span className="font-semibold">Bug report generated in 4s</span>
      </motion.div>
    </div>
  );
};
