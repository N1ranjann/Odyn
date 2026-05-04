import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Moon, Sun, ArrowRight, CheckCircle2, XCircle, Smile, ScanLine } from 'lucide-react';
import { useAnalysisMode } from '../context/AnalysisModeContext';

export default function CompareResultsDashboard({ resultsA, resultsB, markdownA, markdownB, isNightMode, setIsNightMode, onReset }) {
  const { analysisMode, toggleMode } = useAnalysisMode();

  // Compute Delta
  const scoreA = resultsA.scores.overall;
  const scoreB = resultsB.scores.overall;
  const delta = scoreB - scoreA;
  
  const subScores = [
    { key: 'readability', label: 'Readability' },
    { key: 'structure', label: 'Structure' },
    { key: 'completeness', label: 'Completeness' },
    { key: 'visual', label: 'Visual & Engagement' }
  ];
  
  // Gap Insights: Rules where A failed but B passed
  const gapInsights = useMemo(() => {
    if (!resultsA || !resultsB) return [];
    
    const gaps = [];
    resultsA.issues.forEach(issueA => {
      const passedInB = resultsB.passedRules.find(r => r.id === issueA.id);
      if (passedInB) {
        gaps.push(issueA);
      }
    });
    return gaps;
  }, [resultsA, resultsB]);

  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal transition-colors duration-500 pb-24">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-brand-cream/80 backdrop-blur-xl border-b border-brand-charcoal/5 px-6 py-4 flex items-center justify-between">
        <button onClick={onReset} className="flex items-center gap-2 px-4 py-2 text-brand-charcoal hover:bg-brand-charcoal/5 rounded-full transition-all text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back to Input
        </button>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-brand-charcoal/5 rounded-full text-sm font-mono">
            <span className="opacity-50">Compare Mode</span>
            <span className="opacity-30">•</span>
            <span className="text-brand-terracotta">{analysisMode}</span>
          </div>

          <button onClick={() => setIsNightMode(!isNightMode)} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-brand-charcoal/5 transition-all group">
            {isNightMode ? <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform" /> : <Moon className="w-5 h-5 text-brand-charcoal group-hover:-rotate-12 transition-transform" />}
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 relative">
        
        {/* ── Analysis Mode Toggle ── */}
        <div className="absolute top-4 right-4 md:right-6 z-30">
          <div className="flex p-1 bg-brand-charcoal/5 rounded-full border border-brand-charcoal/10 backdrop-blur-md">
            <button
              onClick={() => analysisMode === 'strict' && toggleMode()}
              className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all duration-300 z-10 ${
                analysisMode === 'friendly' 
                  ? 'text-brand-terracotta' 
                  : 'text-brand-charcoal/40 hover:text-brand-charcoal/60'
              }`}
            >
              {analysisMode === 'friendly' && (
                <motion.div 
                  layoutId="compare-mode-pill" 
                  className="absolute inset-0 bg-brand-cream rounded-full -z-10 border border-brand-terracotta shadow-sm"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.25 }}
                />
              )}
              <Smile size={14} />
              <span className="hidden sm:inline">FRIENDLY</span>
            </button>
            <button
              onClick={() => analysisMode === 'friendly' && toggleMode()}
              className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all duration-300 z-10 ${
                analysisMode === 'strict' 
                  ? 'text-[#F5F0E8]' 
                  : 'text-brand-charcoal/40 hover:text-brand-charcoal/60'
              }`}
            >
              {analysisMode === 'strict' && (
                <motion.div 
                  layoutId="compare-mode-pill" 
                  className="absolute inset-0 bg-[#1C1917] rounded-full -z-10 border border-[#1C1917] shadow-sm"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.25 }}
                />
              )}
              <ScanLine size={14} />
              <span className="hidden sm:inline">STRICT</span>
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12 mt-12 md:mt-0">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-4xl md:text-5xl mb-4">
            Comparison Results
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-col md:flex-row justify-center items-center gap-4 text-xl">
            <div className="flex items-center gap-3">
              <span className="font-bold text-brand-sage">Repo A: {scoreA}/100</span>
              <ArrowRight className="w-5 h-5 text-brand-charcoal/30 hidden md:block" />
              <span className="font-bold text-brand-terracotta">Repo B: {scoreB}/100</span>
            </div>
            <div className="md:ml-4 px-4 py-1.5 bg-brand-charcoal/5 rounded-full text-sm font-bold">
              Overall Delta: <span className={delta > 0 ? "text-brand-sage" : delta < 0 ? "text-brand-terracotta" : "text-brand-charcoal"}>{delta > 0 ? '+' : ''}{delta} pts</span>
            </div>
          </motion.div>
        </div>

        {/* Sub-Score Deltas */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {subScores.map((score, idx) => {
            const valA = resultsA.scores[score.key];
            const valB = resultsB.scores[score.key];
            const diff = valB - valA;
            return (
              <div key={idx} className="glass-panel rounded-2xl p-4 text-center border border-brand-charcoal/10">
                <h4 className="text-xs uppercase tracking-wider text-brand-charcoal/50 mb-2 font-bold">{score.label}</h4>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-sm font-medium text-brand-sage">{valA}</span>
                  <ArrowRight className="w-3 h-3 text-brand-charcoal/30" />
                  <span className="text-sm font-medium text-brand-terracotta">{valB}</span>
                </div>
                <div className={`text-lg font-bold ${diff > 0 ? 'text-brand-sage' : diff < 0 ? 'text-brand-terracotta' : 'text-brand-charcoal'}`}>
                  {diff > 0 ? '+' : ''}{diff}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Bridge the Gap Insights */}
        {gapInsights.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-16">
            <div className="bg-brand-terracotta/5 border border-brand-terracotta/20 rounded-3xl p-8">
              <h2 className="font-serif text-2xl text-brand-terracotta mb-6 flex items-center gap-3">
                <ArrowRight className="w-6 h-6" />
                Bridge the Gap
              </h2>
              <p className="text-brand-charcoal/70 mb-6">Repo B passed the following rules that Repo A failed. Fixing these could raise Repo A's score.</p>
              
              <div className="space-y-4">
                {gapInsights.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 bg-brand-cream rounded-2xl border border-brand-charcoal/5 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-brand-sage mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-brand-charcoal">{rule.label}</h3>
                      <p className="text-sm text-brand-charcoal/60 mt-1">Repo B has this. Adding it to Repo A could help.</p>
                      <div className="mt-2 inline-block px-2 py-1 bg-brand-terracotta/10 text-brand-terracotta text-xs font-bold rounded">
                        Potential +{Math.abs(rule.deduction)} pts
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Side-by-Side Comparison Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Repo A Column */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-panel rounded-3xl p-6 border border-brand-charcoal/10">
            <h3 className="font-serif text-xl text-center mb-6 text-brand-sage uppercase tracking-widest">Repo A</h3>
            <div className="space-y-4">
              {[...resultsA.passedRules, ...resultsA.issues].map((rule, idx) => {
                const passed = resultsA.passedRules.some(r => r.id === rule.id);
                return (
                  <div key={idx} className="flex items-center justify-between p-3 bg-brand-charcoal/5 rounded-xl">
                    <span className="text-sm font-medium">{rule.label}</span>
                    {passed ? <CheckCircle2 className="w-5 h-5 text-brand-sage" /> : <XCircle className="w-5 h-5 text-brand-terracotta" />}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Repo B Column */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-panel rounded-3xl p-6 border border-brand-charcoal/10">
            <h3 className="font-serif text-xl text-center mb-6 text-brand-terracotta uppercase tracking-widest">Repo B</h3>
            <div className="space-y-4">
              {[...resultsB.passedRules, ...resultsB.issues].map((rule, idx) => {
                const passed = resultsB.passedRules.some(r => r.id === rule.id);
                return (
                  <div key={idx} className="flex items-center justify-between p-3 bg-brand-charcoal/5 rounded-xl">
                    <span className="text-sm font-medium">{rule.label}</span>
                    {passed ? <CheckCircle2 className="w-5 h-5 text-brand-sage" /> : <XCircle className="w-5 h-5 text-brand-terracotta" />}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
