import React, { useEffect, useRef, useCallback } from 'react';
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

const getScreenWidth = () => {
  try {
    return Dimensions.get('window').width || 350;
  } catch {
    return 350;
  }
};

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
  const onCloseRef = useRef(onClose);
  const positionRef = useRef(position);

  // Update refs when props change
  useEffect(() => {
    onCloseRef.current = onClose;
    positionRef.current = position;
  }, [onClose, position]);

  const handleClose = useCallback(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: positionRef.current === 'top' ? -100 : 100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onCloseRef.current?.();
    });
  }, [slideAnim, opacityAnim]);

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

    return () => {
      clearTimeout(timer);
    };
  }, [duration, slideAnim, opacityAnim, handleClose]);

  const getToastConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: CheckCircle,
          iconColor: Colors.success || '#4DBAA5',
          borderColor: Colors.success || '#4DBAA5',
        };
      case 'error':
        return {
          icon: XCircle,
          iconColor: Colors.error || '#FF3B30',
          borderColor: Colors.error || '#FF3B30',
        };
      case 'warning':
        return {
          icon: AlertCircle,
          iconColor: Colors.warning || '#FF9500',
          borderColor: Colors.warning || '#FF9500',
        };
      case 'info':
      default:
        return {
          icon: Info,
          iconColor: Colors.primaryCyan || Colors.info || '#307183',
          borderColor: Colors.primaryCyan || Colors.info || '#307183',
        };
    }
  };

  if (!message) {
    return null;
  }

  const config = getToastConfig();
  const Icon = config.icon;

  const containerStyle = {
    transform: [{ translateY: slideAnim }],
    opacity: opacityAnim,
    top: position === 'top' ? 70 : undefined,
    bottom: position === 'bottom' ? 50 : undefined,
  };

  const toastStyle = {
    borderLeftColor: config.borderColor || Colors.primaryCyan,
  };

  return (
    <Animated.View
      style={[styles.container, containerStyle]}
    >
      <View style={[styles.toast, toastStyle]}>
        <Icon size={18} color={config.iconColor || Colors.primaryCyan} style={styles.icon} />
        <Text style={styles.message} numberOfLines={2}>
          {message || ''}
        </Text>
        <TouchableOpacity
          onPress={handleClose}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={14} color={Colors.textTertiary || '#737373'} />
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
    width: getScreenWidth() - 40,
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

