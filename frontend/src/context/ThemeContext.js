import React, { useState, useEffect, createContext, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    // initialize from localStorage or default to dark
    try {
      return localStorage.getItem('theme') || 'dark';
    } catch (_err) {
      return 'dark';
    }
  });

  useEffect(() => {
    document.body.classList.toggle('light', mode === 'light');
    // persist selection
    try {
      localStorage.setItem('theme', mode);
    } catch (_err) {}
  }, [mode]);

  const toggle = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
