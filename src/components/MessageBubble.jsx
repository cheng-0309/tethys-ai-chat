import React, { useState } from 'react';
import '../styles/MessageBubble.css';
import Avatar from './Avatar';

const MessageBubble = React.memo(({ message, sender, timestamp, status = 'read' }) => {
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setShowCopyFeedback(true);
    setTimeout(() => setShowCopyFeedback(false), 2000);
  };

  const handleReaction = (emoji) => {
    setSelectedReaction(selectedReaction === emoji ? null : emoji);
  };

  const getStatusIcon = () => {
    if (sender === 'ai') return null;
    switch (status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      default:
        return '';
    }
  };

  return (
    <div className={`message-bubble message-${sender}`}>
      {sender === 'ai' && <Avatar sender={sender} />}
      <div className="message-wrapper">
        <div className="message-container">
          <div className="message-content">{message}</div>
          {timestamp && <span className="message-timestamp">{timestamp}</span>}
        </div>
        <div className="message-actions">
          <button
            className="action-button copy-button"
            onClick={handleCopy}
            aria-label="Copy message"
            title="Copy"
          >
            📋
          </button>
          <button
            className="action-button react-button"
            onClick={() => handleReaction('👍')}
            aria-label="React with thumbs up"
            title="React"
          >
            😊
          </button>
        </div>
        {showCopyFeedback && <span className="copy-feedback">Copied!</span>}
        {selectedReaction && <span className="reaction-badge">{selectedReaction}</span>}
      </div>
      {sender === 'user' && <Avatar sender={sender} />}
      {sender === 'user' && status && (
        <span className={`status-indicator status-${status}`} title={status}>
          {getStatusIcon()}
        </span>
      )}
    </div>
  );
});

MessageBubble.displayName = 'MessageBubble';

export default MessageBubble;
