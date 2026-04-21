import React, { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import InputBox from './InputBox';
import TypingIndicator from './TypingIndicator';
import SkeletonLoader from './SkeletonLoader';
import ErrorMessage from './ErrorMessage';
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
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const initialMessages = [
          { id: 1, text: 'Hello', sender: 'user', timestamp: '10:30 AM', status: 'read' },
          { id: 2, text: 'Hi, how can I help you?', sender: 'ai', timestamp: '10:30 AM', status: 'read' },
          { id: 3, text: 'Can you help me with React?', sender: 'user', timestamp: '10:31 AM', status: 'read' },
          { id: 4, text: 'Of course! I\'d be happy to help with React. What would you like to know?', sender: 'ai', timestamp: '10:31 AM', status: 'read' },
          { id: 5, text: 'How do I use hooks?', sender: 'user', timestamp: '10:32 AM', status: 'read' },
          { id: 6, text: 'React Hooks are functions that let you use state and other React features in functional components. The most common ones are useState and useEffect.', sender: 'ai', timestamp: '10:33 AM', status: 'read' },
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
        setMessages(JSON.parse(savedMessages));
        setIsLoading(false);
      } catch {
        loadMessages();
      }
    } else {
      loadMessages();
    }
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

  const handleSendMessage = (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'delivered',
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Simulate AI typing and response
    setIsTyping(true);
    setTimeout(() => {
      const aiMessage = {
        id: updatedMessages.length + 1,
        text: 'This is a demo response. Real AI integration coming soon!',
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
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
      <InputBox onSendMessage={handleSendMessage} onClearChat={handleClearChat} />
    </main>
  );
}

export default ChatContainer;
