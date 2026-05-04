import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

const cards = [
  {
    numeral: '01',
    title: 'The Discovery',
    body: 'A user lands on your repository. You have 5 seconds to explain what it does before they hit the back button. Most projects fail right here.',
  },
  {
    numeral: '02',
    title: 'The Assumption',
    body: 'We often assume our code speaks for itself. But without context, even the most elegant architecture looks like an impenetrable wall of text.',
  },
  {
    numeral: '03',
    title: 'The Gap',
    body: 'The difference between a project with 12 stars and one with 12,000? Rarely just the code. Almost always the story told around it.',
  },
  {
    numeral: '04',
    title: 'The Fix',
    body: 'Odyn reads your README the way a stranger would—highlighting the friction, the missing pieces, and the opportunities to be understood.',
  }
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
  }
};

const wordVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

const SceneCard = ({ card }) => {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });
  
  // Subtle parallax drift on the numeral (±20px)
  const yParallax = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      className="relative p-8 md:p-10 overflow-hidden flex flex-col justify-end min-h-[320px] 
                 bg-white dark:bg-brand-cream-dark
                 border border-brand-charcoal/5 dark:border-white/10 
                 rounded-2xl shadow-[0_4px_32px_rgba(28,25,23,0.06)] 
                 transition-transform duration-500 hover:-translate-y-2 group"
    >
      <motion.div 
        className="absolute top-0 right-4 text-[140px] font-serif leading-none text-brand-terracotta/[0.15] dark:text-brand-terracotta/[0.1] select-none pointer-events-none transition-transform duration-700 group-hover:scale-105"
      >
        {card.numeral}
      </motion.div>
      <div className="relative z-10">
        <h3 className="font-serif text-3xl md:text-4xl text-brand-charcoal mb-4 transition-colors group-hover:text-brand-terracotta dark:text-brand-cream">
          {card.title}
        </h3>
        <p className="font-sans text-lg md:text-xl text-brand-charcoal/70 dark:text-brand-cream/70 leading-relaxed">
          {card.body}
        </p>
      </div>
    </motion.div>
  );
};

const StorySection = React.memo(() => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  const headline = "Every great project deserves to be understood.";
  const headlineWords = headline.split(' ');

  return (
    <section id="story" className="py-32 md:py-48 px-6 relative border-none -mt-[1px]">
      <div className="max-w-5xl mx-auto relative z-10" ref={sectionRef}>
        
        {/* Header */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-sm tracking-[0.2em] uppercase font-bold text-brand-terracotta mb-6"
          >
            Why It Exists
          </motion.div>
          
          <motion.h2 
            className="font-serif text-4xl md:text-5xl lg:text-6xl text-brand-charcoal dark:text-brand-cream leading-[1.1] max-w-2xl"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
              hidden: {}
            }}
          >
            {headlineWords.map((word, i) => (
              <motion.span key={i} variants={wordVariants} className="inline-block mr-[0.25em]">
                {word}
              </motion.span>
            ))}
          </motion.h2>
        </div>

        {/* Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-20"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          {cards.map((card) => (
            <SceneCard key={card.numeral} card={card} />
          ))}
        </motion.div>

        {/* Soft CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center md:text-left"
        >
          <button 
            onClick={() => {
              const el = document.getElementById('analyzer-input');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="font-serif text-xl italic text-brand-charcoal/60 dark:text-brand-cream/60 hover:text-brand-terracotta transition-colors group"
          >
            See what Odyn found in yours <span className="inline-block transition-transform group-hover:translate-x-1 ml-1">→</span>
          </button>
        </motion.div>

      </div>
    </section>
  );
});

export default StorySection;
