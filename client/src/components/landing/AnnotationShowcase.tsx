import React from 'react';
import { motion } from 'framer-motion';
import { MousePointer, CheckCircle2, Square, MoveRight, EyeOff, MessageSquare } from 'lucide-react';

export const AnnotationShowcase: React.FC = () => {
  return (
    <section id="showcase" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-800/60">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Mock Screenshot Showcase with Overlay Annotations & Animated Cursor */}
        <div className="lg:col-span-7 relative">
          <div className="relative rounded-3xl border border-gray-800 bg-[#0B0F17] p-4 sm:p-6 shadow-2xl overflow-hidden select-none">
            {/* Top Mock Window Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="font-mono text-gray-500 ml-2">Acme Web Application</span>
              </div>
              <span className="font-mono text-brand-400 font-bold">1440 x 900</span>
            </div>

            {/* Fictional Web App Content */}
            <div className="relative rounded-2xl border border-gray-800/80 bg-slate-900/90 p-6 min-h-[340px] flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <span className="font-bold text-sm text-white">Payment Checkout Modal</span>
                <span className="text-xs text-brand-400 font-mono">BL-1042</span>
              </div>

              {/* Annotation 1: Red Rectangle */}
              <div className="relative my-6 p-6 rounded-xl border-2 border-rose-500 bg-rose-500/10 shadow-lg">
                <div className="absolute -top-3 left-4 px-2.5 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px] font-bold">
                  RECTANGLE TOOL
                </div>
                <p className="text-sm font-bold text-rose-200">
                  Modal backdrop intercepts click events on dropdown menu
                </p>
              </div>

              {/* Annotation 2: Blur Sensitive Region */}
              <div className="p-3 rounded-lg border border-dashed border-sky-400 bg-sky-500/10 relative">
                <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded bg-sky-600 text-white font-mono text-[9px] font-bold">
                  BLUR APPLIED (CREDIT CARD CENSORED)
                </div>
                <span className="font-mono text-xs text-sky-200 tracking-widest">
                  •••• •••• •••• 4242
                </span>
              </div>

              {/* Comment Overlay Badge */}
              <div className="mt-4 p-3 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-brand-400" />
                  <span className="text-gray-200 font-semibold">@Rahul Check this z-index trap</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">Comment #1</span>
              </div>
            </div>

            {/* Animated Cursor Moving toward Highlighted Area */}
            <motion.div
              animate={{
                x: [40, 220, 180, 40],
                y: [40, 120, 90, 40],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute top-12 left-12 z-30 pointer-events-none drop-shadow-2xl"
            >
              <MousePointer className="w-6 h-6 text-brand-400 fill-brand-500/40" />
              <span className="px-2 py-0.5 rounded bg-brand-600 text-white text-[10px] font-bold ml-4">
                QA Cursor
              </span>
            </motion.div>
          </div>
        </div>

        {/* Right Side: Copy & Description */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <span className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
            Visual Precision
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Point.{' '}
            <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Don't explain.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
            Mark the exact interaction, component, or visual regression that needs attention. Give your team instant visual clarity without writing paragraph walls.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 mt-0.5">
                <Square className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">Rectangle & Circle Outlines</h4>
                <p className="text-xs text-gray-400">Encircle exact component boundaries.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 mt-0.5">
                <EyeOff className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">Pixelation Blur Masking</h4>
                <p className="text-xs text-gray-400">Censor sensitive PII, credit cards, or token headers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
