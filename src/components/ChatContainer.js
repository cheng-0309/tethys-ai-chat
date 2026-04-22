import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import InputBox from './InputBox';
import TypingIndicator from './TypingIndicator';
import SkeletonLoader from './SkeletonLoader';
import ErrorMessage from './ErrorMessage';
import { sendMessageToAI } from '../services/api';
import '../styles/ChatContainer.css';

function ChatContainer() {
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // Load initial messages on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const initialMessages = [
          {
            id: 1,
            text: "Hey there! I'm Tethys, your AI assistant. Ask me anything — I'm here to help.",
            sender: 'ai',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read',
          },
        ];

        setMessages(initialMessages);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load messages. Please try again.');
        setIsLoading(false);
      }
    };

    // Try to load from localStorage first
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (parsed.length > 0) {
          setMessages(parsed);
          setIsLoading(false);
          return;
        }
      } catch {
        // Fall through to load defaults
      }
    }
    loadMessages();
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || isTyping) return;

    // Add user message immediately
    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setError(null);
    setIsTyping(true);

    try {
      // Send to AI with full conversation history for context
      const aiResponseText = await sendMessageToAI(text, updatedMessages);

      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error('AI API error:', err);
      setError('Something went wrong. Please try again.');

      // Add a fallback AI message so the conversation doesn't look broken
      const fallbackMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I couldn't process your request right now. Please try again in a moment.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleDismissError = () => {
    setError(null);
  };

  const handleClearChat = () => {
    if (window.confirm('Clear all messages?')) {
      setMessages([]);
      localStorage.removeItem('chatMessages');
    }
  };

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
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <InputBox
        onSendMessage={handleSendMessage}
        onClearChat={handleClearChat}
        disabled={isTyping}
      />
    </main>
  );
}

export default ChatContainer;
