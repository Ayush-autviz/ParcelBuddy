import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SvgXml } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';

// Diamond/Gem Icon SVG (similar to subscription modal)
const DiamondIcon = `
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M24 6L30 18H18L24 6Z" fill="url(#paint0_linear_diamond)"/>
  <path d="M6 20L18 18L24 42L6 20Z" fill="url(#paint1_linear_diamond)"/>
  <path d="M42 20L30 18L24 42L42 20Z" fill="url(#paint2_linear_diamond)"/>
  <path d="M18 18L24 6L30 18H18Z" fill="url(#paint3_linear_diamond)"/>
  <defs>
    <linearGradient id="paint0_linear_diamond" x1="24" y1="6" x2="24" y2="18" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3095CB"/>
      <stop offset="1" stop-color="#4DBAA5"/>
    </linearGradient>
    <linearGradient id="paint1_linear_diamond" x1="15" y1="18" x2="15" y2="42" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3095CB"/>
      <stop offset="1" stop-color="#4DBAA5"/>
    </linearGradient>
    <linearGradient id="paint2_linear_diamond" x1="33" y1="18" x2="33" y2="42" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3095CB"/>
      <stop offset="1" stop-color="#4DBAA5"/>
    </linearGradient>
    <linearGradient id="paint3_linear_diamond" x1="24" y1="6" x2="24" y2="18" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3095CB"/>
      <stop offset="1" stop-color="#4DBAA5"/>
    </linearGradient>
  </defs>
</svg>
`;

interface KYCVerificationModalProps {
  visible: boolean;
  title: string;
  description: string;
  buttonText: string;
  onButtonPress: () => void;
  onClose?: () => void;
  icon?: string; // Optional custom SVG icon
  loading?: boolean;
}

const KYCVerificationModal: React.FC<KYCVerificationModalProps> = ({
  visible,
  title,
  description,
  buttonText,
  onButtonPress,
  onClose,
  icon,
  loading = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* Icon Container */}
              <View style={styles.iconContainer}>
                <View style={styles.iconCircle}>
                  <SvgXml xml={icon || DiamondIcon} width={48} height={48} />
                </View>
              </View>

              {/* Title */}
              <Text style={styles.title}>{title}</Text>

              {/* Description */}
              <Text style={styles.description}>{description}</Text>

              {/* Gradient Button */}
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={onButtonPress}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[Colors.gradientStart, Colors.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>
                    {loading ? 'Loading...' : buttonText}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: Colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.backgroundWhite,
    borderWidth: 2,
    borderColor: '#E0F4F0', // Light teal border
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: Fonts.xxl,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.textWhite,
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightBold,
  },
});

export default KYCVerificationModal;

