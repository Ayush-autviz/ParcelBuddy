import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Bell } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import GradientButton from '../GradientButton';

export type StatusType = 'new' | 'approved' | 'full' | 'completed' | 'pending' | 'active' | 'in_progress' | 'cancelled' | 'rejected';

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
      case 'rejected':
        return {
          label: 'Rejected',
          showIcon: false,
          showDot: false,
          dotColor: Colors.error,
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

  if (config.label === 'Approved' || config.label === 'Completed') {
    return (
      <View style={[styles.container, style]}>

        <GradientButton
          title={config.label}
          onPress={() => { }}
          style={styles.button}
          textStyle={styles.text}

        />
      </View>
    );
  }

  else {
    return (
      <View style={[styles.outlineContainer, style, config.label === 'Rejected' && { borderColor: Colors.error }]}>
        <Text style={[styles.text, { color: config.label === 'Rejected' ? Colors.error : Colors.primaryCyan }]}>
          {config.label}
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  outlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.primaryTeal,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
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

