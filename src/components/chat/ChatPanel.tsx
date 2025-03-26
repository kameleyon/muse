import React, { useState } from 'react';
import { IoSend, IoClose, IoSearch, IoChatbubble } from 'react-icons/io5';
import './ChatPanel.css';

interface Message {
  content: string;
  isUser: boolean;
  timestamp: string;
}

const ChatPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      content: 'Hi there! How can I help you today?',
      isUser: false,
      timestamp: '12:16 AM'
    },
    {
      content: 'I apologize, but there was an error processing your request. Please try again later.',
      isUser: false,
      timestamp: '12:16 AM'
    },
    {
      content: 'I apologize, but there was an error processing your request. Please try again later.',
      isUser: false,
      timestamp: '12:16 AM'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      content: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInput('');
    
    // Simulate response after a short delay
    setTimeout(() => {
      const response: Message = {
        content: 'I apologize, but there was an error processing your request. Please try again later.',
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chat Toggle Button - Always visible */}
      <button 
        className="chat-toggle-button"
        onClick={toggleChat}
        aria-label="Toggle chat"
      >
        <div className="chat-icon">
          {isOpen ? <IoClose size={20} /> : <IoChatbubble size={20} />}
        </div>
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="chat-panel">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-brand">
              <IoChatbubble size={24} />
              <span>magicmuse chat</span>
            </div>
            <div className="chat-actions">
              <button className="icon-button" aria-label="New chat">
                <IoSearch size={18} />
              </button>
              <button className="icon-button" aria-label="Close chat" onClick={toggleChat}>
                <IoClose size={18} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
              >
                <div className="message-content">{message.content}</div>
                <div className="message-timestamp">{message.timestamp}</div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit" 
              className="send-button"
              disabled={!input.trim()}
              aria-label="Send message"
            >
              <IoSend size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatPanel;
