import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, IMessage, User, Bubble, InputToolbar, Send } from 'react-native-gifted-chat';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ArrowLeft, ChevronRight, Image as ImageIcon, Mic } from 'lucide-react-native';
import { ChatStackParamList } from '../../navigation/ChatNavigator';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { useAuthStore } from '../../services/store';
import { useToast } from '../../components/Toast';
import { useChatWebSocket, ChatMessage } from '../../hooks/useChatWebSocket';
import { getConversationMessages } from '../../services/api/chat';
import GradientButton from '../../components/GradientButton';

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
  
  const { roomId, userName, userAvatar, origin, destination } = route.params;
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

  // Convert API message response to IMessage format
  const convertApiMessageToIMessage = useCallback((apiMessage: any): IMessage => {
    // Use currentUserId for messages that are mine, so GiftedChat can properly identify them
    const messageUserId = apiMessage.is_mine ? currentUserId : apiMessage.sender;
    
    return {
      _id: apiMessage.id,
      text: apiMessage.content,
      createdAt: new Date(apiMessage.created_on),
      user: {
        _id: messageUserId,
        name: apiMessage.sender_name,
        avatar: apiMessage.sender_image || undefined,
      },
      sent: apiMessage.is_mine,
      received: apiMessage.is_delivered || apiMessage.is_read,
      pending: false,
      system: apiMessage.message_type === 'system',
    };
  }, [currentUserId]);

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

  // Fetch conversation messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await getConversationMessages(roomId);
        
        if (response && response.results) {
          const convertedMessages = response.results.map(convertApiMessageToIMessage);
          
          setMessages(convertedMessages);
        }
      } catch (error: any) {
        console.error('Error fetching messages:', error);
        showError('Failed to load messages. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [roomId, convertApiMessageToIMessage, showError]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Custom render functions for GiftedChat
  const renderBubble = (props: any) => {
    const isCurrentUser = props.currentMessage?.user?._id === currentUserId;
    
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: Colors.gradientStart,
            marginBottom: 5,
            marginRight: 0,
            marginLeft: '20%',
            borderRadius: 18,
            borderTopRightRadius: 18,
            borderTopLeftRadius: 18,
            borderBottomRightRadius: 18,
            borderBottomLeftRadius: 18,
          },
          left: {
            backgroundColor: Colors.backgroundWhite,
            marginBottom: 5,
            marginLeft: 0,
            marginRight: '20%',
            borderRadius: 18,
            borderTopRightRadius: 18,
            borderTopLeftRadius: 18,
            borderBottomRightRadius: 18,
            borderBottomLeftRadius: 18,
          },
        }}
        textStyle={{
          right: {
            color: Colors.textWhite,
            fontSize: 15,
            lineHeight: 20,
          },
          left: {
            color: Colors.textPrimary,
            fontSize: 15,
            lineHeight: 20,
          },
        }}
        containerStyle={{
          left: {
            marginLeft: 0,
            marginRight: 0,
          },
          right: {
            marginLeft: 0,
            marginRight: 0,
          },
        }}
        tickStyle={{
          left: { display: 'none' },
          right: { display: 'none' },
        }}
        renderTicks={() => null}
        bottomContainerStyle={{
          left: { display: 'none' },
          right: { display: 'none' },
        }}
      />
    );
  };

  const renderInputToolbar = (props: any) => {
    return (
      <View style={styles.inputToolbarContainer}>
        <InputToolbar
          {...props}
          containerStyle={styles.inputToolbar}
          textInputStyle={styles.textInput}
          renderActions={() => null}
        />
      </View>
    );
  };

  const renderSend = (props: any) => {
    return (
      <Send {...props} containerStyle={styles.sendContainer}>
        <View style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </View>
      </Send>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        
        <View style={styles.headerUserInfo}>
          {userAvatar ? (
            <Image source={{ uri: userAvatar }} style={styles.headerAvatar} />
          ) : (
            <View style={styles.headerAvatarPlaceholder}>
              <View style={styles.avatarPlaceholderInner} />
            </View>
          )}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerName}>{userName}</Text>
            <Text style={styles.headerStatus}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerRight} />
      </View>

      {/* Context Bar */}
      {(origin || destination) && (
        <TouchableOpacity style={styles.contextBar} activeOpacity={0.7}>
          <Text style={styles.contextText}>
            From: {origin || 'Unknown'} to {destination || 'Unknown'}
          </Text>
          <ChevronRight size={20} color={Colors.textTertiary} />
        </TouchableOpacity>
      )}

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

      {/* Typing Indicator */}
      {isTyping && (
        <View style={styles.infoBar}>
          <Text style={styles.typingText}>User is typing...</Text>
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
          bottomOffset={-100}
          placeholder="Type a message..."
          isLoadingEarlier={isLoading}
          showUserAvatar={false}
          renderAvatarOnTop={true}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          renderSend={renderSend}
          scrollToBottomComponent={() => null}
          infiniteScroll
          minInputToolbarHeight={60}
          onInputTextChanged={handleTyping}
          messagesContainerStyle={styles.messagesContainer}
        />
      </KeyboardAvoidingView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.declineButton} activeOpacity={0.7}>
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>
        <GradientButton
          title="Approve"
          onPress={() => {
            console.log('Approve pressed');
          }}
          style={styles.approveButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.backgroundWhite,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerUserInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.textTertiary,
    opacity: 0.3,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerName: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  headerStatus: {
    fontSize: Fonts.xs,
    color: Colors.textSecondary,
    fontWeight: Fonts.weightMedium,
  },
  headerRight: {
    width: 40,
  },
  // Context Bar Styles
  contextBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.backgroundGray,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  contextText: {
    fontSize: Fonts.sm,
    color: Colors.textPrimary,
    flex: 1,
  },
  // Chat Container Styles
  chatContainer: {
    flex: 1,
  },
  messagesContainer: {
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    marginRight: 8,
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  messageAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Input Toolbar Styles
  inputToolbarContainer: {
    backgroundColor: Colors.backgroundWhite,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    position: 'relative',
  },
  inputToolbar: {
    backgroundColor: Colors.backgroundWhite,
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingBottom: 10,
    paddingRight: 8,
  },
  textInput: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    // paddingVertical: 10,
    fontSize: 15,
    color: Colors.textPrimary,
    flex: 1,
    marginRight: 8,
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
    marginBottom: 0,
  },
  sendButton: {
    backgroundColor: Colors.gradientStart,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    color: Colors.textWhite,
    fontSize: 15,
    fontWeight: Fonts.weightBold,
  },
  inputIconsContainer: {
    position: 'absolute',
    right: 20,
    top: 10,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputIcon: {
    marginLeft: 8,
    padding: 4,
  },
  // Action Buttons Styles
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 30,
    backgroundColor: Colors.backgroundWhite,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 12,
  },
  declineButton: {
    flex: 1,
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  declineButtonText: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
  },
  approveButton: {
    flex: 1,
  },
  // Status Bar Styles
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
  typingText: {
    color: Colors.textSecondary,
    fontSize: Fonts.xs,
    fontStyle: 'italic',
  },
});

export default ChatDetailScreen;

