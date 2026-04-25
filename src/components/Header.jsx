/*
  Header.jsx — Top bar of the app.

  Added:
  - A hamburger menu button on the left (mobile only) to open the sidebar
*/

import React from 'react';
import ThemeToggle from './ThemeToggle';
import '../styles/Header.css';

function Header({ onMenuClick }) {
  return (
    <header className="header">
      <div className="header-content">
        {/* Hamburger button — only visible on mobile */}
        <button
          className="header-menu-btn"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
          title="Open chat history"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6"  x2="21" y2="6"  />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

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
