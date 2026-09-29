import React from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  FolderKanban,
  Bug,
  Globe,
  Monitor,
  Camera,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

export const ProductPreview: React.FC = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-800/60">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
          Product Experience
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-3 tracking-tight">
          Engineered like a modern developer tool.
        </h2>
        <p className="mt-4 text-gray-400 text-sm sm:text-base">
          Intuitive, lightning-fast, and designed to eliminate QA friction.
        </p>
      </div>

      {/* Large Mock Application Window */}
      <div className="rounded-3xl border border-gray-800 bg-[#090D16] p-3 sm:p-5 shadow-2xl max-w-6xl mx-auto overflow-hidden select-none">
        {/* Mock Top App Bar */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-gray-800 text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-brand-500/20 text-brand-400 font-black flex items-center justify-center text-[10px]">
                BL
              </div>
              <span className="font-extrabold text-white tracking-tight">BugLens</span>
            </div>

            <div className="hidden sm:flex items-center gap-4 text-gray-400 font-semibold text-[11px]">
              <span className="text-white border-b-2 border-brand-500 pb-1">Projects</span>
              <span className="hover:text-white transition-colors">Reports</span>
              <span className="hover:text-white transition-colors">Kanban</span>
              <span className="hover:text-white transition-colors">Analytics</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 text-[11px]">
              <Search className="w-3.5 h-3.5" />
              <span>Search bugs (⌘K)...</span>
            </div>
          </div>
        </div>

        {/* Workspace Main Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 text-left">
          {/* Main Area: Visual Screenshot Canvas (8 cols) */}
          <div className="lg:col-span-8 p-4 rounded-2xl bg-gray-950 border border-gray-800 min-h-[360px] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-gray-400 border-b border-gray-800 pb-2">
              <span className="font-semibold text-white">Visual Screenshot Workspace — BL-1042</span>
              <span className="font-mono text-emerald-400 text-[10px]">Annotated ✓</span>
            </div>

            {/* Mock Screenshot Content */}
            <div className="my-4 p-6 rounded-xl border-2 border-dashed border-rose-500/80 bg-rose-500/10 relative">
              <div className="absolute -top-3 left-4 px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px] font-bold">
                BL-1042 ANNOTATED REGION
              </div>
              <h4 className="font-bold text-sm text-rose-200">
                Modal backdrop traps pointer events on dropdown selector
              </h4>
              <p className="text-xs text-rose-300/80 mt-1">
                Z-index conflict causes backdrop to receive all click events.
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-800">
              <span>https://app.buglens.dev/checkout</span>
              <span className="font-mono text-brand-400">Chrome 128 • macOS</span>
            </div>
          </div>

          {/* Right Panel: Issue Details (4 cols) */}
          <div className="lg:col-span-4 p-5 rounded-2xl bg-gray-900/80 border border-gray-800 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <span className="font-mono font-bold text-brand-400">BL-1042</span>
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold uppercase text-[10px]">
                CRITICAL
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Title</span>
                <span className="font-semibold text-white">Payment dropdown doesn't respond</span>
              </div>

              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Environment</span>
                <span className="font-mono text-gray-300 block">Chrome 128.0 (macOS Sonoma)</span>
                <span className="font-mono text-brand-400 block">1440 × 900 Viewport</span>
              </div>

              <div>
                <span className="text-gray-500 block text-[10px] uppercase font-bold">Assigned</span>
                <span className="font-bold text-white">Rahul Verma (Lead Dev)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
