import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, User } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, Card, SearchInput } from '../../components';

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

// Mock data - replace with actual API data
const mockMessages: MessageItem[] = [
  {
    id: '1',
    name: 'Liam Carter',
    origin: 'New York, NY',
    destination: 'Los Angeles, CA',
    lastMessage: 'Hey, just checking in on the delivery...',
    timestamp: '10m',
    unreadCount: 2,
  },
  {
    id: '2',
    name: 'Sophia Bennete',
    origin: 'Chicago, IL',
    destination: 'Miami, FL',
    lastMessage: 'Perfect, thanks for the update!',
    timestamp: '2h',
    hasUnread: true,
  },
  {
    id: '3',
    name: 'Ethan Harper',
    origin: 'San Fransisco, CA',
    destination: 'Seattle, WA',
    lastMessage: 'You: Sounds good, I\'ll let you know.',
    timestamp: '1d',
  },
  {
    id: '4',
    name: 'Olivia Reed',
    origin: 'Boston, MA',
    destination: 'Austin, TX',
    lastMessage: 'Got it, Thanks!',
    timestamp: '2d',
  },
];

const ChatScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [messages] = useState<MessageItem[]>(mockMessages);

  // Filter messages based on search query
  const filteredMessages = messages.filter((message) =>
    message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMessagePress = (message: MessageItem) => {
    // TODO: Navigate to chat detail screen
    console.log('Open chat with:', message.name);
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
                <User size={24} color={Colors.primaryCyan} />
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
            <Text style={styles.messageText} numberOfLines={1}>
              {item.lastMessage}
            </Text>
          </View>

          {/* Unread Badge */}
          {item.unreadCount && item.unreadCount > 0 ? (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          ) : item.hasUnread ? (
            <View style={styles.unreadDot} />
          ) : null}
        </View>
      </Card>
    </TouchableOpacity>
  );

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

      {/* Messages List */}
      <FlatList
        data={filteredMessages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
    alignItems: 'center',
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
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primaryCyan + '20',
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
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
  },
  messageTimestamp: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
  },
  messageRoute: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: Fonts.base,
    color: Colors.textPrimary,
  },
  unreadBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryCyan,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
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
});

export default ChatScreen;
