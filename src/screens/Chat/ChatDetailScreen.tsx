import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GiftedChat, IMessage, User } from 'react-native-gifted-chat';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Header } from '../../components';
import { ChatStackParamList } from '../../navigation/ChatNavigator';
import { Colors } from '../../constants/colors';
import { useAuthStore } from '../../services/store';
import { useToast } from '../../components/Toast';

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

  // Get current user ID for Gifted Chat
  const currentUser: User = {
    _id: (user as any)?.id || (user as any)?.user_id || 'current-user',
    name: (user as any)?.first_name || (user as any)?.username || 'You',
    avatar: (user as any)?.profile?.profile_photo || undefined,
  };

  // Load initial messages
  useEffect(() => {
    loadMessages();
  }, [roomId]);

  const loadMessages = async () => {
   
  };

  const onSend = useCallback(async (newMessages: IMessage[] = []) => {

  }, [roomId, showError]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header 
        title={userName} 
        showBackButton 
        variant="centered"
      />
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
        //   textInputStyle={styles.textInput}
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
});

export default ChatDetailScreen;

