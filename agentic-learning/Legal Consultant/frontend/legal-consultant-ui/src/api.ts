import { ChatRequest, ChatResponse, HistoryResponse } from './types';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5010';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }
  return response.json();
}

export async function startConsultation(): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE}/api/consultation/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return handleResponse<ChatResponse>(response);
}

export async function sendMessage(sessionId: string, message: string): Promise<ChatResponse> {
  const response = await fetch(`${API_BASE}/api/consultation/${sessionId}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message } as ChatRequest),
  });
  return handleResponse<ChatResponse>(response);
}

export async function getHistory(sessionId: string): Promise<HistoryResponse> {
  const response = await fetch(`${API_BASE}/api/consultation/${sessionId}/history`);
  return handleResponse<HistoryResponse>(response);
}
