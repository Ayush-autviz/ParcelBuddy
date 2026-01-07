import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuthStore } from '../services/store';
import { useQueryClient } from '@tanstack/react-query';

const BaseURL = 'https://api.parcelbuddys.com';
const WS_BASE_URL = BaseURL.replace('http://', 'ws://').replace('https://', 'wss://');

export interface ChatMessage {
  id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  message_type: 'text' | 'image' | 'system';
  created_on: string;
  is_read: boolean;
}

export interface WebSocketMessage {
  type: 'chat_message' | 'typing_indicator' | 'read_receipt' | 'user_status';
  message?: ChatMessage;
  user_id?: string;
  is_typing?: boolean;
  message_ids?: string[];
  read_by?: string;
  status?: 'online' | 'offline';
}

interface UseChatWebSocketOptions {
  roomId: string;
  onMessage?: (message: ChatMessage) => void;
  onTyping?: (userId: string, isTyping: boolean) => void;
  onReadReceipt?: (messageIds: string[], readBy: string) => void;
  onUserStatus?: (userId: string, status: 'online' | 'offline') => void;
  onConnected?: () => void;
  onDisconnected?: () => void;
  onError?: (error: Event) => void;
}

export const useChatWebSocket = (options: UseChatWebSocketOptions) => {
  const { roomId, onMessage, onTyping, onReadReceipt, onUserStatus, onConnected, onDisconnected, onError } = options;
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelayRef = useRef(1000); // Start with 1 second

  // Store callbacks in refs to prevent re-renders
  const callbacksRef = useRef({
    onMessage,
    onTyping,
    onReadReceipt,
    onUserStatus,
    onConnected,
    onDisconnected,
    onError,
  });

  // Update callbacks ref when they change
  useEffect(() => {
    callbacksRef.current = {
      onMessage,
      onTyping,
      onReadReceipt,
      onUserStatus,
      onConnected,
      onDisconnected,
      onError,
    };
  }, [onMessage, onTyping, onReadReceipt, onUserStatus, onConnected, onDisconnected, onError]);

  const connect = useCallback(() => {
    console.log('🔌 [WebSocket] Attempting to connect...');
    console.log('🔌 [WebSocket] Room ID:', roomId);

    if (!token?.access_token) {
      console.error('❌ [WebSocket] No access token available');
      setConnectionStatus('error');
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log('✅ [WebSocket] WebSocket already connected, skipping...');
      return;
    }

    // Close existing connection if any
    if (wsRef.current) {
      console.log('🔌 [WebSocket] Closing existing connection...');
      wsRef.current.close();
      wsRef.current = null;
    }

    try {
      // Native WebSocket connection URL
      const wsUrl = `${WS_BASE_URL}/ws/chat/${roomId}/?token=${token.access_token}`;
      console.log('🔌 [WebSocket] Connecting to WebSocket:', wsUrl.replace(token.access_token, 'TOKEN'));
      console.log('🔌 [WebSocket] Base URL:', WS_BASE_URL);
      console.log('🔌 [WebSocket] Room ID:', roomId);
      console.log('🔌 [WebSocket] Token present:', !!token.access_token);
      console.log('🔌 [WebSocket] Token length:', token.access_token?.length);

      setConnectionStatus('connecting');

      // Create native WebSocket connection
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      console.log('🔌 [WebSocket] WebSocket instance created');

      // Connection events
      ws.onopen = () => {
        console.log('✅ [WebSocket] WebSocket CONNECTED successfully!');
        console.log('✅ [WebSocket] Ready state:', ws.readyState);
        console.log('✅ [WebSocket] Room ID:', roomId);
        setIsConnected(true);
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
        reconnectDelayRef.current = 1000;
        callbacksRef.current.onConnected?.();
      };

      ws.onclose = (event) => {
        console.log('🔌 [WebSocket] WebSocket DISCONNECTED');
        console.log('🔌 [WebSocket] Close code:', event.code);
        console.log('🔌 [WebSocket] Close reason:', event.reason);
        console.log('🔌 [WebSocket] Room ID:', roomId);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        callbacksRef.current.onDisconnected?.();

        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          console.log(`🔄 [WebSocket] Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts}) in ${reconnectDelayRef.current}ms...`);

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectDelayRef.current = Math.min(reconnectDelayRef.current * 2, 30000); // Exponential backoff, max 30s
            connect();
          }, reconnectDelayRef.current);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.error('❌ [WebSocket] Max reconnection attempts reached');
          setConnectionStatus('error');
        }
      };

      ws.onerror = (error) => {
        console.error('❌ [WebSocket] WebSocket CONNECTION ERROR');
        console.error('❌ [WebSocket] Error event:', error);
        console.error('❌ [WebSocket] Ready state:', ws.readyState);
        console.error('❌ [WebSocket] Room ID:', roomId);
        setConnectionStatus('error');
        callbacksRef.current.onError?.(error as any);
      };

      // Message handler - receives all messages from server
      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          console.log('📨 [WebSocket] RECEIVED WebSocket message');
          console.log('📨 [WebSocket] Message type:', data.type);
          console.log('📨 [WebSocket] Full message data:', JSON.stringify(data, null, 2));

          switch (data.type) {
            case 'chat_message':
              if (data.message) {
                queryClient.invalidateQueries({ queryKey: ['chat', roomId] });
                // Force refetch chat list to ensure UI updates immediately (matches ['chatList', ...])
                queryClient.refetchQueries({ queryKey: ['chatList'], type: 'all' });
                // Force refetch unread count to ensure tab badge updates immediately
                queryClient.refetchQueries({ queryKey: ['unreadCount'], type: 'all' });

                console.log('📨 [WebSocket] Processing chat_message:', {
                  id: data.message.id,
                  sender: data.message.sender_name,
                  content: data.message.content.substring(0, 50) + '...',
                  timestamp: data.message.created_on,
                });
                callbacksRef.current.onMessage?.(data.message);
              } else {
                console.warn('⚠️ [WebSocket] chat_message event received but no message data');
              }
              break;

            case 'typing_indicator':
              console.log('⌨️ [WebSocket] RECEIVED typing_indicator');
              console.log('⌨️ [WebSocket] Typing data:', JSON.stringify(data, null, 2));
              if (data.user_id !== undefined && data.is_typing !== undefined) {
                console.log('⌨️ [WebSocket] User', data.user_id, 'is typing:', data.is_typing);
                callbacksRef.current.onTyping?.(data.user_id, data.is_typing);
              }
              break;

            case 'read_receipt':
              console.log('✓✓ [WebSocket] RECEIVED read_receipt');
              console.log('✓✓ [WebSocket] Read receipt data:', JSON.stringify(data, null, 2));
              if (data.message_ids && data.read_by) {
                console.log('✓✓ [WebSocket] Messages read by', data.read_by, ':', data.message_ids);
                callbacksRef.current.onReadReceipt?.(data.message_ids, data.read_by);
              }
              break;

            case 'user_status':
              console.log('👤 [WebSocket] RECEIVED user_status');
              console.log('👤 [WebSocket] User status data:', JSON.stringify(data, null, 2));
              if (data.user_id && data.status) {
                console.log('👤 [WebSocket] User', data.user_id, 'status:', data.status);
                callbacksRef.current.onUserStatus?.(data.user_id, data.status);
              }
              break;

            default:
              console.warn('⚠️ [WebSocket] Unknown message type:', data.type);
          }
        } catch (error) {
          console.error('❌ [WebSocket] Error parsing WebSocket message:', error);
          console.error('❌ [WebSocket] Raw message:', event.data);
        }
      };

    } catch (error) {
      console.error('❌ [WebSocket] Error creating WebSocket connection:', error);
      setConnectionStatus('error');
      callbacksRef.current.onError?.(error as Event);
    }
  }, [roomId, token?.access_token]); // Only depend on roomId and token, not callbacks

  const disconnect = useCallback(() => {
    console.log('🔌 [WebSocket] Disconnecting...');

    // Clear reconnection timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      console.log('🔌 [WebSocket] WebSocket exists, closing connection...');
      console.log('🔌 [WebSocket] Ready state before close:', wsRef.current.readyState);
      wsRef.current.close(1000, 'User disconnected');
      wsRef.current = null;
      console.log('🔌 [WebSocket] WebSocket closed and cleared');
    } else {
      console.log('🔌 [WebSocket] No WebSocket to disconnect');
    }

    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  const sendMessage = useCallback((message: string, messageType: 'text' | 'image' | 'system' = 'text') => {
    console.log('📤 [WebSocket] Attempting to send message...');
    console.log('📤 [WebSocket] Message:', message);
    console.log('📤 [WebSocket] Message type:', messageType);
    console.log('📤 [WebSocket] WebSocket ready state:', wsRef.current?.readyState);
    console.log('📤 [WebSocket] WebSocket exists?', !!wsRef.current);
    console.log('📤 [WebSocket] Is OPEN?', wsRef.current?.readyState === WebSocket.OPEN);

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const payload = {
        type: 'chat_message',
        message,
        message_type: messageType,
      };
      const payloadString = JSON.stringify(payload);
      console.log('📤 [WebSocket] Sending message with payload:', payloadString);
      wsRef.current.send(payloadString);
      console.log('✅ [WebSocket] Message SENT successfully via WebSocket');
    } else {
      console.error('❌ [WebSocket] Cannot send message - WebSocket is NOT connected');
      console.error('❌ [WebSocket] Ready state:', wsRef.current?.readyState);
      console.error('❌ [WebSocket] Connection status:', wsRef.current ? `exists but state is ${wsRef.current.readyState}` : 'does not exist');
    }
  }, []);

  const sendTyping = useCallback((isTyping: boolean) => {
    console.log('⌨️ [WebSocket] Sending typing indicator:', isTyping);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const payload = {
        type: 'typing',
        is_typing: isTyping,
      };
      const payloadString = JSON.stringify(payload);
      console.log('⌨️ [WebSocket] Sending typing event:', payloadString);
      wsRef.current.send(payloadString);
      console.log('✅ [WebSocket] Typing indicator SENT');
    } else {
      console.warn('⚠️ [WebSocket] Cannot send typing indicator - WebSocket not connected');
      console.warn('⚠️ [WebSocket] Ready state:', wsRef.current?.readyState);
    }
  }, []);

  const sendReadReceipt = useCallback((messageIds: string[]) => {
    console.log('✓✓ [WebSocket] Sending read receipt for', messageIds.length, 'messages');
    console.log('✓✓ [WebSocket] Message IDs:', messageIds);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const payload = {
        type: 'read_receipt',
        message_ids: messageIds,
      };
      const payloadString = JSON.stringify(payload);
      console.log('✓✓ [WebSocket] Sending read_receipt:', payloadString);
      wsRef.current.send(payloadString);
      console.log('✅ [WebSocket] Read receipt SENT successfully');
    } else {
      console.warn('⚠️ [WebSocket] Cannot send read receipt - WebSocket not connected');
      console.warn('⚠️ [WebSocket] Ready state:', wsRef.current?.readyState);
    }
  }, []);

  useEffect(() => {
    console.log('🔄 [WebSocket] useEffect triggered - connecting...');
    console.log('🔄 [WebSocket] Room ID:', roomId);
    console.log('🔄 [WebSocket] Token available:', !!token?.access_token);

    connect();

    return () => {
      console.log('🔄 [WebSocket] useEffect cleanup - disconnecting...');
      disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, token?.access_token]); // Only reconnect when roomId or token changes

  return {
    isConnected,
    connectionStatus,
    sendMessage,
    sendTyping,
    sendReadReceipt,
    connect,
    disconnect,
  };
};

