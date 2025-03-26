import React, { useState, useRef, useEffect } from 'react';
import { IoSend, IoClose, IoSearch, IoChatbubble } from 'react-icons/io5';
import { useLocation } from 'react-router-dom';
import qwenService from '../../services/ai/qwen';
import { containsMarkdown, MarkdownContent } from '../../lib/markdown';
import './ChatPanel.css';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  isLoading?: boolean;
}

const ChatPanel: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: 'Hey there! I\'m MagicMuse, your content writing assistant. How can I help you today? Need some creative help or just want to chat about your writing project?',
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessageId = `user-${Date.now()}`;
    const userMessage: Message = {
      id: userMessageId,
      content: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Add user message
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Add loading message
    const loadingId = `loading-${Date.now()}`;
    setMessages(prev => [
      ...prev, 
      {
        id: loadingId,
        content: '',
        isUser: false,
        isLoading: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    try {
      // Format messages for API
      const apiMessages = messages
        .filter(msg => !msg.isLoading)
        .map(msg => ({
          role: msg.isUser ? 'user' as const : 'assistant' as const,
          content: msg.content
        }));

      // Add the new user message
      apiMessages.push({
        role: 'user',
        content: input
      });
      
      console.log("Sending to Qwen API:", apiMessages);
      
      // Call the QwenService with the Qwen prompt format
      const response = await qwenService.generateChatResponse({
        messages: apiMessages,
        temperature: 0.6,  // Adjusted for more structured tone with witty elements
        top_p: 0.5,        // Better word diversity while keeping coherence
        maxTokens: 800,
        systemPrompt: "You are MagicMuse, an expert in writing diverse types of content with a strong grasp of grammar, structure, and tone for various audiences. Your style is casual, witty, and elegant, with a touch of zestiness. When chatting, you use natural language akin to texting in a chat box. Maintain a friendly yet professional demeanor, avoiding emojis. Provide responses as \"You\" and aim for a natural conversation flow."
      });
      
      console.log("Received from Qwen API:", response);

      // Remove loading message and add response
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingId);
        
        // Check if response has valid choices
        if (response && response.choices && response.choices.length > 0 && response.choices[0].message) {
          return [
            ...filtered,
            {
              id: `assistant-${Date.now()}`,
              content: response.choices[0].message.content,
              isUser: false,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ];
        } else {
          console.error('Invalid API response structure:', response);
          return [
            ...filtered,
            {
              id: `error-${Date.now()}`,
              content: "I received an unexpected response. Let me try to help you differently.",
              isUser: false,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ];
        }
      });
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Replace loading message with a friendly error
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== loadingId);
        return [
          ...filtered,
          {
            id: `error-${Date.now()}`,
            content: "I seem to be having trouble connecting right now. Could you try again in a moment?",
            isUser: false,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ];
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Don't render anything on the landing page
  if (isLandingPage) {
    return null;
  }

  return (
    <>
      {/* Chat Toggle Button - Only visible when not on landing page */}
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
        <div className="chat-panel rounded-xl">
          {/* Chat Header */}
          <div className="chat-header  rounded-xl">
            <div className="chat-brand">
              <IoChatbubble size={20} />
              <span className="text-xl">magicmuse chat</span>
            </div>
            <div className="chat-actions">
              
              <button className="icon-button" aria-label="Close chat" onClick={toggleChat}>
                <IoClose size={18} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="chat-messages">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message ${message.isUser ? 'user-message' : 'ai-message'}`}
              >
                {message.isLoading ? (
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                ) : (
                  <div className="message-content">
                    {containsMarkdown(message.content) ? (
                      <MarkdownContent content={message.content} />
                    ) : (
                      message.content
                    )}
                  </div>
                )}
                <div className="message-timestamp">{message.timestamp}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSubmit} className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isProcessing}
            />
            <button 
              type="submit" 
              className="send-button"
              disabled={!input.trim() || isProcessing}
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
