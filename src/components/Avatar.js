import React from 'react';
import '../styles/Avatar.css';

const BOT_IMAGE_URL = 'https://pbs.twimg.com/profile_images/1821173315840446464/3bcvQLYa_400x400.jpg';

function Avatar({ sender }) {
  return (
    <div className={`avatar avatar-${sender}`}>
      {sender === 'user' ? (
        '👤'
      ) : (
        <img 
          src={BOT_IMAGE_URL} 
          alt="Bot avatar" 
          className="avatar-image"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}
    </div>
  );
}

export default Avatar;
