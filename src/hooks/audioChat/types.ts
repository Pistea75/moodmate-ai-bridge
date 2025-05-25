
export type Message = {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export type ConversationMessage = {
  role: string;
  content: string;
};
