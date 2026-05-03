import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Globe, Loader2, ArrowRight, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { analyzeReadme } from '../utils/analyzer';
import { poorReadme, mediocreReadme, goodReadme } from '../data/sampleReadmes';
import { fetchRepoMetadata, parseGitHubUrl } from '../utils/github';

export default function AnalyzerInput({ onResults }) {
  const [activeTab, setActiveTab] = useState('url');
  const [markdown, setMarkdown] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAnalysis = (md, metadata = null) => {
    const results = analyzeReadme(md);
    if (metadata) results.repoMetadata = metadata;
    onResults(results, md);
  };

  const handleAnalyze = () => {
    if (!markdown.trim()) { setError("Please provide markdown content."); return; }
    setError(null);
    setLoading(true);
    setTimeout(() => { runAnalysis(markdown); setLoading(false); }, 400);
  };

  const fetchGithubReadme = async () => {
    if (!url.trim()) { setError("Please enter a GitHub URL or repository."); return; }
    setLoading(true);
    setError(null);
    try {
      const repoInfo = parseGitHubUrl(url);
      if (!repoInfo) throw new Error("Invalid format. Use 'owner/repo' or full GitHub URL.");
      
      const { owner, repo } = repoInfo;
      const [readmeRes, metaRes] = await Promise.all([
        axios.get(`https://api.github.com/repos/${owner}/${repo}/readme`, { timeout: 20000 }),
        fetchRepoMetadata(owner, repo)
      ]);

      // Robust Base64 to UTF-8 decoding
      const base64 = readmeRes.data.content.replace(/\s/g, '');
      const decoded = decodeURIComponent(atob(base64).split('').map(c => 
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      
      setMarkdown(decoded);
      runAnalysis(decoded, metaRes);
    } catch (err) {
      if (err.code === 'ECONNABORTED') setError("GitHub is taking too long to respond. Please try again.");
      else if (err.response?.status === 404) setError("README not found — repo may be private or doesn't exist.");
      else if (err.response?.status === 403) setError("GitHub API rate limit exceeded. Try again later.");
      else setError(err.message || "Failed to fetch README.");
    } finally {
      setLoading(false);
    }
  };

  const loadSample = (sample) => {
    setActiveTab('markdown');
    setMarkdown(sample);
    setError(null);
  };

  return (
    <section id="analyzer-input" className="min-h-screen py-24 px-6 bg-brand-cream relative z-10 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto">
        <motion.div className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
          <motion.h2 
            className="font-serif text-3xl md:text-4xl text-brand-charcoal mb-4"
            initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            Begin the Analysis
          </motion.h2>
          <p className="font-sans text-brand-charcoal/60 text-lg">Connect your repository or paste markdown directly.</p>
        </motion.div>

        <motion.div className="glass-panel rounded-3xl p-4 md:p-8 subtle-shadow"
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: 0.1 }}>
          
          {/* Tab Switcher */}
          <div className="flex p-1 bg-brand-cream-dark rounded-xl mb-8 w-full max-w-md mx-auto">
            <button onClick={() => setActiveTab('url')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${activeTab === 'url' ? 'bg-brand-cream text-brand-charcoal shadow-sm' : 'text-brand-charcoal/50 hover:text-brand-charcoal'}`}>
              <Globe className="w-4 h-4" /> GitHub URL
            </button>
            <button onClick={() => setActiveTab('markdown')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${activeTab === 'markdown' ? 'bg-brand-cream text-brand-charcoal shadow-sm' : 'text-brand-charcoal/50 hover:text-brand-charcoal'}`}>
              <FileText className="w-4 h-4" /> Paste Markdown
            </button>
          </div>

          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              {activeTab === 'url' ? (
                <motion.div key="url" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}
                  className="space-y-6 max-w-2xl mx-auto pt-8">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Globe className="w-5 h-5 text-brand-charcoal/30" />
                    </div>
                    <input type="text" value={url} onChange={(e) => setUrl(e.target.value)}
                      placeholder="e.g. johndoe/my-project or https://github.com/..."
                      className="w-full bg-brand-cream border border-brand-charcoal/10 rounded-2xl py-4 pl-12 pr-4 text-brand-charcoal font-sans text-lg focus:outline-none focus:ring-2 focus:ring-brand-terracotta/50 focus:border-brand-terracotta transition-all shadow-sm placeholder:text-brand-charcoal/20"
                      disabled={loading} />
                  </div>
                  <button onClick={fetchGithubReadme} disabled={loading || !url.trim()}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-brand-charcoal text-brand-cream rounded-2xl font-medium text-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed">
                    {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Fetching & Analyzing...</> : <><ArrowRight className="w-5 h-5" /> Analyze Repository</>}
                  </button>
                </motion.div>
              ) : (
                <motion.div key="markdown" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-6">
                  <div className="relative group">
                    <textarea value={markdown} onChange={(e) => setMarkdown(e.target.value)}
                      placeholder="# Enter your markdown here...&#10;&#10;Or click one of the samples below to test."
                      className="w-full h-80 bg-brand-cream border border-brand-charcoal/10 rounded-2xl p-6 text-brand-charcoal font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-sage/50 focus:border-brand-sage transition-all shadow-inner resize-y placeholder:text-brand-charcoal/20" />
                    <div className="absolute bottom-4 right-6 text-xs text-brand-charcoal/40 font-mono pointer-events-none">
                      {markdown.length} characters
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex gap-2">
                      <span className="text-sm text-brand-charcoal/50 self-center mr-2">Try a sample:</span>
                      <button onClick={() => loadSample(goodReadme)} className="px-3 py-1.5 bg-brand-cream-dark text-brand-charcoal text-xs font-medium rounded-lg hover:bg-brand-charcoal hover:text-brand-cream transition-colors">Good</button>
                      <button onClick={() => loadSample(mediocreReadme)} className="px-3 py-1.5 bg-brand-cream-dark text-brand-charcoal text-xs font-medium rounded-lg hover:bg-brand-charcoal hover:text-brand-cream transition-colors">Mediocre</button>
                      <button onClick={() => loadSample(poorReadme)} className="px-3 py-1.5 bg-brand-cream-dark text-brand-charcoal text-xs font-medium rounded-lg hover:bg-brand-charcoal hover:text-brand-cream transition-colors">Poor</button>
                    </div>
                    <button onClick={handleAnalyze} disabled={loading || !markdown.trim()}
                      className="w-full sm:w-auto px-8 py-3 bg-brand-sage text-brand-cream rounded-xl font-medium transition-all hover:bg-[#4a6d49] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-md">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Analyze Markdown'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
