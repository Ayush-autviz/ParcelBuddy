import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, IMessage, User } from 'react-native-gifted-chat';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Header } from '../../components';
import { ChatStackParamList } from '../../navigation/ChatNavigator';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { useAuthStore } from '../../services/store';
import { useToast } from '../../components/Toast';
import { useChatWebSocket, ChatMessage } from '../../hooks/useChatWebSocket';

type ChatDetailScreenRouteProp = {
  key: string;
  name: 'ChatDetail';
  params: ChatStackParamList['ChatDetail'];
};

type ChatDetailScreenNavigationProp = StackNavigationProp<ChatStackParamList, 'ChatDetail'>;

const ChatDetailScreen: React.FC = () => {
  const route = useRoute<ChatDetailScreenRouteProp>();
  const navigation = useNavigation<ChatDetailScreenNavigationProp>();
  const { showError } = useToast();
  const { user } = useAuthStore();
  
  const { roomId, userName, userAvatar } = route.params;
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const typingTimeoutRef = useRef<any>(null);
  const readMessageIdsRef = useRef<Set<string>>(new Set());

  // Get current user ID for Gifted Chat
  const currentUserId = (user as any)?.id || (user as any)?.user_id || 'current-user';
  const currentUser: User = {
    _id: currentUserId,
    name: (user as any)?.first_name || (user as any)?.username || 'You',
    avatar: (user as any)?.profile?.profile_photo || undefined,
  };

  // Convert ChatMessage to IMessage format
  const convertToIMessage = useCallback((chatMessage: ChatMessage): IMessage => {
    return {
      _id: chatMessage.id,
      text: chatMessage.content,
      createdAt: new Date(chatMessage.created_on),
      user: {
        _id: chatMessage.sender_id,
        name: chatMessage.sender_name,
        avatar: undefined, // Can be added if available in API response
      },
      sent: true,
      received: true,
      pending: false,
    };
  }, []);

  // WebSocket connection - defined before handleNewMessage to use sendReadReceipt
  const {
    isConnected,
    connectionStatus,
    sendMessage: sendWebSocketMessage,
    sendTyping: sendWebSocketTyping,
    sendReadReceipt,
  } = useChatWebSocket({
    roomId,
    onMessage: (chatMessage: ChatMessage) => {
      const iMessage = convertToIMessage(chatMessage);
      setMessages((previousMessages) => GiftedChat.append(previousMessages, [iMessage]));
      
      // Mark message as read if it's from the other user
      if (chatMessage.sender_id !== currentUserId && !chatMessage.is_read) {
        readMessageIdsRef.current.add(chatMessage.id);
        // Send read receipt after a short delay
        setTimeout(() => {
          if (readMessageIdsRef.current.size > 0) {
            const messageIds = Array.from(readMessageIdsRef.current);
            sendReadReceipt(messageIds);
            readMessageIdsRef.current.clear();
          }
        }, 500);
      }
    },
    onTyping: (userId, isTyping) => {
      if (userId !== currentUserId) {
        setIsTyping(isTyping);
      }
    },
    onReadReceipt: (messageIds, readBy) => {
      // Update read status for messages
      setMessages((previousMessages) =>
        previousMessages.map((msg) => {
          if (messageIds.includes(msg._id as string)) {
            return { ...msg, received: true };
          }
          return msg;
        })
      );
    },
    onUserStatus: (userId, status) => {
      if (userId !== currentUserId) {
        setIsOnline(status === 'online');
      }
    },
    onConnected: () => {
      console.log('WebSocket connected');
      setIsLoading(false);
    },
    onDisconnected: () => {
      console.log('WebSocket disconnected');
    },
    onError: (error) => {
      console.error('WebSocket error:', error);
      showError('Connection error. Please try again.');
    },
  });

  // Hide bottom tab bar when this screen is focused
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      if (parent) {
        parent.setOptions({
          tabBarStyle: { display: 'none' },
        });
      }

      // Show tab bar again when screen is unfocused
      return () => {
        if (parent) {
          // Restore the original tab bar style
          parent.setOptions({
            tabBarStyle: {
              backgroundColor: Colors.backgroundWhite,
              borderTopWidth: 0,
              height: Platform.OS === 'ios' ? 65 : 70,
              paddingBottom: Platform.OS === 'ios' ? 20 : 10,
              paddingTop: Platform.OS === 'ios' ? 5 : 10,
              borderRadius: 30,
              marginHorizontal: 8,
              marginBottom: Platform.OS === 'ios' ? 20 : 20,
              position: 'absolute',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            },
          });
        }
      };
    }, [navigation])
  );

  // Handle typing indicator with debounce
  const handleTyping = useCallback((text: string) => {
    if (text.length > 0) {
      sendWebSocketTyping(true);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to stop typing after 1 second of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        sendWebSocketTyping(false);
      }, 1000);
    } else {
      sendWebSocketTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, [sendWebSocketTyping]);

  // Send message via WebSocket
  const onSend = useCallback(async (newMessages: IMessage[] = []) => {
    const messageText = newMessages[0]?.text;
    if (!messageText || !isConnected) {
      if (!isConnected) {
        showError('Not connected. Please wait...');
      }
      return;
    }

    try {
      // Optimistically add message to UI
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, newMessages)
      );

      // Stop typing indicator
      sendWebSocketTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Send via WebSocket
      sendWebSocketMessage(messageText, 'text');
    } catch (error: any) {
      console.error('Error sending message:', error);
      showError('Failed to send message. Please try again.');
      
      // Remove optimistic message on error
      setMessages((previousMessages) => previousMessages.slice(1));
    }
  }, [isConnected, sendWebSocketMessage, sendWebSocketTyping, showError]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title={userName} 
        showBackButton 
        variant="centered"
      />
      
      {/* Connection Status Indicator */}
      {connectionStatus !== 'connected' && (
        <View style={styles.statusBar}>
          <Text style={styles.statusText}>
            {connectionStatus === 'connecting' && 'Connecting...'}
            {connectionStatus === 'disconnected' && 'Disconnected. Reconnecting...'}
            {connectionStatus === 'error' && 'Connection error. Please check your internet.'}
          </Text>
        </View>
      )}

      {/* Online Status and Typing Indicator */}
      {(isOnline || isTyping) && (
        <View style={styles.infoBar}>
          {isOnline && (
            <Text style={styles.onlineText}>● Online</Text>
          )}
          {isTyping && (
            <Text style={styles.typingText}>User is typing...</Text>
          )}
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.chatContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={currentUser}
          placeholder="Type a message..."
          isLoadingEarlier={isLoading}
          showUserAvatar={true}
          renderAvatarOnTop={true}
          scrollToBottomComponent={() => null}
          infiniteScroll
          minInputToolbarHeight={60}
          onInputTextChanged={handleTyping}
          messagesContainerStyle={styles.messagesContainer}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    paddingBottom: 20,
  },
  textInput: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  statusBar: {
    backgroundColor: Colors.warning || '#FF9500',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  statusText: {
    color: Colors.textWhite,
    fontSize: Fonts.sm,
    fontWeight: Fonts.weightMedium,
  },
  infoBar: {
    backgroundColor: Colors.backgroundWhite,
    paddingVertical: 6,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  onlineText: {
    color: Colors.success || '#4DBAA5',
    fontSize: Fonts.xs,
    fontWeight: Fonts.weightMedium,
  },
  typingText: {
    color: Colors.textSecondary,
    fontSize: Fonts.xs,
    fontStyle: 'italic',
  },
});

export default ChatDetailScreen;

