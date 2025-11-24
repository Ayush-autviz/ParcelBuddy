import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, User, MessageCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, Card, SearchInput, EmptyStateCard } from '../../components';
import { useChatList, ChatRoom } from '../../hooks/useChat';
import { SvgXml } from 'react-native-svg';
import { FilledUserIcon } from '../../assets/icons/svg/main';
import { ChatStackParamList } from '../../navigation/ChatNavigator';
import { ProfileUserIcon } from '../../assets/icons/svg/profileIcon';

// Message data interface
interface MessageItem {
  id: string;
  name: string;
  avatar?: string;
  origin: string;
  destination: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  hasUnread?: boolean;
}

type ChatScreenNavigationProp = StackNavigationProp<ChatStackParamList, 'ChatList'>;

const ChatScreen: React.FC = () => {
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch chat list from API
  const { data: chatListResponse, isLoading, isError, error, refetch, isRefetching } = useChatList();

  console.log('chatListResponse', chatListResponse);
  
  // Transform API response to MessageItem format
  const messages: any = useMemo(() => {
    if (!chatListResponse?.results || !Array.isArray(chatListResponse.results)) {
      return [];
    }

    return chatListResponse.results.map((room: ChatRoom) => {
      const otherUser = room.other_user;
      const firstName = otherUser?.first_name || '';
      const lastName = otherUser?.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim() || 'Unknown User';
      
      // Format timestamp
      const formatTimestamp = (dateString: string | undefined): string => {
        if (!dateString) return '';
        try {
          const date = new Date(dateString);
          const now = new Date();
          const diffMs = now.getTime() - date.getTime();
          const diffMinutes = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);

          if (diffMinutes < 1) return 'Just now';
          if (diffMinutes < 60) return `${diffMinutes}m`;
          if (diffHours < 24) return `${diffHours}h`;
          if (diffDays < 7) return `${diffDays}d`;
          return date.toLocaleDateString();
        } catch {
          return '';
        }
      };

      return {
        id: room.id || '',
        name: fullName,
        avatar: otherUser?.profile?.profile_photo || undefined,
        origin: room.location_info?.origin || room.ride?.origin_name || 'Unknown Origin',
        destination: room.location_info?.destination || room.ride?.destination_name || 'Unknown Destination',
        lastMessage: room.last_message,
        timestamp: formatTimestamp(room.last_message_at || undefined),
        unreadCount: room.unread_count && room.unread_count > 0 ? room.unread_count : undefined,
        hasUnread: (room.unread_count || 0) > 0,
      };
    });
  }, [chatListResponse]);

  // Filter messages based on search query
  const filteredMessages = useMemo(() => {
    return messages.filter((message: any) =>
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.destination.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [messages, searchQuery]);

  const handleMessagePress = (message: MessageItem) => {
    // Find the original room data to get user info
    const room = chatListResponse?.results?.find((r: ChatRoom) => r.id === message.id);
    const otherUser = room?.other_user;
    const firstName = otherUser?.first_name || '';
    const lastName = otherUser?.last_name || '';
    const fullName = `${firstName} ${lastName}`.trim() || 'Unknown User';
    
    navigation.navigate('ChatDetail', {
      roomId: message.id,
      userName: fullName,
      userAvatar: otherUser?.profile?.profile_photo || undefined,
      origin: message.origin,
      destination: message.destination,
      luggage_request_id: room?.luggage_request_id,
      luggage_request_status: room?.luggage_request_status,
      luggage_request_weight: room?.luggage_request_weight,
      is_ride_created_by_me: room?.is_ride_created_by_me,
    });
  };

  const renderMessageItem = ({ item }: { item: MessageItem }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => handleMessagePress(item)}
    >
      <Card style={styles.messageCard} padding={16}>
        <View style={styles.messageContent}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {item.avatar ? (
              <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                {/* <User size={24} color={Colors.primaryCyan} /> */}
                <SvgXml xml={ProfileUserIcon} height={24} width={24} />
              </View>
            )}
          </View>

          {/* Message Info */}
          <View style={styles.messageInfo}>
            <View style={styles.messageHeader}>
              <Text style={styles.messageName}>{item.name}</Text>
              <Text style={styles.messageTimestamp}>{item.timestamp}</Text>
            </View>
            <Text style={styles.messageRoute}>
              From: {item.origin} to {item.destination}
            </Text>
            {item.lastMessage ? (
              <Text style={styles.messageText} numberOfLines={1}>
                {item.lastMessage}
              </Text>
            ) : (
              <Text style={{fontSize: Fonts.sm, color: Colors.textLight, fontStyle: 'italic' }} numberOfLines={1}>
                start the conversation
              </Text>
            )}
          </View>

          {/* Unread Badge */}
          {item.unreadCount && item.unreadCount > 0 ? (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          ) : null}
        </View>
      </Card>
    </TouchableOpacity>
  );

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Messages" variant="centered" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primaryCyan} />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Messages" variant="centered" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load messages</Text>
          <Text style={styles.errorSubText}>{error?.message || 'Please try again'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show empty state
  const isEmpty = !messages || messages.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header title="Messages" variant="centered" />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchInput
          lucideIcon={Search}
          placeholder="Search"
          value={searchQuery}
          onChangeText={setSearchQuery}
          containerStyle={styles.searchInput}
        />
      </View>

      {/* <View style={{marginTop: 10}}></View> */}

      {/* Messages List or Empty State */}
      {isEmpty ? (
        <View style={styles.emptyContainer}>
          <EmptyStateCard
            icon={MessageCircle}
            title="No Messages"
            description="You don't have any messages yet. Start a conversation by sending a request to a traveler."
          />
        </View>
      ) : (
        <FlatList
          data={filteredMessages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={[Colors.primaryCyan]}
              tintColor={Colors.primaryCyan}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <EmptyStateCard
                icon={Search}
                title="No Results"
                description="No messages match your search."
              />
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: Colors.backgroundGray,
    borderColor: Colors.borderLight,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  messageCard: {
    marginBottom: 12,
    backgroundColor: Colors.backgroundWhite,
    shadowColor: Colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  messageContent: {
    flexDirection: 'row',
    // alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundWhite,
    shadowColor: Colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageInfo: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageName: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightMedium,
    color: Colors.textPrimary,
  },
  messageTimestamp: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
  },
  messageRoute: {
    fontSize: Fonts.xs,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: Fonts.sm,
    color: Colors.textPrimary,
  },
  unreadBadge: {
    width: 18,
    height: 18,
    borderRadius: 12,
    backgroundColor: Colors.primaryCyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginTop: 2,
  },
  unreadCount: {
    fontSize: Fonts.xs,
    fontWeight: Fonts.weightBold,
    color: Colors.textWhite,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primaryCyan,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: Fonts.base,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
  },
});

export default ChatScreen;
