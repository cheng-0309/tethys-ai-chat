import React from 'react';
import Header from './components/Header';
import ChatContainer from './components/ChatContainer';
import './styles/App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <ChatContainer />
    </div>
  );
}

export default App;
