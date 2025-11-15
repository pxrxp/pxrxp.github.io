import { useState, useEffect } from 'react';

const ThemeToggleButton = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <button onClick={toggleTheme} id="theme-toggle-button" aria-label="Toggle theme">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggleButton;
