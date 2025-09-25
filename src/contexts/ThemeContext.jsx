import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first, then system preference
    const saved = localStorage.getItem('flux-theme');
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply theme immediately on mount
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    
    // Remove all theme classes first
    html.classList.remove('dark-theme', 'light-theme');
    body.classList.remove('dark-theme', 'light-theme');
    
    // Add the appropriate theme class
    if (isDarkMode) {
      html.classList.add('dark-theme');
      body.classList.add('dark-theme');
    } else {
      html.classList.add('light-theme');
      body.classList.add('light-theme');
    }
  }, []);

  // Update theme when isDarkMode changes
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    
    // Remove all theme classes first
    html.classList.remove('dark-theme', 'light-theme');
    body.classList.remove('dark-theme', 'light-theme');
    
    // Add the appropriate theme class
    if (isDarkMode) {
      html.classList.add('dark-theme');
      body.classList.add('dark-theme');
    } else {
      html.classList.add('light-theme');
      body.classList.add('light-theme');
    }
    
    // Save to localStorage
    localStorage.setItem('flux-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Memoized toggle function
  const toggleTheme = useCallback(() => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      console.log('Theme toggled to:', newMode ? 'dark' : 'light');
      return newMode;
    });
  }, []);

  // Memoize the entire context value
  const contextValue = useMemo(() => ({
    isDarkMode,
    toggleTheme
  }), [isDarkMode, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
