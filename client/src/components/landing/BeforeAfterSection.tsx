import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { XCircle, CheckCircle2, MessageSquare, Camera, Monitor, Globe } from 'lucide-react';

export const BeforeAfterSection: React.FC = () => {
  const [activeView, setActiveView] = useState<'both' | 'without' | 'with'>('both');

  return (
    <section id="comparison" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-800/60">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
          The Contrast
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 tracking-tight">
          Clear reports vs. endless Slack messages.
        </h2>
        <p className="mt-4 text-gray-400 text-sm sm:text-base">
          See the massive difference between vague text reports and structured BugLens visual context.
        </p>

        {/* View Filter Toggle */}
        <div className="inline-flex items-center p-1 bg-gray-900 border border-gray-800 rounded-xl mt-6 text-xs font-semibold">
          <button
            onClick={() => setActiveView('both')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeView === 'both' ? 'bg-brand-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setActiveView('without')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeView === 'without' ? 'bg-rose-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            Without BugLens
          </button>
          <button
            onClick={() => setActiveView('with')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeView === 'with' ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
          >
            With BugLens
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
        {/* LEFT: Without BugLens (Vague Slack Message) */}
        {(activeView === 'both' || activeView === 'without') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 sm:p-8 rounded-3xl bg-gray-950/80 border border-rose-500/30 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <XCircle className="w-5 h-5" />
                  <span>Without BugLens</span>
                </div>
                <span className="text-[10px] font-mono text-gray-500 uppercase">Slack #dev-chat</span>
              </div>

              {/* Vague Slack Message UI */}
              <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs flex items-center justify-center">
                    QA
                  </div>
                  <div>
                    <span className="font-bold text-xs text-white">QA Reporter</span>
                    <span className="text-[10px] text-gray-500 ml-2">2:14 PM</span>
                  </div>
                </div>

                <p className="text-xs text-rose-200/90 leading-relaxed font-mono bg-black/40 p-3 rounded-xl border border-gray-800">
                  "Hey, the button on the payment page isn't working properly. It happens sometimes when you click around. Can someone check?"
                </p>

                <div className="p-2.5 rounded-xl bg-gray-950 text-[11px] text-gray-400 space-y-1">
                  <span className="text-rose-400 font-bold block">❌ Missing Critical Info:</span>
                  <span>• No screenshot or annotated region</span>
                  <span>• No browser or OS captured</span>
                  <span>• No reproduction steps</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-800 text-xs text-rose-400 font-semibold">
              Result: 3+ hours wasted asking "What browser were you on?"
            </div>
          </motion.div>
        )}

        {/* RIGHT: With BugLens (Structured Visual Bug Report) */}
        {(activeView === 'both' || activeView === 'with') && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 sm:p-8 rounded-3xl bg-gray-950/80 border border-emerald-500/30 shadow-2xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>With BugLens</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[11px] font-bold border border-emerald-500/20">
                  BL-1042
                </span>
              </div>

              {/* Structured Visual Bug Report */}
              <div className="p-4 rounded-2xl bg-gray-900/90 border border-gray-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-white">
                    Payment dropdown doesn't respond on checkout submit
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold text-[10px]">
                    CRITICAL
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-black/50 text-[11px] font-mono text-gray-300 border border-gray-800">
                  <div>
                    <span className="text-gray-500 block text-[9px]">Browser</span>
                    <span className="text-sky-400 font-bold">Chrome 128</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[9px]">OS</span>
                    <span className="text-indigo-400 font-bold">macOS</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[9px]">Viewport</span>
                    <span className="text-purple-400 font-bold">1440 × 900</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-emerald-300 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-400" /> Screenshot Attached
                  </span>
                  <span>Reproduction Steps Captured ✓</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-800 text-xs text-emerald-400 font-semibold">
              Result: Zero back-and-forth. Developer reproduces & fixes in 10 minutes.
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};
