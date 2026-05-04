import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout, X, Copy, Zap, ArrowRight, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { templates } from '../data/templates';

export default function TemplateLibrary({ onSelectTemplate }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="templates" className="py-24 px-6 relative border-none -mt-[1px]">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="font-serif text-4xl md:text-5xl text-brand-charcoal mb-4"
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            README Templates
          </motion.h2>
          <p className="text-brand-charcoal/60 max-w-2xl mx-auto">
            Choose from our professionally crafted templates to kickstart your project documentation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templates.map((template, idx) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel rounded-3xl p-8 subtle-shadow hover:shadow-xl transition-all group flex flex-col h-full"
            >
              <div className="mb-6 h-40 bg-brand-cream-dark/30 rounded-2xl overflow-hidden relative border border-brand-charcoal/5">
                <div className="absolute inset-0 p-4 transform group-hover:scale-105 transition-transform duration-500 origin-top">
                  <div className="text-[6px] text-brand-charcoal/40 font-mono leading-tight whitespace-pre-wrap select-none pointer-events-none">
                    {template.markdown.substring(0, 400)}...
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-brand-cream-dark/80 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-brand-cream/50 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-charcoal/60">
                  {template.category}
                </div>
              </div>

              <h3 className="font-serif text-2xl text-brand-charcoal mb-3">{template.name}</h3>
              <p className="text-brand-charcoal/60 text-sm mb-8 flex-grow">{template.description}</p>

              <button
                onClick={() => setSelectedTemplate(template)}
                className="w-full flex items-center justify-center gap-2 py-4 bg-brand-charcoal text-brand-cream rounded-2xl font-medium hover:scale-[1.02] active:scale-[0.98] transition-all group-hover:bg-brand-terracotta"
              >
                Browse Template <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-charcoal/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-brand-cream w-full max-w-4xl max-h-[85vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
            >
              <div className="p-6 border-b border-brand-charcoal/5 flex items-center justify-between bg-brand-cream/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-terracotta/10 flex items-center justify-center text-brand-terracotta">
                    <Layout className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl text-brand-charcoal">{selectedTemplate.name}</h3>
                    <p className="text-xs text-brand-charcoal/50 uppercase tracking-widest font-bold">{selectedTemplate.category}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTemplate(null)}
                  className="p-2 hover:bg-brand-charcoal/5 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-brand-charcoal/40" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 lg:p-12">
                <div className="prose prose-slate max-w-none prose-h1:font-serif prose-h2:font-serif text-brand-charcoal">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {selectedTemplate.markdown}
                  </ReactMarkdown>
                </div>
              </div>

              <div className="p-6 bg-brand-cream/30 border-t border-brand-charcoal/5 flex flex-wrap gap-4 items-center justify-between">
                <div className="text-sm text-brand-charcoal/60 bg-brand-cream-dark px-4 py-2 rounded-xl border border-brand-charcoal/5">
                  <span className="font-bold text-brand-terracotta">Pro Tip:</span> This template scores high on completeness.
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleCopy(selectedTemplate.markdown)}
                    className="flex items-center gap-2 px-6 py-3 bg-brand-cream border border-brand-charcoal/10 text-brand-charcoal rounded-xl font-medium hover:bg-brand-charcoal hover:text-brand-cream transition-all"
                  >
                    {copied ? <><Check className="w-4 h-4 text-green-500" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Raw</>}
                  </button>
                  <button
                    onClick={() => {
                      onSelectTemplate(selectedTemplate.markdown);
                      setSelectedTemplate(null);
                    }}
                    className="flex items-center gap-2 px-8 py-3 bg-brand-terracotta text-brand-cream rounded-xl font-medium hover:shadow-lg hover:shadow-brand-terracotta/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <Zap className="w-4 h-4" /> Use This Template
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
