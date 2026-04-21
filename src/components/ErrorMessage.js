import React from 'react';
import '../styles/ErrorMessage.css';

function ErrorMessage({ message, onDismiss }) {
  return (
    <div className="error-message">
      <span className="error-icon">⚠️</span>
      <span className="error-text">{message}</span>
      {onDismiss && (
        <button className="error-close" onClick={onDismiss} aria-label="Dismiss">
          ✕
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
