import React, { useEffect } from 'react';
import { eventEmitter } from '../../../utils/eventEmitter';
import { Message } from '../../../models/chat/types';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../context/ToastContext';

export default function Notification() {
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      if (message.sender.id !== user?.id) {
        showToast('info', `${message.sender.username}`, `${message.content}`);
       
      }
    };

    eventEmitter.on('newMessage', handleNewMessage);

    return () => {
      eventEmitter.off('newMessage', handleNewMessage);
    };
  }, [user]);

  return null;
} 