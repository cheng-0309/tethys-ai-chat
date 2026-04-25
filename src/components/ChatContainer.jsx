/*
  ChatContainer.jsx — The main chat window.

  Changes from the original version:
  - Now receives two props from App.jsx:
      initialMessages   : the messages already saved for this chat
      onMessagesChange  : called whenever messages change so App can save them
  - Removed the old localStorage logic (App.jsx handles that now)
*/

import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import InputBox from './InputBox';
import TypingIndicator from './TypingIndicator';
import SkeletonLoader from './SkeletonLoader';
import ErrorMessage from './ErrorMessage';
import { sendMessageToAI } from '../services/api';
import '../styles/ChatContainer.css';

function ChatContainer({ initialMessages = [], onMessagesChange }) {
  const messagesEndRef = useRef(null);

  // Capture initial prop values in refs so the mount-only effect
  // can reference them without them being listed as changing dependencies.
  const initialLengthRef = useRef(initialMessages.length);
  const onMessagesChangeRef = useRef(onMessagesChange);

  // Start with the messages passed in from App.jsx
  // (these are the saved messages for this chat session)
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(initialMessages.length === 0);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // ── On first load of a NEW (empty) chat, show the welcome message ──
  useEffect(() => {
    if (initialLengthRef.current === 0) {
      const timer = setTimeout(() => {
        const welcomeMsg = {
          id: Date.now(),
          text: "Hey there! I'm Tethys, your AI assistant. Ask me anything — I'm here to help.",
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'read',
        };
        const initial = [welcomeMsg];
        setMessages(initial);
        onMessagesChangeRef.current?.(initial); // save to App state
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer); // cleanup if component unmounts early
    }
  }, []); // intentionally run once on mount — values captured in refs above

  // ── Whenever messages change, notify App so it can save to localStorage ──
  const updateMessages = (newMessages) => {
    setMessages(newMessages);
    onMessagesChange?.(newMessages);
  };

  // ── Auto-scroll to the bottom when messages or typing indicator change ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ── Handle sending a message ──
  const handleSendMessage = async (text) => {
    if (!text.trim() || isTyping) return;

    // 1. Add the user's message instantly
    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
    };

    const updatedMessages = [...messages, userMessage];
    updateMessages(updatedMessages);
    setError(null);
    setIsTyping(true);

    try {
      // 2. Ask the AI for a response (pass full history for context)
      const aiResponseText = await sendMessageToAI(text, updatedMessages);

      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
      };

      updateMessages([...updatedMessages, aiMessage]);
    } catch (err) {
      console.error('AI API error:', err);
      setError('Something went wrong. Please try again.');

      // Show a friendly fallback so the chat doesn't look broken
      const fallbackMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I couldn't process your request right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
      };
      updateMessages([...updatedMessages, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleDismissError = () => setError(null);

  // ── Loading skeleton (shown briefly for new chats) ──
  if (isLoading) {
    return (
      <main className="chat-container">
        <div className="messages-area">
          <SkeletonLoader />
          <SkeletonLoader />
          <SkeletonLoader />
        </div>
        <InputBox onSendMessage={handleSendMessage} disabled />
      </main>
    );
  }

  return (
    <main className="chat-container">
      {error && <ErrorMessage message={error} onDismiss={handleDismissError} />}

      <div className="messages-area">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <h2>Welcome to Tethys Chat</h2>
            <p>Start a conversation by typing a message below</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg.text}
                sender={msg.sender}
                timestamp={msg.timestamp}
                status={msg.status}
              />
            ))}
            {isTyping && (
              <div className="message-bubble message-ai">
                <TypingIndicator />
              </div>
            )}
            {/* Invisible anchor we scroll to */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <InputBox
        onSendMessage={handleSendMessage}
        disabled={isTyping}
      />
    </main>
  );
}

export default ChatContainer;
