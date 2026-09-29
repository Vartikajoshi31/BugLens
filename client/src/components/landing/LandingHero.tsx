import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { InteractiveHeroDemo } from './InteractiveHeroDemo';
import { FloatingBadges } from './FloatingBadges';

export const LandingHero: React.FC = () => {
  const navigate = useNavigate();

  const scrollToDemo = () => {
    const el = document.getElementById('demo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
      {/* Background Subtle Radial Gradient & Grid */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-brand-600/20 via-indigo-600/15 to-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Status indicator above headline */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-xs font-semibold mb-8 shadow-inner"
        >
          <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
          <span>BugLens Studio — Visual Bug Reporting</span>
        </motion.div>

        {/* Main Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]"
        >
          Stop describing bugs.{' '}
          <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent block sm:inline">
            Show them.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-base sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-normal"
        >
          Turn any visual issue into a clear, reproducible bug report in seconds.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            onClick={() => navigate('/login')}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="w-full sm:w-auto px-8 py-3.5 text-sm bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 hover:from-brand-500 hover:to-indigo-500 border-none shadow-glow text-white font-bold"
          >
            Start Reporting Bugs →
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={scrollToDemo}
            leftIcon={<Play className="w-4 h-4 fill-current text-brand-400" />}
            className="w-full sm:w-auto px-8 py-3.5 text-sm border-gray-800 bg-gray-900/60 hover:bg-gray-800 text-gray-300 hover:text-white"
          >
            See how it works ▶
          </Button>
        </motion.div>

        {/* Under-buttons Micro-copy */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-xs text-gray-500 font-medium"
        >
          No plugins. No screenshots buried in Slack. Just clarity.
        </motion.p>
      </div>

      {/* Interactive Hero Demo Centerpiece with Floating UI Elements */}
      <div id="demo" className="mt-16 relative">
        <FloatingBadges />
        <InteractiveHeroDemo />
      </div>
    </section>
  );
};
