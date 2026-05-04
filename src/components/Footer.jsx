import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Heart, Coffee, ExternalLink, ChevronDown } from 'lucide-react';

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const socialLinks = [
  { name: 'GitHub', icon: GithubIcon, url: 'https://github.com/N1ranjann' },
  { name: 'LinkedIn', icon: LinkedinIcon, url: 'https://www.linkedin.com/in/niranjan-remesh-030477277/' },
  { name: 'Instagram', icon: InstagramIcon, url: 'https://www.instagram.com/_n1ranjann' },
];

const faqs = [
  {
    question: "What makes a README 'Excellent'?",
    answer: "An excellent README is clear, concise, and visual. It should include an overview, quick installation guide, usage examples, and clear contribution guidelines. High-quality READMEs often use badges, images, and a consistent heading hierarchy."
  },
  {
    question: "How is the score calculated?",
    answer: "Our engine analyzes structure (heading hierarchy), readability (Flesch-Kincaid), completeness (essential sections), and visual elements (images, code blocks, badges). Each category contributes to an overall weighted score."
  },
  {
    question: "Can I use these templates for commercial projects?",
    answer: "Absolutely. All templates provided in Odyn are free to use and licensed under MIT. Feel free to adapt them to any project type."
  },
  {
    question: "Does Odyn store my GitHub data?",
    answer: "No. Odyn is a client-side application. We fetch your README directly from GitHub's public API and process it in your browser. We don't have a database for your code."
  },
  {
    question: "Why is my score lower than expected?",
    answer: "Scores are based on objective heuristics like heading density, presence of key sections (Install, Usage, License), and sentence complexity. A low score usually means there's room for structural improvement."
  },
  {
    question: "Can I analyze private repositories?",
    answer: "Currently, Odyn only supports public repositories via URL. For private repos, you can copy and paste the markdown directly into the 'Paste Markdown' tab."
  }
];

export function Footer({ onNavigate }) {
  const handleScroll = (e, id) => {
    e.preventDefault();
    if (onNavigate) onNavigate('landing');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="bg-brand-cream-dark text-brand-charcoal pt-24 pb-12 px-6 transition-colors duration-500 border-t border-brand-charcoal/5">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" alt="Odyn Logo" className="h-16 w-auto object-contain" />
            </div>
            <p className="text-brand-charcoal/60 max-w-sm mb-8 leading-relaxed">
              The editorial-grade README analyzer designed to help developers create documentation that stands out. Build better open source, one README at a time.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-brand-cream/5 flex items-center justify-center hover:bg-brand-terracotta transition-colors group"
                  aria-label={link.name}
                >
                  <link.icon className="w-5 h-5 text-brand-charcoal/40 group-hover:text-brand-terracotta transition-colors" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6">Product</h4>
            <ul className="space-y-4 text-brand-charcoal/60 text-sm">
              <li><a href="#analyzer-input" onClick={(e) => handleScroll(e, 'analyzer-input')} className="hover:text-brand-terracotta transition-colors">Analyzer</a></li>
              <li><a href="#templates" onClick={(e) => handleScroll(e, 'templates')} className="hover:text-brand-terracotta transition-colors">Templates</a></li>
              <li><a href="#history" onClick={(e) => handleScroll(e, 'history')} className="hover:text-brand-terracotta transition-colors">History</a></li>
              <li><a href="#faq" onClick={(e) => handleScroll(e, 'faq')} className="hover:text-brand-terracotta transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-6">Connect</h4>
            <ul className="space-y-4 text-brand-charcoal/60 text-sm">
              <li><a href="https://github.com/N1ranjann" target="_blank" className="hover:text-brand-terracotta transition-colors">GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/niranjan-remesh-030477277/" target="_blank" className="hover:text-brand-terracotta transition-colors">LinkedIn</a></li>
              <li><a href="tel:+919061970617" className="hover:text-brand-terracotta transition-colors">+91 9061970617</a></li>
              <li><a href="mailto:remeshniranjan@gmail.com" className="hover:text-brand-terracotta transition-colors">remeshniranjan@gmail.com</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-brand-cream/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-brand-charcoal/60 text-xs tracking-wide">
            © 2026 Odyn Analyzer. Built by <span className="text-brand-charcoal font-medium">Niranjan Remesh</span>
          </p>
          <div className="flex items-center gap-4 text-xs text-brand-charcoal/40">
            <span className="flex items-center gap-1.5 text-brand-charcoal/60">
              Made with <Heart className="w-3.5 h-3.5 text-brand-terracotta fill-brand-terracotta" /> & <Coffee className="w-3.5 h-3.5 text-amber-400" />
            </span>
            <span className="w-1 h-1 rounded-full bg-brand-charcoal/20" />
            <a href="#" className="hover:text-brand-charcoal transition-colors">Privacy Policy</a>
            <span className="w-1 h-1 rounded-full bg-brand-charcoal/10" />
            <a href="#" className="hover:text-brand-charcoal transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = React.useState(null);

  return (
    <section id="faq" className="py-24 px-6 relative border-none -mt-[1px]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2 
            className="font-serif text-3xl md:text-4xl text-brand-charcoal mb-4"
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Frequently Asked Questions
          </motion.h2>
          <p className="text-brand-charcoal/50">Everything you need to know about Odyn and README best practices.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-panel rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-brand-charcoal/5 dark:hover:bg-white/5 transition-colors"
              >
                <span className="font-medium text-brand-charcoal">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-brand-charcoal/30 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`} />
              </button>
              <motion.div
                initial={false}
                animate={{ height: openIndex === i ? 'auto' : 0, opacity: openIndex === i ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 pt-0 text-sm text-brand-charcoal/80 leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
