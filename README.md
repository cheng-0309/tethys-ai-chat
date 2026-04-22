# Tethys — AI Chat Assistant

A modern, responsive React chat application powered by **Groq AI** (Llama 3.3 70B). Features real-time AI responses, conversation context, light/dark mode, and a clean, polished UI.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3_70B-F55036)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- **Real AI Conversations** — Powered by Groq API with Llama 3.3 70B model
- **Conversation Context** — Maintains chat history for multi-turn dialogue
- **Light / Dark Mode** — Toggle with a single click, persisted in localStorage
- **Typing Indicator** — Shows "typing..." animation while AI responds
- **Copy & React** — Copy messages to clipboard, react with emoji
- **Auto-Scroll** — Chat scrolls to the latest message automatically
- **LocalStorage Persistence** — Chat history saved across sessions
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Keyboard Shortcuts** — Enter to send, Shift+Enter for new line

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Avatar.js            # User & AI avatar display
│   ├── ChatContainer.js     # Main chat logic & message state
│   ├── ErrorMessage.js      # Dismissible error banner
│   ├── Header.js            # App header with theme toggle
│   ├── InputBox.js          # Auto-resizing textarea + send/clear buttons
│   ├── MessageBubble.js     # Message bubble with copy/react actions
│   ├── SkeletonLoader.js    # Loading skeleton placeholder
│   ├── ThemeToggle.js       # Light/dark mode toggle button
│   └── TypingIndicator.js   # Animated typing dots
├── services/
│   └── api.js               # Groq API integration & prompt engineering
├── styles/
│   ├── variables.css         # CSS custom properties (theme tokens)
│   ├── index.css             # Global base styles
│   ├── App.css
│   ├── Avatar.css
│   ├── ChatContainer.css
│   ├── ErrorMessage.css
│   ├── Header.css
│   ├── InputBox.css
│   ├── MessageBubble.css
│   ├── SkeletonLoader.css
│   ├── ThemeToggle.css
│   └── TypingIndicator.css
├── App.js
└── index.js
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
- **Model:** Llama 3.3 70B Versatile
- **Context:** Last 20 messages sent for multi-turn awareness
- **System Prompt:** Custom personality — natural, direct, no robotic disclaimers
- **Error Handling:** Graceful fallback messages on API failure

---

## 🛠 Technologies

- **React 18** — Functional components with hooks
- **CSS3** — Custom properties, media queries, transitions
- **Groq API** — Fast inference on Llama 3.3 70B
- **Create React App** — Zero-config build toolchain

---

## 📄 License

MIT
