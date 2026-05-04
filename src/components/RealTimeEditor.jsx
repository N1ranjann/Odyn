import React, { useState, useMemo, useEffect } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { motion } from 'framer-motion';
import { Layout, Zap, Eye, Code, Save, Trash2, ArrowLeft, Share2, Sun, Moon } from 'lucide-react';
import { analyzeReadme } from '../utils/analyzer';
import CircularProgress from './CircularProgress';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function RealTimeEditor({ initialValue, onBack, onSave, isNightMode, setIsNightMode }) {
  const [value, setValue] = useState(initialValue || '');
  const [results, setResults] = useState(null);
  const [viewMode, setViewMode] = useState(window.innerWidth < 1024 ? 'edit' : 'split'); // 'split', 'edit', 'preview'

  useEffect(() => {
    const analysis = analyzeReadme(value);
    setResults(analysis);
  }, [value]);

  const editorOptions = useMemo(() => ({
    autofocus: true,
    spellChecker: false,
    placeholder: 'Start typing your README...',
    status: false,
    minHeight: '500px',
    toolbar: [
      'bold', 'italic', 'heading', '|', 
      'quote', 'unordered-list', 'ordered-list', '|', 
      'link', 'image', 'code', '|', 
      'preview'
    ],
  }), []);

  return (
    <div className="h-screen flex flex-col bg-brand-cream transition-colors duration-500 overflow-hidden">
      {/* Editor Header */}
      <header className="h-[72px] glass-panel border-b border-brand-charcoal/10 dark:border-brand-cream/10 px-6 flex items-center justify-between z-50 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-brand-charcoal/5 dark:hover:bg-brand-cream/5 rounded-xl transition-colors"
            title="Back to Landing"
          >
            <img src="/logo.png" alt="Odyn Logo" className="h-9 w-auto object-contain dark:brightness-110" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNightMode(!isNightMode)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-brand-charcoal/5 dark:hover:bg-brand-cream/5 transition-all group"
            aria-label="Toggle Night Mode"
          >
            {isNightMode ? (
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-500" />
            ) : (
              <Moon className="w-4 h-4 text-brand-charcoal group-hover:-rotate-12 transition-transform duration-500" />
            )}
          </button>
          
          <div className="flex lg:hidden items-center bg-brand-charcoal/5 rounded-xl p-1 border border-brand-charcoal/5">
            <button onClick={() => setViewMode('edit')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'edit' ? 'bg-brand-cream text-brand-charcoal shadow-sm' : 'text-brand-charcoal/40'}`}>
              EDIT
            </button>
            <button onClick={() => setViewMode('preview')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'preview' ? 'bg-brand-cream text-brand-charcoal shadow-sm' : 'text-brand-charcoal/40'}`}>
              PREVIEW
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-brand-charcoal/5 px-4 py-1.5 rounded-full border border-brand-charcoal/5 mr-4">
            <span className="text-xs font-bold text-brand-charcoal/40 uppercase tracking-widest">Live Score:</span>
            <span className="text-sm font-bold" style={{ color: 
              results?.scores.overall >= 80 ? 'var(--score-success)' : 
              results?.scores.overall >= 60 ? 'var(--score-warning)' : 'var(--score-critical)'
            }}>
              {results?.scores.overall || 0}
            </span>
          </div>
          
          <button 
            onClick={() => onSave(results, value)}
            className="flex items-center gap-3 px-6 py-2.5 bg-brand-charcoal text-brand-cream rounded-xl font-medium hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand-charcoal/10"
          >
            <Save className="w-4 h-4" /> <span className="hidden sm:inline">Save Analysis</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Editor Side */}
        <div className={`flex-1 flex flex-col border-r border-brand-charcoal/10 dark:border-brand-cream/10 bg-brand-cream ${viewMode === 'preview' ? 'hidden' : ''}`}>
          <div className="flex-1 overflow-y-auto p-6 custom-mde-container scrollbar-thin">
            <SimpleMDE 
              value={value} 
              onChange={(val) => setValue(val)} 
              options={editorOptions} 
            />
          </div>
        </div>

        {/* Preview / Analysis Side */}
        <div className={`flex-1 bg-brand-charcoal/[0.02] overflow-y-auto scrollbar-thin ${viewMode === 'edit' ? 'hidden' : ''}`}>
          <div className="p-8 max-w-3xl mx-auto">
            {/* Live Score Widget */}
            <div className="glass-panel rounded-3xl p-8 mb-8 flex items-center justify-between shadow-sm border border-brand-charcoal/5 bg-brand-cream/80">
              <div>
                <h3 className="font-serif text-2xl text-brand-charcoal mb-2">Live Analysis</h3>
                <p className="text-sm text-brand-charcoal/50">Your changes are analyzed in real-time.</p>
              </div>
              <CircularProgress score={results?.scores.overall || 0} size={100} strokeWidth={8} />
            </div>

            {/* Quick Issues List */}
            <div className="space-y-4 mb-12">
              <h4 className="text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-[0.2em] px-1">Critical Issues</h4>
              {results?.issues.filter(i => i.type === 'critical').length === 0 ? (
                <div className="bg-brand-sage/10 border border-brand-sage/20 text-brand-sage p-5 rounded-2xl text-sm flex items-center gap-3">
                  <Zap className="w-4 h-4" /> No critical issues! Your README is looking strong.
                </div>
              ) : (
                results?.issues.filter(i => i.type === 'critical').slice(0, 3).map((issue, i) => (
                  <div key={i} className="bg-brand-terracotta/10 border border-brand-terracotta/20 text-brand-terracotta p-5 rounded-2xl text-sm leading-relaxed">
                    {issue.text}
                  </div>
                ))
              )}
            </div>

            {/* Markdown Preview */}
            <div className="glass-panel rounded-3xl p-10 shadow-sm bg-brand-cream/50 border border-brand-charcoal/5 prose max-w-none prose-h1:font-serif prose-h2:font-serif text-brand-charcoal">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {value}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
