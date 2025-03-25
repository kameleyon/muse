import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { 
  generateChatResponse, 
  generateResearchResponse, 
  getChatSystemPrompt,
  generateMockResponse,
  isConfigured,
  ChatMessage as ApiChatMessage
} from '@/services/ai/openrouter';

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isLoading?: boolean;
}

type ChatMode = 'chat' | 'research';

interface ChatContextType {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  chatMode: ChatMode;
  toggleChat: () => void;
  addMessage: (content: string, sender: 'user' | 'ai', isLoading?: boolean) => string;
  updateMessage: (id: string, updatedContent: string, isLoading?: boolean) => void;
  clearMessages: () => void;
  sendMessage: (content: string) => Promise<void>;
  setChatMode: (mode: ChatMode) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

// Function to convert our messages to the format expected by OpenRouter API
const convertToApiMessages = (messages: ChatMessage[]): ApiChatMessage[] => {
  return messages
    .filter(msg => !msg.isLoading) // Filter out any loading messages
    .map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
};

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('chat');
  const [apiFailureCount, setApiFailureCount] = useState(0);
  const [useMockResponse, setUseMockResponse] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hi there! How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);

  const toggleChat = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const addMessage = useCallback((content: string, sender: 'user' | 'ai', isLoading: boolean = false): string => {
    const newMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content,
      sender,
      timestamp: new Date(),
      isLoading
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    return newMessage.id;
  }, []);

  const updateMessage = useCallback((id: string, updatedContent: string, isLoading: boolean = false) => {
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === id ? { ...msg, content: updatedContent, isLoading } : msg
      )
    );
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: Date.now().toString(),
        content: 'Hi there! How can I help you today?',
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
    // Reset failure count when clearing messages
    setApiFailureCount(0);
    setUseMockResponse(false);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (content.trim() === '' || isLoading) return;
    
    // Add user message
    addMessage(content, 'user');
    
    // Add loading message from AI
    const loadingMsgId = addMessage('...', 'ai', true);
    setIsLoading(true);
    
    try {
      let response: string;
      
      // Check if we should use mock responses (after API failures or if no API key configured)
      if (useMockResponse || !isConfigured()) {
        console.log('Using mock response system');
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        response = generateMockResponse(content);
      } else {
        // Use different API based on chat mode
        if (chatMode === 'research') {
          response = await generateResearchResponse(content);
        } else {
          // For chat mode, include conversation history
          const apiMessages = convertToApiMessages(messages);
          
          // Add a system message first to set the tone/personality
          apiMessages.unshift({
            role: 'system',
            content: getChatSystemPrompt()
          });
          
          // Add the current user message
          apiMessages.push({ role: 'user', content });
          
          response = await generateChatResponse(apiMessages);
        }
      }
      
      // Update the loading message with actual response
      updateMessage(loadingMsgId, response, false);
      
      // Reset failure count on success
      if (apiFailureCount > 0) {
        setApiFailureCount(0);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Increment failure count
      const newFailureCount = apiFailureCount + 1;
      setApiFailureCount(newFailureCount);
      
      // After multiple failures, switch to mock responses
      if (newFailureCount >= 2) {
        setUseMockResponse(true);
        console.log('Switched to mock responses after multiple API failures');
        
        // Provide a mock response instead of an error
        const mockResponse = generateMockResponse(content);
        updateMessage(loadingMsgId, mockResponse, false);
      } else {
        updateMessage(
          loadingMsgId, 
          'I apologize, but I encountered an error while processing your request. Please try again later.', 
          false
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [messages, chatMode, addMessage, updateMessage, isLoading, apiFailureCount, useMockResponse]);

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        messages,
        isLoading,
        chatMode,
        toggleChat,
        addMessage,
        updateMessage,
        clearMessages,
        sendMessage,
        setChatMode
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
