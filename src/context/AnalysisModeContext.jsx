import React, { createContext, useContext, useState, useEffect } from 'react';

const AnalysisModeContext = createContext();

export function AnalysisModeProvider({ children }) {
  const [analysisMode, setAnalysisMode] = useState('friendly');

  const toggleMode = () => {
    setAnalysisMode((prev) => (prev === 'friendly' ? 'strict' : 'friendly'));
  };

  return (
    <AnalysisModeContext.Provider value={{ analysisMode, toggleMode }}>
      {children}
    </AnalysisModeContext.Provider>
  );
}

export const useAnalysisMode = () => useContext(AnalysisModeContext);
