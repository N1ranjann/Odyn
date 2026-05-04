import React from 'react';
import { motion } from 'framer-motion';
import { History, Trash2, Clock, ChevronRight } from 'lucide-react';

export default function HistoryList({ history, onSelect, onClear }) {
  if (history.length === 0) return null;

  return (
    <section id="history" className="py-24 px-6 relative border-none -mt-[1px]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-charcoal/5 flex items-center justify-center text-brand-charcoal/40">
              <History className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-3xl text-brand-charcoal">Recent Analysis</h2>
          </div>
          <button 
            onClick={onClear}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-terracotta hover:text-brand-terracotta/70 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </div>

        <div className="grid gap-4">
          {history.map((item, idx) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onSelect(item)}
              className="group w-full flex items-center gap-6 p-6 bg-brand-charcoal/5 rounded-3xl border border-brand-charcoal/10 hover:border-brand-terracotta/20 hover:bg-brand-charcoal/10 transition-all text-left shadow-sm"
            >
              {item.type === 'compare' ? (
                <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center bg-brand-charcoal/5 border border-brand-charcoal/10">
                  <span className="font-serif text-sm font-bold text-brand-sage leading-none mb-0.5">{item.scoreA}</span>
                  <span className="text-[9px] font-bold text-brand-charcoal/40 leading-none">VS</span>
                  <span className="font-serif text-sm font-bold text-brand-terracotta leading-none mt-0.5">{item.scoreB}</span>
                </div>
              ) : (
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-serif text-xl font-bold ${
                  item.score >= 80 ? 'bg-[var(--score-success-bg)] text-[var(--score-success)]' : 
                  item.score >= 60 ? 'bg-[var(--score-warning-bg)] text-[var(--score-warning)]' : 'bg-[var(--score-critical-bg)] text-[var(--score-critical)]'
                }`}>
                  {item.score}
                </div>
              )}

              <div className="flex-1">
                <h4 className="font-serif text-xl text-brand-charcoal group-hover:text-brand-terracotta transition-colors mb-1 truncate">
                  {item.title}
                </h4>
                <div className="flex items-center gap-4 text-xs text-brand-charcoal/40">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(item.timestamp).toLocaleDateString()}</span>
                  {item.type !== 'compare' && (
                    <>
                      <span>{item.metrics.headings} Headings</span>
                      <span>{item.metrics.links} Links</span>
                    </>
                  )}
                  {item.type === 'compare' && (
                    <span className="font-medium text-brand-terracotta/70 uppercase tracking-widest text-[10px]">Comparison Mode</span>
                  )}
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-brand-charcoal/20 group-hover:text-brand-terracotta group-hover:translate-x-1 transition-all" />
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
