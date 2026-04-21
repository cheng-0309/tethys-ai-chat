import React from 'react';
import '../styles/SkeletonLoader.css';

function SkeletonLoader() {
  return (
    <div className="skeleton-message">
      <div className="skeleton-avatar"></div>
      <div className="skeleton-bubble">
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line" style={{ width: '70%' }}></div>
      </div>
    </div>
  );
}

export default SkeletonLoader;
