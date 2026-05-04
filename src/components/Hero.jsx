import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const taglines = [
  "Better READMEs. More stars.",
  "Analyze. Improve. Deploy.",
  "Turn docs into downloads",
  "Because Comic Sans code deserves a great README",
  "Make your repo un-scrollable-past",
  "README so good, they'll actually fork it",
  "Documentation that developers deserve",
  "Every great project starts here",
  "Your code's first impression, perfected",
  "Stop guessing. Start shipping better docs.",
  "No more blank README syndrome",
  "Fix your README before GitHub does"
];

export default function Hero() {
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const scrollToInput = () => {
    document.getElementById('analyzer-input')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden px-6 border-none">
      <div className="z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block py-1 px-3 rounded-full border border-brand-charcoal/10 text-brand-charcoal/60 text-xs sm:text-sm font-medium tracking-wide mb-6 uppercase">
            README Quality Analyzer
          </span>
        </motion.div>

        <motion.h1
          className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-brand-charcoal tracking-tight leading-[1.1] mb-6"
          initial={{ opacity: 0, y: 40, filter: 'blur(15px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          Elevate your <br/>
          <span className="italic text-brand-terracotta">documentation.</span>
        </motion.h1>

        <motion.p
          className="font-sans text-lg md:text-xl text-brand-charcoal/70 max-w-2xl mx-auto leading-relaxed mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          Get instant, actionable feedback on readability, structure, and visual appeal. 
          Ensure your open-source projects make a lasting first impression.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-6"
        >
          <button
            onClick={scrollToInput}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-brand-charcoal text-brand-cream rounded-full font-medium text-lg overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Analyze a README</span>
            <ArrowDown className="w-5 h-5 transition-transform group-hover:translate-y-1" />
          </button>

          <div className="h-8 mt-2 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={taglineIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="text-brand-charcoal/50 font-sans text-base sm:text-lg italic tracking-wide"
              >
                "{taglines[taglineIndex]}"
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
