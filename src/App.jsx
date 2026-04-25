/*
  App.jsx — The top-level component.

  This is the "brain" of the app.
  It holds ALL the state:
    - chats      : list of all chat sessions
    - activeChatId : which chat is currently open

  It passes data DOWN to children via props,
  and passes action functions DOWN so children can update state.

  State shape stored in localStorage:
  {
    chats: [
      {
        id: "chat_1234567890",   // unique ID
        title: "How does React work?",  // first user message (trimmed)
        messages: [ { id, text, sender, timestamp, status }, ... ]
      },
      ...
    ],
    activeChatId: "chat_1234567890"
  }
*/

import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatContainer from './components/ChatContainer';
import './styles/App.css';

// ─────────────────────────────────────────
// Helpers: localStorage read / write
// ─────────────────────────────────────────

// Key we use in localStorage
const STORAGE_KEY = 'tethys_chat_history';

/** Read saved state from localStorage. Returns null if nothing saved yet. */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    // If JSON is broken, ignore it
    return null;
  }
}

/** Write the current state to localStorage so it survives page refresh. */
function saveToStorage(chats, activeChatId) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ chats, activeChatId }));
  } catch {
    // Storage might be full — fail silently
  }
}

// ─────────────────────────────────────────
// Helper: create a brand-new empty chat
// ─────────────────────────────────────────
function createNewChat() {
  return {
    id: 'chat_' + Date.now(),   // unique ID based on current time
    title: 'New Chat',           // placeholder — updated on first message
    messages: [],                // empty to start
  };
}

// ─────────────────────────────────────────
// App component
// ─────────────────────────────────────────
function App() {
  // ── State ──────────────────────────────
  const [chats, setChats] = useState([]);           // all chat sessions
  const [activeChatId, setActiveChatId] = useState(null); // current open chat
  const [sidebarOpen, setSidebarOpen] = useState(false);  // mobile sidebar toggle

  // ── On first load: restore from localStorage ──
  useEffect(() => {
    const saved = loadFromStorage();

    if (saved && saved.chats && saved.chats.length > 0) {
      // We have saved chats — restore them
      setChats(saved.chats);
      setActiveChatId(saved.activeChatId || saved.chats[0].id);
    } else {
      // No saved chats — start fresh with one new chat
      const firstChat = createNewChat();
      setChats([firstChat]);
      setActiveChatId(firstChat.id);
    }
  }, []); // empty array = run once on mount

  // ── Whenever chats change, save to localStorage ──
  useEffect(() => {
    if (chats.length > 0) {
      saveToStorage(chats, activeChatId);
    }
  }, [chats, activeChatId]);

  // ─────────────────────────────────────────
  // Action: Start a new chat
  // ─────────────────────────────────────────
  function handleNewChat() {
    const newChat = createNewChat();
    setChats(prev => [...prev, newChat]); // add to list
    setActiveChatId(newChat.id);          // switch to it
    setSidebarOpen(false);                // close sidebar on mobile
  }

  // ─────────────────────────────────────────
  // Action: Switch to a different chat
  // ─────────────────────────────────────────
  function handleSelectChat(chatId) {
    setActiveChatId(chatId);
    setSidebarOpen(false); // close sidebar on mobile after selecting
  }

  // ─────────────────────────────────────────
  // Action: Delete a chat
  // ─────────────────────────────────────────
  function handleDeleteChat(chatId) {
    setChats(prev => {
      const remaining = prev.filter(c => c.id !== chatId);

      // If we deleted the active chat, switch to the most recent one
      if (chatId === activeChatId) {
        if (remaining.length > 0) {
          // Switch to the last chat in the list
          setActiveChatId(remaining[remaining.length - 1].id);
        } else {
          // No chats left — create a fresh one
          const newChat = createNewChat();
          setActiveChatId(newChat.id);
          return [newChat];
        }
      }

      return remaining;
    });
  }

  // ─────────────────────────────────────────
  // Action: Update messages in the active chat
  // Called by ChatContainer when messages change
  // ─────────────────────────────────────────
  function handleUpdateMessages(newMessages) {
    setChats(prev =>
      prev.map(chat => {
        if (chat.id !== activeChatId) return chat; // don't touch other chats

        // Auto-generate the title from the first user message
        let title = chat.title;
        if (title === 'New Chat') {
          const firstUserMsg = newMessages.find(m => m.sender === 'user');
          if (firstUserMsg) {
            // Take the first 40 characters of the first message as the title
            title = firstUserMsg.text.slice(0, 40);
            if (firstUserMsg.text.length > 40) title += '…';
          }
        }

        return { ...chat, title, messages: newMessages };
      })
    );
  }

  // ── Find the active chat object ──
  const activeChat = chats.find(c => c.id === activeChatId) || null;

  // ── Render ──────────────────────────────
  return (
    <div className="app">
      {/* Left sidebar with chat history */}
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Right side: header + chat window */}
      <div className="app-main">
        <Header onMenuClick={() => setSidebarOpen(prev => !prev)} />
        {/*
          We use the chat's ID as the React "key".
          This forces ChatContainer to RESET completely
          whenever the user switches to a different chat.
          It's the simplest way to handle chat switching!
        */}
        {activeChat && (
          <ChatContainer
            key={activeChatId}
            initialMessages={activeChat.messages}
            onMessagesChange={handleUpdateMessages}
          />
        )}
      </div>
    </div>
  );
}

export default App;
