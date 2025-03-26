export interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: string;
}

export interface ChatPanelProps {
  initialOpen?: boolean;
}
