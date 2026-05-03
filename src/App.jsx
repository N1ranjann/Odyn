import React, { useState, useEffect } from 'react'
import Hero from './components/Hero'
import AnalyzerInput from './components/AnalyzerInput'
import ResultsDashboard from './components/ResultsDashboard'
import TemplateLibrary from './components/TemplateLibrary'
import RealTimeEditor from './components/RealTimeEditor'
import HistoryList from './components/HistoryList'
import { Footer, FAQ } from './components/Footer'
import { useHistory } from './hooks/useHistory'
import LZString from 'lz-string'
import { analyzeReadme } from './utils/analyzer'
import { Sun, Moon } from 'lucide-react'

function App() {
  const [mode, setMode] = useState('landing'); // 'landing', 'editor', 'results'
  const [results, setResults] = useState(null);
  const [markdown, setMarkdown] = useState('');
  const [isNightMode, setIsNightMode] = useState(false);
  const { history, addToHistory, clearHistory } = useHistory();

  // Handle Theme Toggle
  useEffect(() => {
    if (isNightMode) {
      document.documentElement.classList.add('night-mode');
    } else {
      document.documentElement.classList.remove('night-mode');
    }
  }, [isNightMode]);

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
    // Initial state
    window.history.replaceState({ mode: 'landing' }, '');
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Handle Shared Reports from URL
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(hash);
        if (decompressed) {
          const analysis = analyzeReadme(decompressed);
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
    setResults(analysisResults);
    setMarkdown(md);
    addToHistory(analysisResults, md);
    setMode('results');
    window.history.pushState({ mode: 'results' }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHistory = (item) => {
    const analysis = analyzeReadme(item.markdown);
    setResults(analysis);
    setMarkdown(item.markdown);
    setMode('results');
    window.history.pushState({ mode: 'results' }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (mode === 'editor') {
    return (
      <RealTimeEditor 
        initialValue={markdown} 
        onBack={() => setMode('landing')} 
        isNightMode={isNightMode}
        setIsNightMode={setIsNightMode}
        onSave={(res, md) => {
          setResults(res);
          setMarkdown(md);
          addToHistory(res, md);
          setMode('results');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream font-sans selection:bg-brand-terracotta selection:text-white">
      {mode === 'landing' && (
        <>
          <header className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-brand-charcoal/5 px-6 py-4 flex items-center justify-between">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center group"
            >
              <img src="/logo.png" alt="Odyn Logo" className="h-12 w-auto object-contain transition-transform group-hover:scale-105" />
            </button>
            <div className="flex items-center gap-4 md:gap-8">
              <nav className="hidden md:flex items-center gap-8">
                <a href="#templates" className="text-sm font-medium text-brand-charcoal/60 hover:text-brand-terracotta transition-colors">Templates</a>
                <a href="#history" className="text-sm font-medium text-brand-charcoal/60 hover:text-brand-terracotta transition-colors">History</a>
                <a href="#faq" className="text-sm font-medium text-brand-charcoal/60 hover:text-brand-terracotta transition-colors">FAQ</a>
              </nav>
              <div className="h-6 w-px bg-brand-charcoal/10 hidden md:block" />
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
          </header>
          <Hero />
          <AnalyzerInput onResults={handleResults} />
          <HistoryList history={history} onSelect={handleSelectHistory} onClear={clearHistory} />
          <TemplateLibrary onSelectTemplate={handleSelectTemplate} />
          <FAQ />
        </>
      )}

      {mode === 'results' && results && (
        <ResultsDashboard 
          results={results} 
          markdown={markdown} 
          isNightMode={isNightMode}
          setIsNightMode={setIsNightMode}
          onReset={() => setMode('landing')}
          onShare={handleShare}
        />
      )}

      <Footer onNavigate={setMode} />
    </div>
  )
}

export default App
