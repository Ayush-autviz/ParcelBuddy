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
  sender?: any;
}

interface LuggageRequestItemProps {
  request: LuggageRequestItemData;
  onPress?: () => void;
  onSenderPress?: () => void;
  style?: ViewStyle;
}

const LuggageRequestItem: React.FC<LuggageRequestItemProps> = ({
  request,
  onPress,
  onSenderPress,
  style,
}) => {
  const getStatusBadgeStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { backgroundColor: Colors.warning + '20', borderColor: Colors.warning };
      case 'approved':
        return { backgroundColor: Colors.primaryTeal + '20', borderColor: Colors.primaryTeal };
      case 'cancelled':
        return { backgroundColor: '#FF3B30' + '20', borderColor: '#FF3B30' };
      default:
        return { backgroundColor: Colors.borderLight, borderColor: Colors.borderLight };
    }
  };

  const getStatusBadgeTextStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { color: Colors.warning || '#FF9500' };
      case 'approved':
        return { color: Colors.primaryTeal };
      case 'cancelled':
        return { color: '#FF3B30' };
      default:
        return { color: Colors.textSecondary };
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={style}
    >
      <Card style={styles.card} padding={16}>
        <View style={styles.content}>
          {/* Avatar - Clickable for sender detail */}
          <TouchableOpacity
            onPress={onSenderPress}
            activeOpacity={0.7}
            disabled={!onSenderPress}
            style={styles.avatarContainer}
          >
            <View style={styles.avatar}>
              <User size={20} color={Colors.primaryCyan} />
            </View>
          </TouchableOpacity>

          {/* Name and Items - Clickable for sender detail */}
          <TouchableOpacity
            onPress={onSenderPress}
            activeOpacity={0.7}
            disabled={!onSenderPress}
            style={styles.textContainer}
          >
            <View style={styles.nameRow}>
              <Text style={styles.senderName}>{request.senderName}</Text>
            </View>
            {/* <Text style={styles.itemCount}>
              {request.itemCount} {request.itemCount === 1 ? 'item' : 'items'}
            </Text> */}
          </TouchableOpacity>

          {/* Status Badge */}
          {request.status && (
            <View style={[styles.statusBadge, getStatusBadgeStyle(request.status)]}>
              <Text style={[styles.statusBadgeText, getStatusBadgeTextStyle(request.status)]}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Text>
            </View>
          )}

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
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 12,
    alignSelf: 'center',
  },
  statusBadgeText: {
    fontSize: Fonts.xs,
    fontWeight: Fonts.weightSemiBold,
    textTransform: 'capitalize',
  },
  itemCount: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
  },
});

export default LuggageRequestItem;

