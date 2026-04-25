# Tethys — AI Chat Assistant

A modern, responsive React chat application powered by **Groq AI** (Llama 3.3 70B). Features multi-session chat management, real-time AI responses, persistent conversation history, light/dark mode, and a polished sidebar-based UI.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-F55036)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- **Multi-Session Chat Management** — Create, switch between, and delete multiple chat sessions from the sidebar
- **Real AI Conversations** — Powered by Groq API with Llama 3.3 70B Versatile model
- **Conversation Context** — Last 20 messages sent for full multi-turn awareness
- **Auto-Generated Chat Titles** — Chat sessions are titled from the first user message (up to 40 chars)
- **LocalStorage Persistence** — All chat sessions and history survive page refresh
- **Sidebar Navigation** — Collapsible sidebar with chat list, new chat button, and delete per session
- **Light / Dark Mode** — One-click toggle, persisted in localStorage via `data-theme` attribute
- **Skeleton Loader** — Animated placeholder shown on new chat load before the welcome message
- **Typing Indicator** — Animated dots while the AI is generating a response
- **Auto-Scroll** — Chat area scrolls to the latest message automatically
- **Error Handling** — Graceful dismissible error banner + friendly AI fallback message on API failure
- **Responsive Design** — Mobile-first layout; sidebar collapses with hamburger menu on small screens
- **Keyboard Shortcuts** — `Enter` to send, `Shift+Enter` for new line

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Avatar.jsx            # User & AI avatar display
│   ├── ChatContainer.jsx     # Main chat logic, message state & welcome flow
│   ├── ErrorMessage.jsx      # Dismissible error banner
│   ├── Header.jsx            # App header with hamburger menu & theme toggle
│   ├── InputBox.jsx          # Auto-resizing textarea + send/clear buttons
│   ├── MessageBubble.jsx     # Message bubble with copy/react actions
│   ├── Sidebar.jsx           # Chat session list, new chat, delete chat
│   ├── SkeletonLoader.jsx    # Loading skeleton placeholder
│   ├── ThemeToggle.jsx       # Light/dark mode toggle button
│   └── TypingIndicator.jsx   # Animated typing dots
├── services/
│   └── api.js                # Groq API integration & prompt engineering
├── styles/
│   ├── variables.css         # CSS custom properties (theme tokens)
│   ├── index.css             # Global base styles & font import
│   ├── App.css               # Root layout (sidebar + main split)
│   ├── Avatar.css
│   ├── ChatContainer.css
│   ├── ErrorMessage.css
│   ├── Header.css
│   ├── InputBox.css
│   ├── MessageBubble.css
│   ├── Sidebar.css           # Full sidebar styles incl. mobile overlay
│   ├── SkeletonLoader.css
│   ├── ThemeToggle.css
│   └── TypingIndicator.css
├── App.jsx                   # Root component — owns all chat state & localStorage
└── index.js                  # React entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
git clone https://github.com/cheng-0309/tethys-ai-chat.git
cd tethys-ai-chat
npm install
```

### Environment Setup

Create a `.env` file in the project root:

```env
REACT_APP_GROQ_API_KEY=your_groq_api_key_here
```

Get a free API key at [console.groq.com](https://console.groq.com/).

### Running the App

```bash
npm start
```

Opens at [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
```

---

## 🧠 Architecture Overview

State is managed entirely in `App.jsx` and flows **down** to children via props:

```
App.jsx  (owns chats[], activeChatId, sidebarOpen)
 ├── Sidebar.jsx       ← receives chats[], handles new/select/delete
 └── app-main
      ├── Header.jsx   ← hamburger menu + theme toggle
      └── ChatContainer.jsx  ← receives initialMessages + onMessagesChange
           ├── MessageBubble.jsx
           ├── TypingIndicator.jsx
           ├── SkeletonLoader.jsx
           ├── ErrorMessage.jsx
           └── InputBox.jsx
```

- `App.jsx` loads/saves all sessions to `localStorage` under the key `tethys_chat_history`
- `ChatContainer` is re-mounted (via `key={activeChatId}`) on every chat switch — cleanly resetting all local state
- Chat titles are auto-generated from the first user message (max 40 characters)

---

## 🎨 Theme System

Tethys uses CSS custom properties for theming. Two themes are defined in `variables.css`:

| Token | Light | Dark |
|-------|-------|------|
| `--color-bg-primary` | `#f5f7fb` | `#0f172a` |
| `--color-bg-secondary` | `#ffffff` | `#111827` |
| `--color-text-primary` | `#1f2937` | `#e5e7eb` |
| `--color-accent` | `#667eea` | `#667eea` |

Toggle is persisted via `localStorage` and applied via `data-theme` attribute on `<html>`.

---

## 🤖 AI Integration

- **Provider:** Groq (OpenAI-compatible API)
- **Model:** `llama-3.3-70b-versatile`
- **Context window:** Last 20 messages sent per request for multi-turn awareness
- **System Prompt:** Custom personality — natural, direct, no robotic disclaimers
- **Error Handling:** Graceful fallback messages on API failure; error banner for user feedback

---

## 🛠 Technologies

- **React 18** — Functional components with hooks (`useState`, `useEffect`, `useRef`)
- **CSS3** — Custom properties, CSS variables, media queries, smooth transitions
- **Groq API** — Fast inference on Llama 3.3 70B
- **Create React App** — Zero-config build toolchain
- **localStorage** — Client-side persistence for chat sessions and theme preference

---

## 📄 License

MIT
