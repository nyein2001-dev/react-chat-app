import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '../../store/chat/ChatContext';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../hooks/useAuth';
import { eventEmitter } from '../../utils/eventEmitter';
import { debounce } from 'lodash';

interface TypingUser {
  id: number;
  username: string;
}

export default function Conversation() {
  const { conversationId } = useParams();
  const { data: { messages }, isLoading } = useChat();
  const { socket, sendMessage: sendWebSocketMessage } = useSocket();
  const { user } = useAuth();
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  useEffect(() => {
    const handleTyping = (data: any) => {
      console.log('Typing notification received:', data);
      console.log('Current conversation:', conversationId);
      console.log('Current typing users:', typingUsers);
      
      if (data.conversation_id === Number(conversationId)) {
        setTypingUsers(prev => {
          console.log('Previous typing users:', prev);
          if (data.is_typing) {
            const exists = prev.some(u => u.id === data.user_id);
            if (!exists && data.user_id !== user?.id) {
              const newUsers = [...prev, { id: data.user_id, username: data.username }];
              console.log('Adding typing user, new state:', newUsers);
              return newUsers;
            }
          } else {
            const newUsers = prev.filter(u => u.id !== data.user_id);
            console.log('Removing typing user, new state:', newUsers);
            return newUsers;
          }
          return prev;
        });
      }
    };

    console.log('Setting up typing notification listener');
    eventEmitter.on('typing.notification', handleTyping);
    
    return () => {
      console.log('Cleaning up typing notification listener');
      eventEmitter.off('typing.notification', handleTyping);
    };
  }, [conversationId, user?.id]);

  const sendTypingStatus = (isTyping: boolean) => {
    if (socket?.readyState === WebSocket.OPEN && conversationId) {
      const payload = {
        type: 'typing',
        conversation_id: Number(conversationId),
        is_typing: isTyping
      };
      sendWebSocketMessage(payload);
    }
  };

  const debouncedStopTyping = debounce(() => {
    sendTypingStatus(false);
  }, 1000);

  const handleInputChange = () => {
    sendTypingStatus(true);
    debouncedStopTyping();
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (typingUsers.length > 0) {
    console.log('Rendering typing indicator, users:', typingUsers);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="mb-4"
          >
            <div className="flex items-start">
              <img
                src={message.sender.avatar_url || '/default-avatar.png'}
                alt={message.sender.username}
                className="w-8 h-8 rounded-full mr-2"
              />
              <div>
                <div className="font-semibold">{message.sender.username}</div>
                <div className="mt-1 p-2 bg-gray-100 rounded-lg">
                  {message.content}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {typingUsers.length > 0 && (
          <div className="text-sm text-gray-500 italic mt-2 p-2 bg-gray-50 rounded">
            {typingUsers
              .filter(u => u.id !== user?.id)
              .map(u => u.username)
              .join(', ')}
            {' '}
            {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <input
          type="text"
          placeholder="Type a message..."
          className="w-full p-2 border rounded-lg"
          onChange={handleInputChange}
          onBlur={() => sendTypingStatus(false)}
        />
      </div>
    </div>
  );
} 