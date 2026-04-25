/*
  Sidebar.jsx — Chat History Panel

  This component shows:
  - A "New Chat" button at the top
  - A list of all previous chats
  - Highlights the currently active chat
  - Lets you delete a chat

  It receives all its data and actions from App.jsx via props.
*/

import React from 'react';
import '../styles/Sidebar.css';

function Sidebar({ chats, activeChatId, onNewChat, onSelectChat, onDeleteChat, isOpen, onClose }) {
  return (
    <>
      {/* Dark overlay shown on mobile when sidebar is open */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />
      )}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        {/* ── Header ── */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="sidebar-logo-icon">🌊</span>
            <span className="sidebar-logo-text">Tethys</span>
          </div>
          <button
            className="sidebar-new-btn"
            onClick={onNewChat}
            title="Start a new chat"
            aria-label="New chat"
          >
            {/* Pencil icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        {/* ── Chat list ── */}
        <div className="sidebar-list-wrapper">
          {chats.length === 0 ? (
            // Shown when there are no chats yet
            <div className="sidebar-empty">
              <p>No chats yet.</p>
              <p>Start typing to begin!</p>
            </div>
          ) : (
            <ul className="sidebar-list">
              {/*
                We show chats newest-first so the most recent one
                is always at the top (like ChatGPT does).
              */}
              {[...chats].reverse().map((chat) => (
                <li
                  key={chat.id}
                  className={`sidebar-item ${chat.id === activeChatId ? 'sidebar-item--active' : ''}`}
                >
                  {/* Clicking the chat title loads it */}
                  <button
                    className="sidebar-item-btn"
                    onClick={() => onSelectChat(chat.id)}
                    aria-current={chat.id === activeChatId ? 'true' : undefined}
                  >
                    {/* Chat icon */}
                    <svg className="sidebar-item-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span className="sidebar-item-title">{chat.title}</span>
                  </button>

                  {/* Delete button — only visible on hover */}
                  <button
                    className="sidebar-item-delete"
                    onClick={(e) => {
                      e.stopPropagation(); // don't trigger onSelectChat
                      onDeleteChat(chat.id);
                    }}
                    title="Delete this chat"
                    aria-label={`Delete chat: ${chat.title}`}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Footer hint ── */}
        <div className="sidebar-footer">
          <span>Chat history saved locally</span>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
