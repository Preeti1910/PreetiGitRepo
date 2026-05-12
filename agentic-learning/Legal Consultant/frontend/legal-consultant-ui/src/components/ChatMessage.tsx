import React from 'react';
import './ChatMessage.css';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ role, content }) => {
  return (
    <div className={`chat-message ${role}`}>
      <div className="message-avatar">
        {role === 'assistant' ? '⚖️' : '👤'}
      </div>
      <div className="message-content">
        <div className="message-role">
          {role === 'assistant' ? 'Legal Consultant' : 'You'}
        </div>
        <div
          className="message-text"
          dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
        />
      </div>
    </div>
  );
};

function formatMarkdown(text: string): string {
  if (!text) return '';
  let html = text
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Headers
    .replace(/^### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^## (.*$)/gm, '<h3>$1</h3>')
    .replace(/^# (.*$)/gm, '<h2>$1</h2>')
    // Line breaks
    .replace(/\n/g, '<br/>');
  return html;
}

export default ChatMessage;
