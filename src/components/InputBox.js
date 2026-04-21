import React, { useState, useRef } from 'react';
import '../styles/InputBox.css';

const InputBox = React.memo(({ onSendMessage, onClearChat, disabled = false }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="input-box">
      <div className="input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="message-input"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          aria-label="Message input"
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
