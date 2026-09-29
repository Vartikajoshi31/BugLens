import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Github, Twitter, Linkedin, Bug } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-gray-800/80 bg-[#070A10] py-14 px-4 sm:px-6 lg:px-8 text-left text-xs text-gray-500">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand & Tagline */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 font-black flex items-center justify-center text-xs">
              BL
            </div>
            <span className="font-extrabold text-base text-white tracking-tight">BugLens</span>
          </div>
          <p className="text-gray-400 text-xs">
            "Stop describing bugs. Show them."
          </p>
          <p className="text-gray-500 text-xs max-w-sm">
            BugLens turns visual bugs into structured, actionable reports — so software teams reproduce and fix issues faster.
          </p>
        </div>

        {/* Links */}
        <div className="space-y-2">
          <h4 className="font-mono text-[11px] font-bold uppercase text-gray-300">Navigation</h4>
          <ul className="space-y-1.5 text-gray-400">
            <li><button onClick={() => scrollTo('demo')} className="hover:text-white transition-colors">Product Demo</button></li>
            <li><button onClick={() => scrollTo('features')} className="hover:text-white transition-colors">Features</button></li>
            <li><button onClick={() => scrollTo('showcase')} className="hover:text-white transition-colors">Annotation Studio</button></li>
            <li><button onClick={() => scrollTo('comparison')} className="hover:text-white transition-colors">Before / After</button></li>
          </ul>
        </div>

        {/* Access */}
        <div className="space-y-2">
          <h4 className="font-mono text-[11px] font-bold uppercase text-gray-300">App Access</h4>
          <ul className="space-y-1.5 text-gray-400">
            <li><button onClick={() => navigate('/login')} className="hover:text-white transition-colors">Sign In</button></li>
            <li><button onClick={() => navigate('/register')} className="hover:text-white transition-colors">Create Account</button></li>
            <li><button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors">QA Dashboard</button></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 BUGLENS Inc. All rights reserved.</p>
        <div className="flex items-center gap-4 text-gray-400">
          <Github className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
          <Twitter className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
          <Linkedin className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>
    </footer>
  );
};
