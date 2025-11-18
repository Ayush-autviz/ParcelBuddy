import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { User, ChevronRight } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import Card from '../Card';

export interface LuggageRequestItemData {
  id: string;
  senderName: string;
  itemCount: number;
  status?: string;
  senderProfilePhoto?: string | null;
}

interface LuggageRequestItemProps {
  request: LuggageRequestItemData;
  onPress?: () => void;
  style?: ViewStyle;
}

const LuggageRequestItem: React.FC<LuggageRequestItemProps> = ({
  request,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={style}
    >
      <Card style={styles.card} padding={16}>
        <View style={styles.content}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={20} color={Colors.primaryCyan} />
            </View>
          </View>

          {/* Name and Items */}
          <View style={styles.textContainer}>
            <View style={styles.nameRow}>
              <Text style={styles.senderName}>{request.senderName}</Text>
              {request.status === 'cancelled' && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Cancelled</Text>
                </View>
              )}
            </View>
            {/* <Text style={styles.itemCount}>
              {request.itemCount} {request.itemCount === 1 ? 'item' : 'items'}
            </Text> */}
          </View>

          {/* Arrow Icon */}
          <ChevronRight size={20} color={Colors.textTertiary} />
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryTeal + '20', // Light blue background with opacity
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  senderName: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 4,
    marginRight: 8,
  },
  badge: {
    backgroundColor: '#FF3B30' + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: Fonts.xs,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    textTransform: 'uppercase',
  },
  itemCount: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
  },
});

export default LuggageRequestItem;

