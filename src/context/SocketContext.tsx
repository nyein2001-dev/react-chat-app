import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../hooks/useAuth';
import { logger } from '../utils/logger';
import { Message } from '../models/chat/types';
import { eventEmitter } from '../utils/eventEmitter';
import { auth } from '../utils/auth';

interface WebSocketMessage {
  type: string;
  message?: Message;
  user_id?: number;
  username?: string;
}

interface SocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  sendMessage: (message: any) => void;
  lastMessage: WebSocketMessage | null;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const { user, isAuthenticated } = useAuth();
  const MAX_RECONNECT_ATTEMPTS = 5;

  const connect = useCallback(() => {
    const token = auth.getAccessToken();
    if (!token) {
      logger.error('No token available for WebSocket connection');
      return;
    }

    console.log('Token retrieved:', token);

    logger.info('Attempting to connect WebSocket...');
    const wsUrl = `${process.env.REACT_APP_WS_URL || 'ws://localhost:8000'}/ws/chat/?token=${token}`;
    logger.info('WebSocket URL:', wsUrl);

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      logger.info('WebSocket connection opened');
      setIsConnected(true);
      setReconnectAttempts(0);
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        logger.info('Received WebSocket message:');
        logger.info('Data:', data);

        eventEmitter.emit('message', data);

        switch (data.type) {
          case 'chat.message':
            if (data.message) {
              const message = data.message;
              eventEmitter.emit('newMessage', message);
              console.log('Emitting newMessage event:', message);
            }
            break;
          case 'typing.notification':
            eventEmitter.emit('typing.notification', data);
            break;
          default:
            logger.info('Unknown message type');
        }
      } catch (error) {
        logger.error('Error handling WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      logger.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = (event) => {
      logger.info('WebSocket closed with code:', event.code);
      setIsConnected(false);

      switch (event.code) {
        case 1000:
          logger.info('Normal closure');
          break;
        case 1006:
          logger.info('Abnormal closure - Check server logs');
          attemptReconnect();
          break;
        case 4000:
          logger.error('General error');
          break;
        case 4001:
          logger.error('No token provided');
          break;
        case 4002:
          logger.error('Invalid token or user not found');
          break;
        default:
          logger.info(`Connection closed with code ${event.code}`);
          attemptReconnect();
      }
    };

    setSocket(ws);
  }, []);

  const attemptReconnect = useCallback(() => {
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      logger.error('Max reconnection attempts reached');
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
    logger.info(`Attempting to reconnect in ${delay}ms (${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`);

    setTimeout(() => {
      setReconnectAttempts(prev => prev + 1);
      connect();
    }, delay);
  }, [reconnectAttempts, connect]);

  const sendMessage = useCallback((message: any) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      logger.error('WebSocket is not connected');
    }
  }, [socket]);

  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
        setLastMessage(null);
        setReconnectAttempts(0);
      }
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [isAuthenticated, connect]);

  const value = {
    socket,
    isConnected,
    sendMessage,
    lastMessage,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}