import { useState, useEffect } from 'react';

export function useHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('odyn_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
  }, []);

  const addToHistory = (result, markdown, type = 'single') => {
    let newItem;
    if (type === 'compare') {
      const titleA = result.A.headings[0]?.text || 'Repo A';
      const titleB = result.B.headings[0]?.text || 'Repo B';
      newItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        type: 'compare',
        scoreA: result.A.scores.overall,
        scoreB: result.B.scores.overall,
        title: `${titleA} vs ${titleB}`.substring(0, 40),
        markdown: markdown,
      };
    } else {
      const rawTitle = result.headings[0]?.text || 'Untitled README';
      const title = rawTitle.length > 40 ? rawTitle.substring(0, 40) + '...' : rawTitle;

      newItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        type: 'single',
        score: result.scores.overall,
        title: title,
        markdown: markdown,
        metrics: {
          headings: result.metrics.headingsCount,
          links: result.metrics.linksCount,
        }
      };
    }

    try {
      const updated = [newItem, ...history.filter(h => h.title !== newItem.title)].slice(0, 5);
      setHistory(updated);
      localStorage.setItem('odyn_history', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save to history (likely storage full)', e);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('odyn_history');
  };

  return { history, addToHistory, clearHistory };
}
