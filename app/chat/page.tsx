'use client';
import React, { useState } from 'react';
import styles from './Chatbot.module.css';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: 'system', content: 'You are a helpful assistant.' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages([...newMessages, { role: 'assistant', content: data.message }]);
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className={styles['chatbot-container']}>
      <h2>Chatbot</h2>
      <div className={styles['chatbot-messages']}>
        {messages
          .filter((m) => m.role !== 'system')
          .map((m, i) => (
            <div
              key={i}
              className={
                styles['chatbot-message'] +
                ' ' +
                (m.role === 'user' ? styles['user'] : styles['assistant'])
              }
            >
              <b>{m.role === 'user' ? 'You' : 'Bot'}:</b> {m.content}
            </div>
          ))}
        {loading && <div>Bot is typing...</div>}
        {error && <div className={styles['chatbot-error']}>{error}</div>}
      </div>
      <form onSubmit={sendMessage} className={styles['chatbot-form']}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className={styles['chatbot-input']}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className={styles['chatbot-button']}
        >
          Send
        </button>
      </form>
    </div>
  );
}
