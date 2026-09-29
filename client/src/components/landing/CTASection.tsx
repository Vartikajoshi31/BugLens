import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export const CTASection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
      {/* Subtle Animated Background Gradient Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 via-indigo-600/20 to-purple-600/20 rounded-3xl blur-3xl opacity-60 pointer-events-none" />

      <div className="relative z-10 rounded-3xl border border-brand-500/30 bg-gradient-to-b from-gray-900/90 to-slate-950/90 p-8 sm:p-16 text-center shadow-2xl backdrop-blur-xl max-w-5xl mx-auto space-y-6">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 text-xs font-semibold border border-brand-500/20">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Production Ready Visual QA</span>
        </span>

        <h2 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Make bugs impossible to misunderstand.
        </h2>

        <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Give your team the visual context they need to fix issues faster.
        </p>

        <div className="pt-4">
          <Button
            size="lg"
            onClick={() => navigate('/login')}
            rightIcon={<ArrowRight className="w-5 h-5" />}
            className="px-10 py-4 text-base bg-gradient-to-r from-brand-600 via-indigo-600 to-brand-500 hover:from-brand-500 hover:to-indigo-500 border-none shadow-glow text-white font-extrabold"
          >
            Start Reporting →
          </Button>
        </div>
      </div>
    </section>
  );
};
