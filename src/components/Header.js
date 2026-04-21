import React from 'react';
import ThemeToggle from './ThemeToggle';
import '../styles/Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-text">
          <h1 className="header-title">Tethys</h1>
          <p className="header-subtitle">AI Chat Assistant</p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}

export default Header;
