import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Monitor,
  Globe,
  Camera,
  Maximize2,
  MousePointer,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';

interface MockBug {
  id: string;
  bugId: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'OPEN' | 'IN PROGRESS' | 'TESTING';
  assignee: string;
  browser: string;
  os: string;
  resolution: string;
  url: string;
  steps: string;
  annotationType: 'rectangle' | 'arrow' | 'blur';
  x: number; // percentage pos
  y: number;
  width: number;
  height: number;
}

const mockBugs: MockBug[] = [
  {
    id: '1',
    bugId: 'BL-1042',
    title: 'Modal backdrop prevents pointer events on checkout dropdown selector',
    severity: 'CRITICAL',
    status: 'OPEN',
    assignee: 'Rahul Verma (Lead Dev)',
    browser: 'Chrome 128.0',
    os: 'macOS Sonoma 14.5',
    resolution: '2560 x 1600 Retina',
    url: 'https://app.buglens.dev/checkout',
    steps: '1. Click Checkout button\n2. Select Payment option\n3. Backdrop traps click event',
    annotationType: 'rectangle',
    x: 48,
    y: 36,
    width: 44,
    height: 38,
  },
  {
    id: '2',
    bugId: 'BL-1039',
    title: 'Stripe webhook 401 unauthorized on production endpoint during checkout',
    severity: 'HIGH',
    status: 'IN PROGRESS',
    assignee: 'Rohan Mehta (Backend)',
    browser: 'Safari 17.4',
    os: 'macOS Sonoma',
    resolution: '1920 x 1080',
    url: 'https://api.acme.com/v1/stripe/webhook',
    steps: '1. Trigger Stripe upgrade webhook\n2. Signature verification fails on server',
    annotationType: 'arrow',
    x: 12,
    y: 18,
    width: 32,
    height: 24,
  },
  {
    id: '3',
    bugId: 'BL-1033',
    title: 'Kanban drag optimistic update reverts twice upon socket reconnect',
    severity: 'MEDIUM',
    status: 'TESTING',
    assignee: 'Siddharth Patel (Frontend)',
    browser: 'Firefox 129.0',
    os: 'Windows 11 Pro',
    resolution: '2560 x 1440',
    url: 'https://app.buglens.dev/kanban',
    steps: '1. Drag card between columns\n2. Disconnect socket connection',
    annotationType: 'blur',
    x: 20,
    y: 65,
    width: 38,
    height: 28,
  },
];

export const InteractiveHeroDemo: React.FC = () => {
  const [selectedBugId, setSelectedBugId] = useState<string>('BL-1042');
  const [hoveredBugId, setHoveredBugId] = useState<string | null>(null);

  const activeBug = mockBugs.find((b) => b.bugId === selectedBugId) || mockBugs[0];

  return (
    <div className="relative rounded-3xl border border-gray-800/80 bg-gray-950/90 p-3 sm:p-5 shadow-2xl shadow-brand-500/10 max-w-5xl mx-auto overflow-hidden text-left backdrop-blur-xl">
      {/* Top Workspace Bar */}
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-gray-800/80 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="font-mono text-gray-400 font-semibold ml-2">
            BugLens Studio Workspace
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Session Active
          </span>
        </div>
      </div>

      {/* Main Interactive Demo Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Mock Fictional App Screenshot with Interactive Annotation Hotspots (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative rounded-2xl border border-gray-800 bg-[#0B0F17] p-4 min-h-[360px] flex flex-col justify-between overflow-hidden select-none">
            {/* Background Fictional SaaS Mockup */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Mock Header URL Bar */}
            <div className="relative z-10 flex items-center justify-between p-2.5 bg-gray-900/90 rounded-xl border border-gray-800 text-[11px] font-mono text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-brand-400" />
                <span className="text-gray-200 truncate">{activeBug.url}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-400 text-[10px]">
                {activeBug.browser}
              </span>
            </div>

            {/* Interactive Fictional Website Content with Annotation Overlay */}
            <div className="relative z-10 flex-1 my-2 p-4 rounded-xl bg-slate-900/90 border border-gray-800/80 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2 text-xs">
                <span className="font-bold text-white">Acme Pay Checkout Page</span>
                <span className="text-[10px] text-gray-500 font-mono">Enterprise Plan $499</span>
              </div>

              {/* Hotspot Annotations */}
              <div className="relative my-6 h-40 flex items-center justify-center">
                {mockBugs.map((b) => {
                  const isSelected = b.bugId === selectedBugId;

                  return (
                    <motion.div
                      key={b.bugId}
                      onClick={() => setSelectedBugId(b.bugId)}
                      onMouseEnter={() => setHoveredBugId(b.bugId)}
                      onMouseLeave={() => setHoveredBugId(null)}
                      whileHover={{ scale: 1.02 }}
                      className={`absolute cursor-pointer transition-all duration-200 rounded-xl p-3 border-2 ${
                        b.bugId === 'BL-1042'
                          ? 'top-2 right-4 w-52 bg-rose-500/15 border-rose-500'
                          : b.bugId === 'BL-1039'
                          ? 'top-0 left-2 w-48 bg-amber-500/15 border-amber-500'
                          : 'bottom-0 left-1/3 w-56 bg-sky-500/15 border-sky-500'
                      } ${
                        isSelected
                          ? 'ring-4 ring-brand-500/40 shadow-glow z-20'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-black/60 text-white">
                          {b.bugId}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                            b.severity === 'CRITICAL'
                              ? 'bg-rose-600 text-white'
                              : b.severity === 'HIGH'
                              ? 'bg-amber-600 text-white'
                              : 'bg-sky-600 text-white'
                          }`}
                        >
                          {b.severity}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-gray-100 line-clamp-1 leading-snug">
                        {b.title}
                      </p>
                      <span className="text-[9px] text-gray-400 mt-1 block">
                        👈 Click hotspot to inspect
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Bottom environment bar */}
              <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-gray-800">
                <span className="flex items-center gap-1">
                  <Monitor className="w-3.5 h-3.5 text-gray-500" />
                  {activeBug.os}
                </span>
                <span className="font-mono text-brand-400 font-bold">
                  {activeBug.resolution}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Bug Details Card (4 cols) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4 bg-gray-900/80 p-4 sm:p-5 rounded-2xl border border-gray-800">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBug.bugId}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <span className="font-mono text-xs font-black text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/20">
                  {activeBug.bugId}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    activeBug.severity === 'CRITICAL'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      : activeBug.severity === 'HIGH'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                  }`}
                >
                  {activeBug.severity}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-white leading-snug">
                  {activeBug.title}
                </h4>
              </div>

              <div className="space-y-2.5 text-xs text-gray-300 pt-2 border-t border-gray-800/80">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-500 block mb-0.5">
                    Assigned Developer
                  </span>
                  <span className="font-bold text-white">{activeBug.assignee}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-gray-500 block mb-0.5">
                    Captured Steps
                  </span>
                  <p className="font-mono text-[11px] text-gray-300 bg-black/40 p-2 rounded-lg border border-gray-800 whitespace-pre-wrap">
                    {activeBug.steps}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Hotspot Switcher Buttons */}
          <div className="pt-3 border-t border-gray-800">
            <span className="text-[10px] uppercase font-bold text-gray-500 block mb-2">
              Select Annotation Issue
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {mockBugs.map((b) => (
                <button
                  key={b.bugId}
                  onClick={() => setSelectedBugId(b.bugId)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono font-bold transition-all text-center ${
                    selectedBugId === b.bugId
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                      : 'bg-gray-800/60 text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {b.bugId}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
