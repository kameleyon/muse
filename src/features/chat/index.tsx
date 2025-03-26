import React from 'react';
import { FiMessageCircle } from 'react-icons/fi';
import { ChatProvider } from '../../context/ChatContext';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';

const ChatPage: React.FC = () => {
  return (
    <ChatProvider>
      <div className="flex flex-col h-full">
        <header className="bg-white border-b border-gray-200 py-4 px-6">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FiMessageCircle className="text-primary text-xl" />
              <h1 className="text-xl font-semibold">Chat with MagicMuse</h1>
            </div>
            <div className="text-sm text-gray-500">
              Powered by Qwen Plus
            </div>
          </div>
        </header>
        
        <ChatWindow />
        <ChatInput />
      </div>
    </ChatProvider>
  );
};

export default ChatPage;
