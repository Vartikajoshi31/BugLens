import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Square, FileCode, CheckCircle2, ArrowRight, Monitor, Globe } from 'lucide-react';

export const FeatureSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-800/60">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
          Workflow Engineered for Speed
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 tracking-tight">
          From screenshot to actionable bug.
        </h2>
        <p className="mt-4 text-gray-400 text-sm sm:text-base">
          Eliminate ambiguity. BugLens structures visual evidence so engineering teams fix bugs faster.
        </p>
      </div>

      {/* 3 Large Interactive Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* CARD 01: CAPTURE */}
        <motion.div
          whileHover={{ y: -6 }}
          onClick={() => setActiveStep(1)}
          className={`p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
            activeStep === 1
              ? 'bg-gradient-to-b from-gray-900 to-slate-950 border-brand-500/60 shadow-2xl shadow-brand-500/10'
              : 'bg-gray-900/60 border-gray-800 hover:border-gray-700'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-2xl font-black text-brand-400 opacity-60">01</span>
              <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
                <Camera className="w-6 h-6" />
              </div>
            </div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-brand-400 mb-2">
              CAPTURE
            </h3>
            <h4 className="text-xl font-extrabold text-white mb-3">
              Capture exactly what went wrong.
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Drag and drop any web or mobile screenshot directly into BugLens. No setup, browser extensions, or Slack paste hassle required.
            </p>
          </div>

          {/* Miniature Interactive Capture Visual */}
          <div className="p-4 rounded-2xl bg-black/60 border border-gray-800 space-y-2 font-mono text-[11px] text-gray-300">
            <div className="flex items-center justify-between text-gray-400 border-b border-gray-800 pb-2">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Image Received
              </span>
              <span>1080p PNG</span>
            </div>
            <div className="p-3 rounded-lg bg-gray-900 border border-dashed border-brand-500/50 text-center text-brand-300">
              📸 Drop screenshot here
            </div>
          </div>
        </motion.div>

        {/* CARD 02: ANNOTATE */}
        <motion.div
          whileHover={{ y: -6 }}
          onClick={() => setActiveStep(2)}
          className={`p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
            activeStep === 2
              ? 'bg-gradient-to-b from-gray-900 to-slate-950 border-brand-500/60 shadow-2xl shadow-brand-500/10'
              : 'bg-gray-900/60 border-gray-800 hover:border-gray-700'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-2xl font-black text-indigo-400 opacity-60">02</span>
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Square className="w-6 h-6" />
              </div>
            </div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">
              ANNOTATE
            </h3>
            <h4 className="text-xl font-extrabold text-white mb-3">
              Point directly at the problem.
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Draw rectangles, arrows, text notes, and blur sensitive regions directly on the visual screenshot canvas.
            </p>
          </div>

          {/* Miniature Interactive Canvas Tool Visual */}
          <div className="p-4 rounded-2xl bg-black/60 border border-gray-800 space-y-2">
            <div className="flex items-center justify-around p-2 rounded-xl bg-gray-900 border border-gray-800">
              <span className="px-2 py-1 rounded bg-brand-600 text-white font-bold text-[10px]">Rect</span>
              <span className="px-2 py-1 rounded bg-gray-800 text-gray-400 text-[10px]">Arrow</span>
              <span className="px-2 py-1 rounded bg-gray-800 text-gray-400 text-[10px]">Text</span>
              <span className="px-2 py-1 rounded bg-rose-500/20 text-rose-300 text-[10px]">Blur</span>
            </div>
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500 text-[10px] text-rose-200 font-bold text-center">
              ⚠️ Highlighted UI Overlap Region
            </div>
          </div>
        </motion.div>

        {/* CARD 03: REPRODUCE */}
        <motion.div
          whileHover={{ y: -6 }}
          onClick={() => setActiveStep(3)}
          className={`p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
            activeStep === 3
              ? 'bg-gradient-to-b from-gray-900 to-slate-950 border-brand-500/60 shadow-2xl shadow-brand-500/10'
              : 'bg-gray-900/60 border-gray-800 hover:border-gray-700'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-2xl font-black text-purple-400 opacity-60">03</span>
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <FileCode className="w-6 h-6" />
              </div>
            </div>
            <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-purple-400 mb-2">
              REPRODUCE
            </h3>
            <h4 className="text-xl font-extrabold text-white mb-3">
              Give developers the context they need.
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Auto-capture browser, OS, viewport resolution, target URL, and JSON environment payloads instantly.
            </p>
          </div>

          {/* Miniature Environment Context Visual */}
          <div className="p-3 rounded-2xl bg-black/60 border border-gray-800 space-y-1.5 font-mono text-[10px] text-gray-300">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Browser</span>
              <span className="text-sky-400 font-bold">Chrome 128.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">OS</span>
              <span className="text-indigo-400 font-bold">macOS Sonoma</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Resolution</span>
              <span className="text-purple-400 font-bold">2560 x 1600</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
