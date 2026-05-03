import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Eye, LayoutGrid, CheckSquare,
  ChevronDown, ChevronUp, Copy, Check,
  ArrowUp, Sparkles, AlertCircle, Info,
  Lightbulb, TrendingUp, FileText, Code,
  Link2, Image as ImageIcon, Award, RotateCcw,
  Share2, Star, GitFork, Globe, Sun, Moon
} from 'lucide-react';
import CircularProgress, { getScoreColor } from './CircularProgress';

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
  const [expandedIssue, setExpandedIssue] = useState(null);
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const dashRef = useRef(null);

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

  const { scores = {}, issues = [], strengths = [], headings = [], sections = {}, metrics = {}, comparison = [], repoMetadata = null } = results;

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

  const criticalIssues = issues.filter(i => i.type === 'critical');
  const warnings       = issues.filter(i => i.type === 'warning');
  const suggestions    = issues.filter(i => i.type === 'suggestion');

  return (
    <section ref={dashRef} id="results" className="py-24 px-6 bg-brand-cream relative">
      <div className="max-w-5xl mx-auto pt-8">
        {/* ── Repo Metadata Header ── */}
        {repoMetadata && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-12 glass-panel p-4 rounded-3xl"
          >
            <div className="flex items-center gap-3">
              <img src={repoMetadata.ownerAvatar} alt="Owner" className="w-8 h-8 rounded-full border border-brand-charcoal/10" />
              <span className="font-medium text-brand-charcoal">{repoMetadata.language || 'Unknown Language'}</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-brand-charcoal/60">
              <span className="flex items-center gap-1.5"><Star className="w-4 h-4" /> {repoMetadata.stars?.toLocaleString() || '0'}</span>
              <span className="flex items-center gap-1.5"><GitFork className="w-4 h-4" /> {repoMetadata.forks?.toLocaleString() || '0'}</span>
            </div>
          </motion.div>
        )}

        <div className="text-center mb-16">
          <span className="inline-block py-1 px-3 rounded-full border border-brand-charcoal/10 text-brand-charcoal/60 text-sm font-medium tracking-wide mb-4 uppercase">
            Analysis Complete
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-brand-charcoal">
            Your README Score
          </h2>
        </div>

        {/* ══════════════════ SCORE OVERVIEW ══════════════════ */}
        <motion.div
          className="flex flex-col items-center gap-12 mb-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Overall circle */}
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-3xl opacity-20"
              style={{ background: getScoreColor(scores.overall).stroke }} />
            <CircularProgress score={scores.overall} size={260} strokeWidth={14} label="Overall Quality" />
          </div>

          {/* 4 metric cards */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full"
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
                  className="glass-panel rounded-2xl p-5 subtle-shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.bg }}>
                      <Icon className="w-4 h-4" style={{ color: colors.stroke }} />
                    </div>
                    <span className="text-sm font-medium text-brand-charcoal/70">{config.label}</span>
                  </div>
                  <CircularProgress score={score} size={80} strokeWidth={6} delay={0.2 + idx * 0.1} />
                  <p className="text-xs text-brand-charcoal/50 mt-3 leading-relaxed">{config.summary(score)}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* ══════════════════ METRICS SUMMARY BAR ══════════════════ */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-20"
          variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}
        >
          {[
            { icon: LayoutGrid,  label: 'Headings',    value: metrics.headingsCount || 0 },
            { icon: Link2,       label: 'Links',       value: metrics.linksCount || 0 },
            { icon: ImageIcon,   label: 'Images',      value: metrics.imagesCount || 0 },
            { icon: Code,        label: 'Code Blocks', value: metrics.codeBlocksCount || 0 },
            { icon: Award,       label: 'Badges',      value: metrics.badgesCount || 0 },
          ].map((m) => (
            <motion.div key={m.label} variants={fadeUp}
              className="flex items-center gap-3 glass-panel rounded-xl p-4">
              <m.icon className="w-4 h-4 text-brand-charcoal/40" />
              <div>
                <div className="text-lg font-serif text-brand-charcoal">{m.value}</div>
                <div className="text-xs text-brand-charcoal/50">{m.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ══════════════════ ISSUES ══════════════════ */}
        {issues.length > 0 && (
          <motion.div className="mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="font-serif text-2xl text-brand-charcoal mb-6">Issues & Suggestions</h3>
            <div className="space-y-3">
              {[...criticalIssues, ...warnings, ...suggestions].map((issue, idx) => {
                const Icon = issueIcons[issue.type] || Info;
                const isOpen = expandedIssue === idx;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className={`rounded-xl border ${issueBorder[issue.type]} overflow-hidden`}
                  >
                    <button
                      onClick={() => setExpandedIssue(isOpen ? null : idx)}
                      className={`w-full flex items-center gap-3 p-4 text-left ${issueBg[issue.type]} hover:brightness-[0.98] transition-all`}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${issueText[issue.type]}`} />
                      <span className={`text-sm font-medium flex-1 ${issueText[issue.type]}`}>{issue.text}</span>
                      {issue.fix && (
                        isOpen ? <ChevronUp className="w-4 h-4 text-brand-charcoal/40" /> : <ChevronDown className="w-4 h-4 text-brand-charcoal/40" />
                      )}
                    </button>
                    <AnimatePresence>
                      {isOpen && issue.fix && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 bg-brand-cream border-t border-brand-charcoal/5">
                            <p className="text-sm text-brand-charcoal/60 font-medium mb-2">How to fix:</p>
                            <pre className="text-xs font-mono bg-brand-cream-dark rounded-lg p-3 whitespace-pre-wrap text-brand-charcoal/80">{issue.fix}</pre>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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

        {/* ══════════════════ STRENGTHS ══════════════════ */}
        {strengths.length > 0 && (
          <motion.div className="mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="font-serif text-2xl text-brand-charcoal mb-6">What's Working Well</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {strengths.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 p-4 bg-[var(--score-success-bg)] border border-[var(--score-success)]/10 rounded-xl"
                >
                  <Check className="w-5 h-5 text-[var(--score-success)] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-brand-charcoal/70">{s}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ══════════════════ STRUCTURE VISUALIZATION ══════════════════ */}
        {headings.length > 0 && (
          <motion.div className="mb-16" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="font-serif text-2xl text-brand-charcoal mb-6">Document Structure</h3>
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
          <h3 className="font-serif text-2xl text-brand-charcoal mb-2">Compare to Popular Repos</h3>
          <p className="text-sm text-brand-charcoal/50 mb-6">See how your README stacks up against well-known open-source projects.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {comparison.map((repo, i) => {
              const diff = scores.overall - repo.overall;
              return (
                <motion.div
                  key={repo.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel rounded-2xl p-5 subtle-shadow text-center hover:-translate-y-1 transition-all duration-300"
                >
                  <p className="text-xs text-brand-charcoal/50 mb-1">{repo.owner}</p>
                  <p className="font-serif text-lg text-brand-charcoal mb-3">{repo.name}</p>
                  <CircularProgress score={repo.overall} size={72} strokeWidth={5} delay={0.3 + i * 0.15} />
                  <div className={`mt-3 text-xs font-medium ${diff >= 0 ? 'text-[#2D5A27]' : 'text-brand-terracotta'}`}>
                    {diff >= 0 ? `+${diff} ahead` : `${diff} behind`}
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
    </section>
  );
}
