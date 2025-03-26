import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import qwenService from '../services/ai/qwen';

// Define the chat message interface
export interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Define the context interface
interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

// Create the context with default values
const ChatContext = createContext<ChatContextType>({
  messages: [],
  isLoading: false,
  error: null,
  sendMessage: async () => {},
  clearChat: () => {},
});

// Default system message
const DEFAULT_SYSTEM_MESSAGE: ChatMessage = {
  id: 'system-1',
  role: 'system',
  content: `You are MagicMuse, an expert in writing diverse types of content with a strong grasp of grammar, structure, and tone for various audiences. Your style is casual, witty, and elegant, with a touch of zestiness. When chatting, you use natural language akin to texting in a chat box. Maintain a friendly yet professional demeanor, avoiding emojis. Provide responses as "You" and aim for a natural conversation flow.`,
  timestamp: new Date(),
};

// Custom hook for using the chat context
export const useChat = () => useContext(ChatContext);

// Provider component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([DEFAULT_SYSTEM_MESSAGE]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize chat with a welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: 'assistant-welcome',
      role: 'assistant',
      content: "Hey there! I'm MagicMuse, your content companion. What kind of writing are you looking to create today? I can help with blogs, social posts, emails, or just about any content you need!",
      timestamp: new Date(),
    };

    setMessages(prev => {
      // Only add the welcome message if it doesn't already exist
      if (!prev.find(msg => msg.id === 'assistant-welcome')) {
        return [...prev, welcomeMessage];
      }
      return prev;
    });
  }, []);

  // Function to send a message
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Create a new user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date(),
    };

    // Add user message to the chat
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Format messages for the API
      const apiMessages = messages
        .filter(msg => msg.role !== 'system')
        .concat(userMessage)
        .map(msg => ({
          role: msg.role,
          content: msg.content,
        }));

      // Call the Qwen service
      const response = await qwenService.generateChatResponse({
        messages: apiMessages,
        temperature: 0.9,
        maxTokens: 800,
      });

      // Create assistant message from the response
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.choices[0].message.content,
        timestamp: new Date(),
      };

      // Add assistant message to the chat
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while sending your message');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to clear the chat
  const clearChat = () => {
    setMessages([DEFAULT_SYSTEM_MESSAGE]);
    
    // Add welcome message back
    const welcomeMessage: ChatMessage = {
      id: 'assistant-welcome',
      role: 'assistant',
      content: "Hey there! I'm MagicMuse, your content companion. What kind of writing are you looking to create today? I can help with blogs, social posts, emails, or just about any content you need!",
      timestamp: new Date(),
    };
    
    setMessages([DEFAULT_SYSTEM_MESSAGE, welcomeMessage]);
    setError(null);
  };

  return (
    <ChatContext.Provider value={{ messages, isLoading, error, sendMessage, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
};
