import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ticket } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import GradientButton from '../GradientButton';
import { ProfilePromoIcon } from '../../assets/icons/svg/profileIcon'
import { SvgXml } from 'react-native-svg';


interface PromoModalProps {
  visible: boolean;
  onDismiss: (shouldNavigate: boolean) => void;
}

const PromoModal: React.FC<PromoModalProps> = ({ visible, onDismiss }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => onDismiss(false)}
    >
      <TouchableWithoutFeedback onPress={() => onDismiss(false)}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>

              {/* Title */}
              <View style={styles.iconContainer}>
                <SvgXml xml={ProfilePromoIcon} width={45} height={45} />
                <Text style={styles.title}>Welcome!</Text>
              </View>

              {/* Description */}
              <Text style={styles.message}>
                Share your promo code and earn 20% commission whenever someone creates an account using your referral code.
              </Text>

              {/* Clean Minimalist Promo Code Box */}
              {/* <View style={styles.promoCodeContainer}>
                <Text style={styles.promoCodeText}>BUDDYNEW50</Text>
              </View> */}

              {/* Action Button */}
              <GradientButton
                title="View My Promo Codes"
                onPress={() => onDismiss(true)}
                style={styles.actionButton}
              />

              {/* Text Dismiss Button */}
              <TouchableOpacity
                onPress={() => onDismiss(false)}
                activeOpacity={0.7}
                style={styles.dismissButton}
              >
                <Text style={styles.dismissButtonText}>Maybe Later</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  modalContainer: {
    backgroundColor: Colors.backgroundWhite,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 20,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  promoCodeContainer: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  promoCodeText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.textPrimary,
    letterSpacing: 1.5,
  },
  actionButton: {
    width: '100%',
    borderRadius: 10,
    marginBottom: 8,
  },
  dismissButton: {
    paddingVertical: 8,
    width: '100%',
    alignItems: 'center',
  },
  dismissButtonText: {
    fontSize: 14,
    fontFamily: Fonts.medium,
    color: Colors.textLight,
  },
});

export default PromoModal;
