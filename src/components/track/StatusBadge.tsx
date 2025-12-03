import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Bell } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import GradientButton from '../GradientButton';

export type StatusType = 'new' | 'approved' | 'full' | 'completed' | 'pending' | 'active' | 'in_progress' | 'cancelled';

interface StatusBadgeProps {
  status: StatusType;
  style?: ViewStyle;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, style }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'new':
        return {
          label: 'New Request',
          showIcon: true,
        };
      case 'approved':
        return {
          label: 'Approved',
          showIcon: true,
        };
      case 'full':
        return {
          label: 'Full',
          showIcon: false,
          showDot: false,
          dotColor: Colors.primaryCyan,
        };
      case 'completed':
        return {
          label: 'Completed',
          showIcon: false,
          showDot: false,
          dotColor: Colors.primaryTeal,
        };
        case 'cancelled':
        return {
          label: 'Cancelled',
          showIcon: false,
          showDot: false,
          dotColor: Colors.error,
        };
      case 'pending':
        return {
          label: 'Waiting for Approval',
          showIcon: false,
          showDot: false,
          dotColor: Colors.primaryTeal,
        };
        case 'active':
        return {
          label: 'Active',
          showIcon: false,
          showDot: false,
          dotColor: Colors.primaryTeal,
        };
        case 'in_progress':
        return {
          label: 'In Progress',
          showIcon: false,
          showDot: false,
          dotColor: Colors.primaryTeal,
        };
      default:
        return {
          label: '',
          showIcon: false,
          showDot: false,
        };
    }
  };

  const config = getStatusConfig();

  if (config.label === '') {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      {config.showDot && (
        <View style={[styles.dot, { backgroundColor: config.dotColor }]} />
      )}
      {/* <LinearGradient
        colors={[Colors.gradientStart, Colors.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.badge}
      > */}
        {config.showIcon && (
          <Bell size={14} color={Colors.textWhite} style={styles.icon} />
        )}
        <GradientButton
          title={config.label}
          onPress={() => {}}
          style={styles.button}
          textStyle={styles.text}
          
        />
        {/* <Text style={[styles.text, { color: Colors.textWhite }]}>
          {config.label}
        </Text> */}
      {/* </LinearGradient> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  icon: {
    marginRight: 6,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 12,
    marginRight: 8,
  },
  text: {
    fontSize: Fonts.xs,
    fontWeight: Fonts.weightSemiBold,
  },
  button: {
    minWidth: 130,
    justifyContent: 'center',
    height: 21,
    borderRadius: 10,
  },

});

export default StatusBadge;

