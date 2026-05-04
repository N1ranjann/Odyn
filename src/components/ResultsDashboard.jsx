import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Eye, LayoutGrid, CheckSquare,
  ChevronDown, ChevronUp, Copy, Check,
  ArrowUp, Sparkles, AlertCircle, Info,
  Lightbulb, TrendingUp, FileText, Code,
  Link2, Image as ImageIcon, Award, RotateCcw,
  Share2, Star, GitFork, Globe, Sun, Moon, CheckCircle2,
  Smile, ScanLine, AlertTriangle, BadgeCheck
} from 'lucide-react';
import CircularProgress, { getScoreColor } from './CircularProgress';
import { useAnalysisMode } from '../context/AnalysisModeContext';

const metricConfig = {
  structure:    { icon: LayoutGrid,  label: 'Structure',    summary: (s) => s >= 80 ? 'Heading hierarchy is solid.' : s >= 60 ? 'Some structural issues found.' : 'Major structural problems.' },
  readability:  { icon: BookOpen,    label: 'Readability',  summary: (s) => s >= 80 ? 'Clear and easy to read.' : s >= 60 ? 'Somewhat readable.' : 'Text is hard to parse.' },
  completeness: { icon: CheckSquare, label: 'Completeness', summary: (s) => s >= 80 ? 'Covers essential sections.' : s >= 60 ? 'Missing a few sections.' : 'Several sections missing.' },
  visual:       { icon: Eye,         label: 'Visual',       summary: (s) => s >= 80 ? 'Great visual presentation.' : s >= 60 ? 'Needs more visual elements.' : 'Lacking visuals and examples.' },
};

const issueIcons = { critical: AlertCircle, warning: Info, suggestion: Lightbulb };
const issueBg    = { critical: 'bg-[var(--score-critical-bg)]', warning: 'bg-[var(--score-warning-bg)]', suggestion: 'bg-brand-sage/10' };
const issueText  = { critical: 'text-[var(--score-critical)]', warning: 'text-[var(--score-warning)]', suggestion: 'text-brand-sage' };
const issueBorder = { critical: 'border-[var(--score-critical)]/20', warning: 'border-[var(--score-warning)]/20', suggestion: 'border-brand-sage/20' };

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };

export default function ResultsDashboard({ results, markdown, onReset, onShare, isNightMode, setIsNightMode }) {
  const { analysisMode, toggleMode } = useAnalysisMode();
  const [showToast, setShowToast] = useState(false);
  const [expandedIssue, setExpandedIssue] = useState(null);
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const dashRef = useRef(null);

  useEffect(() => {
    if (analysisMode === 'strict') {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [analysisMode]);

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 800);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (dashRef.current) {
      dashRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [results]);

  if (!results || !results.scores) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <RotateCcw className="w-12 h-12 text-brand-charcoal/20 animate-spin mb-4" />
        <h3 className="text-xl font-serif text-brand-charcoal mb-2">Preparing Analysis...</h3>
        <p className="text-brand-charcoal/50 max-w-xs">One moment while we calculate your README scores.</p>
      </div>
    );
  }

  const { 
    scores = {}, 
    issues = [], 
    strengths = [], 
    headings = [], 
    sections = {}, 
    metrics = {}, 
    comparison = [], 
    repoMetadata = null,
    isCanonical = false,
    traitMatch = null,
    recognitionBanner = null
  } = results;

  const handleCopyMarkdown = async () => {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    onShare();
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const criticalIssues = issues.filter(i => i.severity === 'critical');
  const recommendedIssues = issues.filter(i => i.severity === 'recommended');
  const optionalIssues = issues.filter(i => i.severity === 'optional');

  const severityConfig = {
    critical: {
      label: 'Critical',
      icon: AlertCircle,
      borderColor: '#C1440E',
      bgColor: 'rgba(193, 68, 14, 0.06)',
      pillBg: 'rgba(193, 68, 14, 0.1)',
      textColor: 'text-[#C1440E] dark:text-[#E65F1E]'
    },
    recommended: {
      label: 'Suggested',
      icon: Info,
      borderColor: '#D97706',
      bgColor: 'rgba(217, 119, 6, 0.05)',
      pillBg: 'rgba(217, 119, 6, 0.1)',
      textColor: 'text-[#D97706] dark:text-[#F59E0B]'
    },
    optional: {
      label: 'Optional',
      icon: Lightbulb,
      borderColor: '#78716C',
      bgColor: 'rgba(120, 113, 108, 0.05)',
      pillBg: 'rgba(120, 113, 108, 0.1)',
      textColor: 'text-[#78716C] dark:text-[#A8A29E]'
    }
  };

  const sortedIssues = [...criticalIssues, ...recommendedIssues, ...optionalIssues];

  return (
    <section ref={dashRef} id="results" className="py-24 px-6 bg-brand-cream relative overflow-hidden transition-colors duration-500 min-h-screen">
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-brand-terracotta/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
      
      <div className="max-w-5xl mx-auto pt-8 relative">
        {/* ── Analysis Mode Toggle ── */}
        <div className="absolute top-0 right-0 z-30">
          <div className="flex p-1 bg-brand-charcoal/5 dark:bg-white/5 rounded-full border border-brand-charcoal/10 dark:border-white/10 backdrop-blur-md">
            <button
              onClick={() => analysisMode === 'strict' && toggleMode()}
              className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all duration-300 z-10 ${
                analysisMode === 'friendly' 
                  ? 'text-brand-terracotta' 
                  : 'text-brand-charcoal/40 dark:text-brand-cream/40 hover:text-brand-charcoal/60 dark:hover:text-brand-cream/60'
              }`}
            >
              {analysisMode === 'friendly' && (
                <motion.div 
                  layoutId="mode-pill" 
                  className="absolute inset-0 bg-brand-cream rounded-full -z-10 border border-brand-terracotta shadow-sm"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.25 }}
                />
              )}
              <Smile size={14} />
              FRIENDLY
            </button>
            <button
              onClick={() => analysisMode === 'friendly' && toggleMode()}
              className={`relative flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all duration-300 z-10 ${
                analysisMode === 'strict' 
                  ? 'text-[#F5F0E8]' 
                  : 'text-brand-charcoal/40 dark:text-brand-cream/40 hover:text-brand-charcoal/60 dark:hover:text-brand-cream/60'
              }`}
            >
              {analysisMode === 'strict' && (
                <motion.div 
                  layoutId="mode-pill" 
                  className="absolute inset-0 bg-[#1C1917] rounded-full -z-10 border border-[#1C1917] shadow-sm"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.25 }}
                />
              )}
              <ScanLine size={14} />
              STRICT
            </button>
          </div>
        </div>

        {/* ── Repo Metadata Header ── */}
        {repoMetadata && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-12 glass-panel p-4 rounded-3xl"
          >
            <div className="flex items-center gap-3">
              <img src={repoMetadata.ownerAvatar} alt="Owner" className="w-8 h-8 rounded-full border border-brand-charcoal/10" />
              <span className="font-medium text-brand-charcoal dark:text-brand-cream">{repoMetadata.language || 'Unknown Language'}</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-brand-charcoal/60 dark:text-brand-cream/60">
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4" /> {repoMetadata.stars?.toLocaleString() || '0'}</span>
              <span className="flex items-center gap-1.5"><GitFork className="w-4 h-4" /> {repoMetadata.forks?.toLocaleString() || '0'}</span>
            </div>
          </motion.div>
        )}
        {/* ── Recognition Banner ── */}
        {recognitionBanner && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 py-3 px-4 rounded-xl flex items-start gap-3 border border-[#6B8F71]/25 bg-[#6B8F71]/10 border-l-[3px] border-l-[#6B8F71]"
          >
            <BadgeCheck size={16} className="text-[#6B8F71] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-brand-charcoal/80 dark:text-brand-cream/90 leading-relaxed font-sans">
              {recognitionBanner.text}
            </p>
          </motion.div>
        )}

        {/* ── Trait Match Note ── */}
        {!isCanonical && traitMatch && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-xl flex items-center gap-3 border border-brand-sage/20 bg-brand-sage/5"
          >
            <Lightbulb className="w-4 h-4 text-brand-sage" />
            <p className="text-sm text-brand-charcoal/70 dark:text-brand-cream/70 font-sans">
              Your README follows patterns similar to <span className="font-bold text-brand-sage">{traitMatch.owner}/{traitMatch.repo}</span>.
            </p>
          </motion.div>
        )}

        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full border border-brand-charcoal/10 dark:border-white/10 text-brand-charcoal/60 dark:text-brand-cream/60 text-sm font-medium tracking-wide mb-4 uppercase">
            Analysis Complete
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-brand-charcoal dark:text-brand-cream">
            Your README Score
          </h2>
        </div>

        {/* 1. OVERALL SCORE ARC */}
        <motion.div
          className="flex flex-col items-center mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-3xl opacity-20"
              style={{ background: getScoreColor(scores.overall).stroke }} />
            <CircularProgress score={scores.overall} size={260} strokeWidth={14} label="Overall Quality" />
          </div>
        </motion.div>

        {/* 2. STRENGTHS/IMPROVEMENTS BALANCE BAR */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 p-8 glass-panel rounded-2xl relative overflow-hidden group"
        >
          <div className="flex justify-between items-end mb-4">
            <div>
              <h4 className="text-[10px] font-bold tracking-[0.2em] text-brand-charcoal/40 dark:text-brand-cream/40 uppercase mb-1">Overview</h4>
              <p className="text-sm font-medium text-[var(--score-success)]">{results.passedRules?.length || 0} passing</p>
            </div>
            <p className="text-sm font-medium text-[var(--score-critical)] text-right">{issues?.length || 0} to improve</p>
          </div>
          
          <div className="h-2 w-full bg-brand-charcoal/5 dark:bg-brand-cream/5 rounded-full flex overflow-hidden">
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ 
                width: `${((results.passedRules?.length || 0) / ((results.passedRules?.length || 0) + (issues?.length || 0)) * 100) || 0}%`,
                originX: 0,
                backgroundColor: 'var(--score-success)'
              }}
              className="h-full"
            />
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ 
                width: `${((issues?.length || 0) / ((results.passedRules?.length || 0) + (issues?.length || 0)) * 100) || 0}%`,
                originX: 0,
                backgroundColor: 'var(--score-critical)'
              }}
              className="h-full opacity-90"
            />
          </div>
        </motion.div>

        {/* 3. STRENGTHS PANEL */}
        {results.passedRules && results.passedRules.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="p-8 rounded-2xl border transition-colors duration-500 mb-16 bg-[var(--score-success-bg)] border-[var(--score-success)]/10"
          >
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 className="w-4 h-4 text-[var(--score-success)]" />
              <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[var(--score-success)] font-sans">
                Strengths
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
              {results.passedRules.map((rule, idx) => (
                <div key={rule.id || idx} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[var(--score-success)]/10 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-[var(--score-success)]" />
                  </div>
                  <span className="text-sm text-brand-charcoal/80 dark:text-brand-cream/80 font-medium">
                    {rule.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 4. SUB-SCORES ROW */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-16"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {Object.entries(metricConfig).map(([key, config], idx) => {
            const Icon = config.icon;
            const score = scores[key];
            const colors = getScoreColor(score);
            return (
            <motion.div
              key={key}
              variants={fadeUp}
              whileHover={{ y: -4, boxShadow: '0 12px 40px rgba(28,25,23,0.12)' }}
              className="p-6 rounded-2xl bg-[var(--card-bg)] border border-brand-charcoal/5 dark:border-white/5 subtle-shadow transition-all duration-300 cursor-default"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: colors.bg }}>
                  <Icon className="w-5 h-5" style={{ color: colors.stroke }} />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-brand-charcoal/40 uppercase font-sans">{config.label}</span>
              </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <CircularProgress score={score} size={68} strokeWidth={5} delay={0.2 + idx * 0.1} />
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-serif text-brand-charcoal leading-none">{score}</span>
                    <p className="text-[10px] font-bold text-brand-charcoal/30 mt-1 uppercase tracking-tighter">Score</p>
                  </div>
                </div>

                {key === 'readability' && (
                  <p className="text-[10px] text-brand-charcoal/40 mt-5 italic leading-tight border-t border-brand-charcoal/5 pt-4">
                    Readability measures layout and scannability — not writing quality.
                  </p>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* 5. IMPROVEMENTS PANEL */}
        {issues.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.15, ease: "easeOut" }}
            className="mb-20"
          >
            <div className="flex items-center gap-2 mb-6 ml-1">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-terracotta" />
              <h3 className="text-[11px] font-bold tracking-[0.15em] uppercase text-brand-terracotta font-sans">
                Improvements
              </h3>
            </div>
            <div className="space-y-4">
              {sortedIssues.map((issue, idx) => {
                const config = severityConfig[issue.severity];
                const Icon = config.icon;
                return (
                  <motion.div
                    key={issue.id || idx}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden group"
                    style={{ 
                      backgroundColor: config.bgColor,
                      borderLeft: `4px solid ${config.borderColor}`,
                      borderRadius: '12px'
                    }}
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.textColor}`} style={{ backgroundColor: config.pillBg }}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <h4 className="font-serif text-xl text-brand-charcoal dark:text-brand-cream">{issue.label}</h4>
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border-current border-opacity-20 ${config.textColor} bg-white/80 dark:bg-white/20 backdrop-blur-sm border`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-brand-charcoal/70 dark:text-brand-cream/70 text-sm leading-relaxed max-w-3xl">
                        {issue.message}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ═══════ CELEBRATION (if no critical issues) ═══════ */}
        {criticalIssues.length === 0 && scores.overall >= 75 && (
          <motion.div
            className="mb-16 p-8 rounded-2xl bg-[var(--score-success-bg)] border border-[var(--score-success)]/20 text-center"
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          >
            <Sparkles className="w-10 h-10 text-[var(--score-success)] mx-auto mb-3" />
            <h3 className="font-serif text-2xl text-[var(--score-success)] mb-2">Looking great!</h3>
            <p className="text-sm text-[var(--score-success)]/70">Your README has no critical issues and scores above average. Nice work.</p>
          </motion.div>
        )}


        {/* ══════════════════ STRUCTURE VISUALIZATION ══════════════════ */}
        {headings.length > 0 && (
          <motion.div className="mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="font-serif text-2xl text-brand-charcoal dark:text-brand-cream mb-6">Document Structure</h3>
            <div className="glass-panel rounded-2xl p-6 overflow-x-auto">
              {headings.map((h, i) => {
                const indent = (h.level - 1) * 28;
                const isH1 = h.level === 1;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-2 py-1.5"
                    style={{ paddingLeft: indent }}
                  >
                    <span className={`inline-block w-7 h-5 rounded text-center text-[10px] font-mono font-bold leading-5 ${
                      isH1 ? 'bg-brand-terracotta/15 text-brand-terracotta' : 'bg-brand-charcoal/5 text-brand-charcoal/50'
                    }`}>
                      H{h.level}
                    </span>
                    {/* Connector line */}
                    {h.level > 1 && (
                      <div className="w-4 border-t border-dashed border-brand-charcoal/15" />
                    )}
                    <span className={`text-sm ${isH1 ? 'font-semibold text-brand-charcoal' : 'text-brand-charcoal/70'}`}>
                      {h.text}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ══════════════════ COMPARISON ══════════════════ */}
        <motion.div className="mb-20" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="font-serif text-2xl text-brand-charcoal dark:text-brand-cream mb-2">Compare to Popular Repos</h3>
          <p className="text-sm text-brand-charcoal/50 dark:text-brand-cream/50 mb-8">See how your README stacks up against well-known open-source projects.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {comparison.map((repo, i) => {
              const diff = scores.overall - repo.overall;
              return (
                <motion.div
                  key={repo.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel rounded-2xl p-6 subtle-shadow text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group"
                >
                  <p className="text-[10px] font-bold tracking-widest text-brand-charcoal/60 dark:text-brand-cream/60 mb-2 uppercase">{repo.owner}</p>
                  <p className="font-serif text-xl text-brand-charcoal dark:text-brand-cream mb-6">{repo.name}</p>
                  
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                       <CircularProgress score={repo.overall} size={84} strokeWidth={6} delay={0.3 + i * 0.15} />
                    </div>
                  </div>

                  <div className={`text-sm font-bold flex items-center justify-center gap-1.5 ${diff >= 0 ? 'text-[var(--score-success)]' : 'text-[var(--score-critical)]'}`}>
                    {diff >= 0 ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
                    {diff >= 0 ? `+${diff} ahead` : `${Math.abs(diff)} behind`}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ══════════════════ EXPORT & ACTIONS ══════════════════ */}
        <motion.div
          className="flex flex-wrap gap-4 justify-center items-center py-12 border-t border-brand-charcoal/5"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        >
          <button
            onClick={handleCopyMarkdown}
            className="flex items-center gap-2 px-8 py-4 bg-brand-charcoal text-brand-cream rounded-2xl font-medium hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-brand-charcoal/10"
          >
            {copied ? <><Check className="w-4 h-4 text-green-400" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Markdown</>}
          </button>
          
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-8 py-4 bg-brand-cream border border-brand-charcoal/10 text-brand-charcoal rounded-2xl font-medium hover:bg-brand-charcoal/5 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            {shareCopied ? <><Check className="w-4 h-4 text-green-500" /> URL Copied!</> : <><Share2 className="w-4 h-4" /> Share Report</>}
          </button>

          {onReset && (
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-8 py-4 border border-brand-terracotta/20 text-brand-terracotta rounded-2xl font-medium hover:bg-brand-terracotta/5 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <RotateCcw className="w-4 h-4" /> New Analysis
            </button>
          )}
        </motion.div>
      </div>

      {/* ══════════════════ BACK TO TOP ══════════════════ */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-brand-charcoal text-brand-cream flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 border border-brand-cream/10"
            aria-label="Back to top"
          >
            <ArrowUp className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
      {/* Strict Mode Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 24, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 24, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-[60] bg-[#1C1917] text-[#F5F0E8] px-5 py-2.5 rounded-full text-sm font-medium shadow-2xl border border-white/10 backdrop-blur-md"
          >
            Strict mode enabled — scoring is now editorial grade.
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
