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

  const addToHistory = (result, markdown) => {
    const rawTitle = result.headings[0]?.text || 'Untitled README';
    const title = rawTitle.length > 40 ? rawTitle.substring(0, 40) + '...' : rawTitle;

    const newItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      score: result.scores.overall,
      title: title,
      markdown: markdown,
      metrics: {
        headings: result.metrics.headingsCount,
        links: result.metrics.linksCount,
      }
    };

    const updated = [newItem, ...history.filter(h => h.title !== newItem.title)].slice(0, 5);
    setHistory(updated);
    localStorage.setItem('odyn_history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('odyn_history');
  };

  return { history, addToHistory, clearHistory };
}
