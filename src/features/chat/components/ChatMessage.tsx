import React from 'react';
import { ChatMessage as ChatMessageType } from '../../../context/ChatContext';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  // Format the timestamp
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(message.timestamp);

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[60%] px-4 py-3 rounded-lg ${
          isUser 
            ? 'bg-primary text-white rounded-tr-none' 
            : 'bg-gray-100 text-gray-800 rounded-tl-none'
        }`}
      >
        {!isUser && (
          <div className="font-medium text-gray-600 mb-1">MagicMuse</div>
        )}
        
        <div className="prose prose-sm">
          <ReactMarkdown>
            {message.content}
          </ReactMarkdown>
        </div>
        
        <div className={`text-xs mt-1 text-right ${isUser ? 'text-primary-100' : 'text-gray-500'}`}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
