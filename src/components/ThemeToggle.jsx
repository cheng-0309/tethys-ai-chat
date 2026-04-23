import React, { useState, useEffect } from 'react';
import '../styles/ThemeToggle.css';

function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const handleToggle = () => {
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button 
      className="theme-toggle" 
      onClick={handleToggle}
      aria-label="Toggle dark mode"
      title={isDarkMode ? 'Light mode' : 'Dark mode'}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
}

export default ThemeToggle;
