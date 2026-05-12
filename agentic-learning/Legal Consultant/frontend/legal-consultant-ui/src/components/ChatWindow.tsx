import React, { useState, useRef, useEffect } from 'react';
import { startConsultation, sendMessage } from '../api';
import { ChatOption, ChatResponse } from '../types';
import ChatMessage from './ChatMessage';
import OptionButtons from './OptionButtons';
import StepIndicator from './StepIndicator';
import './ChatWindow.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  options?: ChatOption[];
}

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepTitle, setStepTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: ChatResponse = await startConsultation();
      setSessionId(response.sessionId);
      setCurrentStep(response.currentStep);
      setStepTitle(response.stepTitle);
      setMessages([
        {
          role: 'assistant',
          content: response.message,
          options: response.options,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start consultation');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (messageText: string) => {
    if (!sessionId || loading) return;

    setLoading(true);
    setError(null);

    // Remove options from the last assistant message
    setMessages((prev) => {
      const updated = [...prev];
      if (updated.length > 0) {
        const last = updated[updated.length - 1];
        if (last.role === 'assistant') {
          updated[updated.length - 1] = { ...last, options: [] };
        }
      }
      return [...updated, { role: 'user', content: messageText }];
    });

    try {
      const response = await sendMessage(sessionId, messageText);
      setCurrentStep(response.currentStep);
      setStepTitle(response.stepTitle);

      if (response.currentStep === 8 && response.options?.some(o => o.value === 'new_consultation')) {
        // If the follow-up includes starting a new consultation, handle session reset
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.message,
          options: response.options,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (option: ChatOption) => {
    handleSendMessage(option.label);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      handleSendMessage(textInput.trim());
      setTextInput('');
    }
  };

  const handleNewConsultation = () => {
    setMessages([]);
    setSessionId(null);
    setCurrentStep(1);
    setStepTitle('');
    setError(null);
  };

  const lastMessage = messages[messages.length - 1];
  const showOptions = lastMessage?.role === 'assistant' && lastMessage.options && lastMessage.options.length > 0;

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="header-content">
          <h1>⚖️ AI Legal Consultant</h1>
          <p>Get structured legal insights on Indian law</p>
        </div>
        {sessionId && (
          <button className="new-consultation-btn" onClick={handleNewConsultation}>
            + New Consultation
          </button>
        )}
      </div>

      {sessionId && <StepIndicator currentStep={currentStep} />}

      <div className="chat-messages">
        {!sessionId && messages.length === 0 && (
          <div className="welcome-screen">
            <div className="welcome-icon">⚖️</div>
            <h2>Welcome to AI Legal Consultant</h2>
            <p>
              I'll guide you step-by-step through your legal query using simple
              options. I'll provide applicable laws, case references, estimated
              timeline, and legal costs.
            </p>
            <ul className="features-list">
              <li>📋 Applicable Laws & Sections</li>
              <li>📚 Relevant Court Judgements</li>
              <li>📊 Case Strength Analysis</li>
              <li>⏱️ Timeline Predictions</li>
              <li>💰 Cost Estimations</li>
              <li>🧭 Recommended Actions</li>
            </ul>
            <button
              className="start-btn"
              onClick={handleStart}
              disabled={loading}
            >
              {loading ? 'Starting...' : 'Start Consultation'}
            </button>
            <p className="disclaimer">
              ⚠️ This tool provides legal insights for informational purposes
              only. It does not constitute legal advice. Always consult a
              qualified lawyer for specific legal matters.
            </p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index}>
            <ChatMessage role={msg.role} content={msg.content} />
            {index === messages.length - 1 &&
              msg.role === 'assistant' &&
              msg.options &&
              msg.options.length > 0 && (
                <div className="options-container">
                  <OptionButtons
                    options={msg.options}
                    onSelect={handleOptionSelect}
                    disabled={loading}
                  />
                </div>
              )}
          </div>
        ))}

        {loading && (
          <div className="loading-indicator">
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span className="loading-text">Analyzing...</span>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span>❌ {error}</span>
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {sessionId && (
        <div className="chat-input-area">
          {stepTitle && (
            <div className="step-title-bar">
              Step {currentStep}: {stepTitle}
            </div>
          )}
          <form onSubmit={handleTextSubmit} className="input-form">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={
                showOptions
                  ? 'Select an option above or type your response...'
                  : 'Type your response...'
              }
              disabled={loading}
              className="text-input"
            />
            <button
              type="submit"
              disabled={loading || !textInput.trim()}
              className="send-btn"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
