export interface ChatOption {
  label: string;
  value: string;
}

export interface ChatResponse {
  sessionId: string;
  message: string;
  currentStep: number;
  stepTitle: string;
  options: ChatOption[];
}

export interface ChatRequest {
  sessionId?: string;
  message: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  step: number;
  timestamp: string;
}

export interface HistoryResponse {
  sessionId: string;
  currentStep: number;
  messages: ConversationMessage[];
}
