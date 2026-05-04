import React, { useState, useEffect } from 'react'
import Hero from './components/Hero'
import AnalyzerInput from './components/AnalyzerInput'
import ResultsDashboard from './components/ResultsDashboard'
import CompareResultsDashboard from './components/CompareResultsDashboard'
import TemplateLibrary from './components/TemplateLibrary'
import RealTimeEditor from './components/RealTimeEditor'
import HistoryList from './components/HistoryList'
import { Footer, FAQ } from './components/Footer'
import StorySection from './components/StorySection'
import { useHistory } from './hooks/useHistory'
import LZString from 'lz-string'
import { analyzeReadme } from './utils/analyzer'
import { Sun, Moon, RotateCcw } from 'lucide-react'
import { AnalysisModeProvider, useAnalysisMode } from './context/AnalysisModeContext'

function AppContent() {
  const [mode, setMode] = useState(() => localStorage.getItem('odyn_mode') || 'landing');
  const [results, setResults] = useState(null);
  const [compareResults, setCompareResults] = useState(null);
  const [compareMarkdown, setCompareMarkdown] = useState(null);
  const [markdown, setMarkdown] = useState(() => localStorage.getItem('odyn_markdown') || '');
  const [isNightMode, setIsNightMode] = useState(() => localStorage.getItem('odyn_theme') === 'dark');
  const { history, addToHistory, clearHistory } = useHistory();
  const { analysisMode } = useAnalysisMode();

  // Persist State
  useEffect(() => {
    localStorage.setItem('odyn_mode', mode);
    localStorage.setItem('odyn_markdown', markdown);
    localStorage.setItem('odyn_theme', isNightMode ? 'dark' : 'light');
  }, [mode, markdown, isNightMode]);

  // Handle Theme Toggle
  useEffect(() => {
    if (isNightMode) {
      document.documentElement.classList.add('night-mode', 'dark');
    } else {
      document.documentElement.classList.remove('night-mode', 'dark');
    }
  }, [isNightMode]);

  // Handle Mode Change - Re-analyze if results are visible or missing
  useEffect(() => {
    if (mode === 'results' && markdown) {
      const meta = results?.repoMetadata || null;
      const newAnalysis = analyzeReadme(markdown, analysisMode, meta);
      setResults(newAnalysis);
    } else if (mode === 'compare' && compareMarkdown) {
      const metaA = compareResults?.A?.repoMetadata || null;
      const metaB = compareResults?.B?.repoMetadata || null;
      const newAnalysisA = analyzeReadme(compareMarkdown.A, analysisMode, metaA);
      const newAnalysisB = analyzeReadme(compareMarkdown.B, analysisMode, metaB);
      setCompareResults({ A: newAnalysisA, B: newAnalysisB });
    }
  }, [analysisMode, mode, markdown, compareMarkdown]);

  // Handle Browser Back Button
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state?.mode) {
        setMode(event.state.mode);
      } else {
        setMode('landing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    
    // If we have a hash, don't override the mode from localStorage yet
    if (!window.location.hash) {
      window.history.replaceState({ mode }, '');
    }
    
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle Shared Reports from URL
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(hash);
        if (decompressed) {
          const analysis = analyzeReadme(decompressed, analysisMode);
          setResults(analysis);
          setMarkdown(decompressed);
          setMode('results');
        }
      } catch (e) {
        console.error('Failed to decompress shared report', e);
      }
    }
  }, []);

  const handleResults = (analysisResults, md) => {
    if (!analysisResults) return;
    setResults(analysisResults);
    setMarkdown(md);
    addToHistory(analysisResults, md, 'single');
    setTimeout(() => {
      setMode('results');
      window.history.pushState({ mode: 'results' }, '');
      window.scrollTo(0, 0);
    }, 10);
  };

  const handleCompareResults = (resPair, mdPair) => {
    if (!resPair) return;
    setCompareResults(resPair);
    setCompareMarkdown(mdPair);
    addToHistory(resPair, mdPair, 'compare');
    setTimeout(() => {
      setMode('compare');
      window.history.pushState({ mode: 'compare' }, '');
      window.scrollTo(0, 0);
    }, 10);
  };

  const handleSelectHistory = (item) => {
    if (item.type === 'compare') {
      const metaA = item.results?.A?.repoMetadata || null;
      const metaB = item.results?.B?.repoMetadata || null;
      const analysisA = analyzeReadme(item.markdown.A, analysisMode, metaA);
      const analysisB = analyzeReadme(item.markdown.B, analysisMode, metaB);
      setCompareResults({ A: analysisA, B: analysisB });
      setCompareMarkdown(item.markdown);
      setMode('compare');
      window.history.pushState({ mode: 'compare' }, '');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const meta = item.results?.repoMetadata || null;
      const analysis = analyzeReadme(item.markdown, analysisMode, meta);
      setResults(analysis);
      setMarkdown(item.markdown);
      setMode('results');
      window.history.pushState({ mode: 'results' }, '');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectTemplate = (templateMd) => {
    setMarkdown(templateMd);
    setMode('editor');
    window.history.pushState({ mode: 'editor' }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    const compressed = LZString.compressToEncodedURIComponent(markdown);
    const url = `${window.location.origin}${window.location.pathname}#${compressed}`;
    navigator.clipboard.writeText(url);
    alert('Shareable report URL copied to clipboard!');
  };

  const handleNavigate = (id) => {
    if (mode !== 'landing') {
      setMode('landing');
      window.history.pushState({ mode: 'landing' }, '');
    }
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (mode === 'editor') {
    return (
      <RealTimeEditor 
        initialValue={markdown} 
        onBack={() => {
          setMode('landing');
          window.history.pushState({ mode: 'landing' }, '');
        }} 
        isNightMode={isNightMode}
        setIsNightMode={setIsNightMode}
        onSave={(res, md) => {
          setMarkdown(md);
          setResults(res);
          addToHistory(res, md);
          setMode('results');
          window.history.pushState({ mode: 'results' }, '');
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-brand-cream font-sans selection:bg-brand-terracotta selection:text-white transition-colors duration-500 ${isNightMode ? 'night-mode dark' : ''}`}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-brand-cream/70 backdrop-blur-xl border-b border-brand-charcoal/5 px-4 sm:px-6 py-4 flex items-center justify-between">
        <button 
          onClick={() => {
            if (mode === 'landing') window.scrollTo({ top: 0, behavior: 'smooth' });
            else {
              setMode('landing');
              window.history.pushState({ mode: 'landing' }, '');
            }
          }}
          className="flex items-center group"
        >
          <img src="/logo.png" alt="Odyn Logo" className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105" />
        </button>

        <div className="flex items-center gap-2 sm:gap-8">
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => handleNavigate('templates')} className="text-sm font-medium text-brand-charcoal/60 hover:text-brand-terracotta transition-colors">Templates</button>
            <button onClick={() => handleNavigate('history')} className="text-sm font-medium text-brand-charcoal/60 hover:text-brand-terracotta transition-colors">History</button>
            <button onClick={() => handleNavigate('faq')} className="text-sm font-medium text-brand-charcoal/60 hover:text-brand-terracotta transition-colors">FAQ</button>
          </nav>

          <div className="h-6 w-px bg-brand-charcoal/10 hidden md:block" />
          
          <div className="flex items-center gap-2">
            {mode !== 'landing' && (
              <button
                onClick={() => {
                  setMode('landing');
                  window.history.pushState({ mode: 'landing' }, '');
                }}
                className="flex items-center gap-2 px-3 py-2 text-brand-charcoal/60 hover:text-brand-charcoal text-sm font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">New Analysis</span>
              </button>
            )}

            <button
              onClick={() => setIsNightMode(!isNightMode)}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-brand-charcoal/5 transition-all group"
              aria-label="Toggle Night Mode"
            >
              {isNightMode ? (
                <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-45 transition-transform duration-500" />
              ) : (
                <Moon className="w-5 h-5 text-brand-charcoal group-hover:-rotate-12 transition-transform duration-500" />
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="pt-20">
        {mode === 'landing' && (
          <div className="bg-brand-cream relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-brand-terracotta/10 blur-[150px] rounded-full" />
              <div className="absolute top-[20%] right-[-10%] w-[70%] h-[60%] bg-brand-peach/10 blur-[180px] rounded-full" />
              <div className="absolute top-[50%] left-[-20%] w-[60%] h-[50%] bg-brand-terracotta/5 blur-[160px] rounded-full" />
              <div className="absolute bottom-[-10%] right-[10%] w-[50%] h-[40%] bg-brand-peach/5 blur-[140px] rounded-full" />
            </div>

            <div className="relative z-10">
              <Hero />
              <StorySection />
              <AnalyzerInput onResults={handleResults} onCompareResults={handleCompareResults} />
              <HistoryList history={history} onSelect={handleSelectHistory} onClear={clearHistory} />
              <TemplateLibrary onSelectTemplate={handleSelectTemplate} />
              <FAQ />
            </div>
          </div>
        )}

        {mode === 'compare' && compareResults ? (
          <CompareResultsDashboard 
            resultsA={compareResults.A}
            resultsB={compareResults.B}
            markdownA={compareMarkdown.A}
            markdownB={compareMarkdown.B}
            isNightMode={isNightMode}
            setIsNightMode={setIsNightMode}
            onReset={() => {
              setCompareResults(null);
              setMode('landing');
            }}
          />
        ) : mode === 'compare' ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
            <div className="w-12 h-12 border-4 border-brand-terracotta border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-brand-charcoal/50">Loading Comparison...</p>
          </div>
        ) : mode === 'results' && results ? (
          <ResultsDashboard 
            results={results} 
            markdown={markdown} 
            isNightMode={isNightMode}
            setIsNightMode={setIsNightMode}
            onReset={() => {
              setResults(null);
              setMode('landing');
            }}
            onShare={handleShare}
          />
        ) : mode === 'results' ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
            <div className="w-12 h-12 border-4 border-brand-terracotta border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-brand-charcoal/50">Loading Report...</p>
          </div>
        ) : null}
      </main>

      <Footer onNavigate={setMode} />
    </div>
  )
}

function App() {
  return (
    <AnalysisModeProvider>
      <AppContent />
    </AnalysisModeProvider>
  )
}

export default App
