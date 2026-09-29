import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

export const LandingNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#090D16]/80 backdrop-blur-xl border-b border-gray-800/80 py-3 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-600 p-[1px] shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#090D16] rounded-[11px] flex items-center justify-center">
              <svg className="w-5 h-5 text-brand-400 group-hover:rotate-12 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="m8 2 1.88 1.88"/>
                <path d="M14.12 3.88 16 2"/>
                <path d="M9 7.13v-1a3.003 3.003 0 0 1 6 0v1"/>
                <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6z"/>
              </svg>
            </div>
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-gray-200 to-brand-300 bg-clip-text text-transparent">
            BUGLENS
          </span>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-gray-400">
          <button onClick={() => scrollTo('demo')} className="hover:text-white transition-colors">
            Product Demo
          </button>
          <button onClick={() => scrollTo('features')} className="hover:text-white transition-colors">
            Features
          </button>
          <button onClick={() => scrollTo('showcase')} className="hover:text-white transition-colors">
            Annotation
          </button>
          <button onClick={() => scrollTo('comparison')} className="hover:text-white transition-colors">
            Before / After
          </button>
          <button onClick={() => scrollTo('testimonials')} className="hover:text-white transition-colors">
            Testimonials
          </button>
        </nav>

        {/* Right Action CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/login')}
            className="text-xs text-gray-300 hover:text-white"
          >
            Log in
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/login')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            className="text-xs bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 border-none shadow-lg shadow-brand-500/25"
          >
            Start Reporting →
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800/60"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#090D16]/95 border-b border-gray-800 px-6 py-6 space-y-4 animate-fadeIn">
          <nav className="flex flex-col space-y-3 text-sm font-semibold text-gray-300">
            <button onClick={() => scrollTo('demo')} className="text-left hover:text-white">Product Demo</button>
            <button onClick={() => scrollTo('features')} className="text-left hover:text-white">Features</button>
            <button onClick={() => scrollTo('showcase')} className="text-left hover:text-white">Annotation Showcase</button>
            <button onClick={() => scrollTo('comparison')} className="text-left hover:text-white">Before & After</button>
            <button onClick={() => scrollTo('testimonials')} className="text-left hover:text-white">Testimonials</button>
          </nav>
          <div className="pt-4 border-t border-gray-800/80 flex flex-col gap-2">
            <Button variant="outline" onClick={() => navigate('/login')} className="w-full">
              Log in
            </Button>
            <Button onClick={() => navigate('/register')} className="w-full">
              Start Reporting Bugs
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
