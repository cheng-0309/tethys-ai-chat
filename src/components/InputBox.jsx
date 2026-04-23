import React, { useState, useRef, useCallback } from 'react';
import '../styles/InputBox.css';

const InputBox = React.memo(({ onSendMessage, onClearChat, disabled = false }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const autoResize = useCallback((el) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, []);

  const handleChange = (e) => {
    setInput(e.target.value);
    autoResize(e.target);
  };

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
      // Reset textarea height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-box">
      <div className="input-wrapper">
        <textarea
          ref={textareaRef}
          className="message-input"
          placeholder="Type your message..."
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-label="Message input"
          rows={1}
        />
        <button
          className="send-button"
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          aria-label="Send message"
        >
          Send
        </button>
        {onClearChat && (
          <button
            className="clear-button"
            onClick={onClearChat}
            disabled={disabled}
            aria-label="Clear chat"
            title="Clear all messages"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
});

InputBox.displayName = 'InputBox';

export default InputBox;
