import React from 'react';
import { motion } from 'framer-motion';

export const TestimonialSection: React.FC = () => {
  const testimonials = [
    {
      quote: '"Finally, a bug report that tells me exactly what to fix without 5 follow-up questions."',
      author: 'Vartika Sharma',
      role: 'Head of Engineering',
    },
    {
      quote: '"We eliminated 90% of the back-and-forth Slack messages asking about browser versions and steps."',
      author: 'Rahul Verma',
      role: 'Lead Frontend Developer',
    },
    {
      quote: '"Annotating visual bugs directly on the screenshot saves our QA team hours every sprint."',
      author: 'Ananya Iyer',
      role: 'QA Lead',
    },
  ];

  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-800/60">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-mono font-bold tracking-widest text-brand-400 uppercase">
          Feedback
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">
          Designed for developers & QA teams
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((item, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-gray-900/60 border border-gray-800 flex flex-col justify-between hover:border-brand-500/40 transition-all text-left"
          >
            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed italic">
              {item.quote}
            </p>

            <div className="mt-6 pt-4 border-t border-gray-800/80">
              <h4 className="font-bold text-xs text-white">{item.author}</h4>
              <span className="text-[11px] text-gray-500">{item.role}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
