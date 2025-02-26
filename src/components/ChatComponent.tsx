import React, { useEffect, useState } from 'react';
import { eventEmitter } from '../utils/eventEmitter';
import { Message } from '../models/chat/types';

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      console.log('New message received:', message);
      alert(`New message from ${message.sender.username}: ${message.content}`);
      setMessages(prevMessages => [...prevMessages, message]);
    };

    eventEmitter.on('newMessage', handleNewMessage);

    return () => {
      eventEmitter.off('newMessage', handleNewMessage);
    };
  }, []);

  return (
    <div>
      <h2>Chat Messages</h2>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>
            <strong>{msg.sender.username}:</strong> {msg.content}
          </li>
        ))}
      </ul>
    </div>
  );
} 