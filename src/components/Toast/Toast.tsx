import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

const { width } = Dimensions.get('window');

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  position?: 'top' | 'bottom';
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  position = 'top',
}) => {
  const slideAnim = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: position === 'top' ? -100 : 100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose?.();
    });
  };

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: Colors.success,
          borderColor: Colors.success,
        };
      case 'error':
        return {
          icon: XCircle,
          iconColor: Colors.error,
          borderColor: Colors.error,
        };
      case 'warning':
        return {
          icon: AlertCircle,
          iconColor: Colors.warning,
          borderColor: Colors.warning,
        };
      case 'info':
      default:
        return {
          icon: Info,
          iconColor: Colors.primaryCyan,
          borderColor: Colors.primaryCyan,
        };
    }
  };

  const config = getToastConfig();
  const Icon = config.icon;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
          top: position === 'top' ? 70 : undefined,
          bottom: position === 'bottom' ? 50 : undefined,
        },
      ]}
    >
      <View style={[styles.toast, { borderLeftColor: config.borderColor }]}>
        <Icon size={18} color={config.iconColor} style={styles.icon} />
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={14} color={Colors.textTertiary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 8,
    padding: 16,
    paddingLeft: 16,
    width: width - 40,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    marginRight: 10,
  },
  message: {
    flex: 1,
    fontSize: Fonts.sm,
    color: Colors.textPrimary,
    fontWeight: Fonts.weightRegular,
  },
  closeButton: {
    marginLeft: 8,
    padding: 2,
  },
});

export default Toast;

