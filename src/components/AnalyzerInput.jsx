import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Globe, Loader2, ArrowRight, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { analyzeReadme } from '../utils/analyzer';
import { poorReadme, mediocreReadme, goodReadme } from '../data/sampleReadmes';
import { fetchRepoMetadata, parseGitHubUrl } from '../utils/github';

export default function AnalyzerInput({ onResults, onCompareResults }) {
  const [appMode, setAppMode] = useState('single');
  
  const [inputA, setInputA] = useState({ type: 'url', url: '', markdown: '' });
  const [inputB, setInputB] = useState({ type: 'url', url: '', markdown: '' });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGithubReadme = async (url) => {
    const repoInfo = parseGitHubUrl(url);
    if (!repoInfo) throw new Error(`Invalid format for URL: ${url}. Use 'owner/repo' or full GitHub URL.`);
    
    const { owner, repo } = repoInfo;
    const [readmeRes, metaRes] = await Promise.all([
      axios.get(`https://api.github.com/repos/${owner}/${repo}/readme`, { timeout: 20000 }),
      fetchRepoMetadata(owner, repo)
    ]);

    const base64 = readmeRes.data.content.replace(/\s/g, '');
    const decoded = decodeURIComponent(atob(base64).split('').map(c => 
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));
    
    return { markdown: decoded, metadata: metaRes };
  };

  const handleAnalyzeSingle = async () => {
    setError(null);
    setLoading(true);
    try {
      let md = inputA.markdown;
      let meta = null;
      if (inputA.type === 'url') {
        if (!inputA.url.trim()) throw new Error("Please enter a GitHub URL.");
        const res = await fetchGithubReadme(inputA.url);
        md = res.markdown;
        meta = res.metadata;
        setInputA({ ...inputA, markdown: md });
      } else {
        if (!md.trim()) throw new Error("Please provide markdown content.");
      }
      const results = analyzeReadme(md, 'friendly', meta);
      if (meta) results.repoMetadata = meta;
      onResults(results, md);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeCompare = async () => {
    setError(null);
    setLoading(true);
    try {
      let mdA = inputA.markdown;
      let metaA = null;
      if (inputA.type === 'url') {
        if (!inputA.url.trim()) throw new Error("Please enter a GitHub URL for Repo A.");
      } else if (!mdA.trim()) throw new Error("Please provide markdown for Repo A.");

      let mdB = inputB.markdown;
      let metaB = null;
      if (inputB.type === 'url') {
        if (!inputB.url.trim()) throw new Error("Please enter a GitHub URL for Repo B.");
      } else if (!mdB.trim()) throw new Error("Please provide markdown for Repo B.");

      // Fetch in parallel if URLs
      const promises = [];
      if (inputA.type === 'url') promises.push(fetchGithubReadme(inputA.url));
      else promises.push(Promise.resolve({ markdown: mdA, metadata: null }));
      
      if (inputB.type === 'url') promises.push(fetchGithubReadme(inputB.url));
      else promises.push(Promise.resolve({ markdown: mdB, metadata: null }));

      const [resA, resB] = await Promise.all(promises);
      
      mdA = resA.markdown; metaA = resA.metadata;
      mdB = resB.markdown; metaB = resB.metadata;

      setInputA(prev => ({ ...prev, markdown: mdA }));
      setInputB(prev => ({ ...prev, markdown: mdB }));

      const analysisA = analyzeReadme(mdA, 'friendly', metaA);
      if (metaA) analysisA.repoMetadata = metaA;
      
      const analysisB = analyzeReadme(mdB, 'friendly', metaB);
      if (metaB) analysisB.repoMetadata = metaB;

      onCompareResults({ A: analysisA, B: analysisB }, { A: mdA, B: mdB });
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (err) => {
    if (err.code === 'ECONNABORTED') setError("GitHub is taking too long to respond. Please try again.");
    else if (err.response?.status === 404) setError("README not found — a repo may be private or doesn't exist.");
    else if (err.response?.status === 403) setError("GitHub API rate limit exceeded. Try again later.");
    else setError(err.message || "Failed to fetch README.");
  };

  const renderInputBlock = (inputData, setInputData, label) => (
    <div className="space-y-6 w-full">
      {label && <h3 className="font-serif text-xl text-brand-terracotta mb-2 uppercase tracking-widest text-center">{label}</h3>}
      <div className="flex p-1 bg-brand-cream-dark rounded-xl mb-4 w-full max-w-sm mx-auto">
        <button onClick={() => setInputData({ ...inputData, type: 'url' })}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 ${inputData.type === 'url' ? 'bg-brand-cream text-brand-charcoal shadow-sm' : 'text-brand-charcoal/50 hover:text-brand-charcoal'}`}>
          <Globe className="w-4 h-4" /> GitHub URL
        </button>
        <button onClick={() => setInputData({ ...inputData, type: 'markdown' })}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-xs sm:text-sm transition-all duration-300 ${inputData.type === 'markdown' ? 'bg-brand-cream text-brand-charcoal shadow-sm' : 'text-brand-charcoal/50 hover:text-brand-charcoal'}`}>
          <FileText className="w-4 h-4" /> Paste Markdown
        </button>
      </div>

      <AnimatePresence mode="wait">
        {inputData.type === 'url' ? (
          <motion.div key="url" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Globe className="w-5 h-5 text-brand-charcoal/30" />
            </div>
            <input type="text" value={inputData.url} onChange={(e) => setInputData({ ...inputData, url: e.target.value })}
              placeholder="e.g. johndoe/my-project"
              className="w-full bg-brand-cream border border-brand-charcoal/10 rounded-2xl py-4 pl-12 pr-4 text-brand-charcoal font-sans text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-brand-terracotta/50 focus:border-brand-terracotta transition-all shadow-sm placeholder:text-brand-charcoal/20"
              disabled={loading} />
          </motion.div>
        ) : (
          <motion.div key="markdown" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="relative group">
            <textarea value={inputData.markdown} onChange={(e) => setInputData({ ...inputData, markdown: e.target.value })}
              placeholder="# Enter markdown..."
              className="w-full h-48 sm:h-64 bg-brand-cream border border-brand-charcoal/10 rounded-2xl p-6 text-brand-charcoal font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-sage/50 focus:border-brand-sage transition-all shadow-inner resize-y placeholder:text-brand-charcoal/20" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <section id="analyzer-input" className="min-h-screen py-24 px-6 relative z-10 flex flex-col items-center border-none -mt-[1px]">
      <div className="w-full max-w-5xl mx-auto">
        <motion.div className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
          <motion.h2 
            className="font-serif text-3xl md:text-4xl text-brand-charcoal mb-8"
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }} whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Begin the Analysis
          </motion.h2>

          {/* Single | Compare Toggle */}
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex items-center rounded-full p-1 bg-brand-charcoal/5 border border-brand-charcoal/10 relative">
              <div 
                className="absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-transform duration-300 ease-in-out"
                style={{
                  transform: appMode === 'compare' ? 'translateX(100%)' : 'translateX(0)',
                  backgroundColor: appMode === 'single' ? '#F5F0E8' : '#1C1917',
                  borderColor: appMode === 'single' ? '#C1440E' : '#1C1917'
                }}
              />
              <button 
                onClick={() => setAppMode('single')}
                className={`relative z-10 w-28 sm:w-32 py-2 text-sm font-bold uppercase tracking-wider rounded-full transition-colors ${appMode === 'single' ? 'text-brand-terracotta' : 'text-brand-charcoal/60'}`}
              >
                Single
              </button>
              <button 
                onClick={() => setAppMode('compare')}
                className={`relative z-10 w-28 sm:w-32 py-2 text-sm font-bold uppercase tracking-wider rounded-full transition-colors ${appMode === 'compare' ? 'text-[#F5F0E8]' : 'text-brand-charcoal/60'}`}
              >
                Compare
              </button>
            </div>
            <div className="h-14 sm:h-12 flex items-center justify-center max-w-lg text-center mt-2">
              <AnimatePresence mode="wait">
                {appMode === 'single' ? (
                  <motion.span key="single" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="block text-base sm:text-lg text-brand-charcoal/60">
                    Analyze a single repository to discover its strengths and areas for improvement.
                  </motion.span>
                ) : (
                  <motion.span key="compare" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="block text-base sm:text-lg text-brand-charcoal/60">
                    Compare two repositories side-by-side to identify gaps and actionable ways Repo A can match Repo B's quality.
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <motion.div className="glass-panel rounded-3xl p-6 md:p-10 subtle-shadow"
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: 0.1 }}>
          
          <AnimatePresence mode="wait">
            {appMode === 'single' ? (
              <motion.div key="single" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto flex flex-col gap-6">
                {renderInputBlock(inputA, setInputA, null)}
                
                {inputA.type === 'markdown' && (
                  <div className="flex justify-center mb-2">
                    <span className="text-sm text-brand-charcoal/50 self-center mr-2">Try a sample:</span>
                    <button onClick={() => setInputA({ ...inputA, markdown: goodReadme })} className="px-3 py-1.5 bg-brand-cream-dark text-brand-charcoal text-xs font-medium rounded-lg hover:bg-brand-charcoal hover:text-brand-cream transition-colors mr-2">Good</button>
                    <button onClick={() => setInputA({ ...inputA, markdown: mediocreReadme })} className="px-3 py-1.5 bg-brand-cream-dark text-brand-charcoal text-xs font-medium rounded-lg hover:bg-brand-charcoal hover:text-brand-cream transition-colors mr-2">Mediocre</button>
                    <button onClick={() => setInputA({ ...inputA, markdown: poorReadme })} className="px-3 py-1.5 bg-brand-cream-dark text-brand-charcoal text-xs font-medium rounded-lg hover:bg-brand-charcoal hover:text-brand-cream transition-colors">Poor</button>
                  </div>
                )}
                
                <button onClick={handleAnalyzeSingle} disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-brand-charcoal text-brand-cream rounded-2xl font-medium text-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed">
                  {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Fetching & Analyzing...</> : <><ArrowRight className="w-5 h-5" /> Analyze Repository</>}
                </button>
              </motion.div>
            ) : (
              <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                  {renderInputBlock(inputA, setInputA, "Repo A")}
                  {renderInputBlock(inputB, setInputB, "Repo B")}
                </div>
                <div className="flex justify-center mt-4">
                  <button onClick={handleAnalyzeCompare} disabled={loading}
                    className="w-full md:w-auto md:min-w-[300px] flex items-center justify-center gap-2 py-4 bg-brand-terracotta text-brand-cream rounded-2xl font-medium text-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed">
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Comparing...</> : <><ArrowRight className="w-5 h-5" /> Analyze Both</>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }} className="overflow-hidden">
                <div className="flex items-start gap-3 p-4 bg-brand-terracotta/10 border border-brand-terracotta/20 text-brand-terracotta rounded-xl">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
