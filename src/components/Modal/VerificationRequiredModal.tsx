import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { Shield, Crown, Check } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import GradientButton from '../GradientButton';

interface VerificationRequiredModalProps {
  visible: boolean;
  needsKYC: boolean;
  needsSubscription: boolean;
  onContinue: () => void;
  onClose?: () => void;
}

const VerificationRequiredModal: React.FC<VerificationRequiredModalProps> = ({
  visible,
  needsKYC,
  needsSubscription,
  onContinue,
  onClose,
}) => {
  const getTitle = () => {
    if (needsKYC && needsSubscription) {
      return 'Verification Required';
    } else if (needsKYC) {
      return 'KYC Verification Required';
    } else {
      return 'Subscription Required';
    }
  };

  const getDescription = () => {
    if (needsKYC && needsSubscription) {
      return 'To proceed, you need to complete KYC verification and subscribe to a plan.';
    } else if (needsKYC) {
      return 'Please complete your KYC verification to proceed. This helps us ensure the safety and security of our platform.';
    } else {
      return 'Please subscribe to a plan to proceed. Choose from our flexible subscription plans to unlock all features.';
    }
  };

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
              {/* Requirements List */}
              <View style={styles.requirementsContainer}>
                {needsKYC && (
                  <View style={styles.requirementItem}>
                    <View style={styles.requirementIconContainer}>
                      <Shield size={24} color={Colors.primaryCyan} />
                    </View>
                    <View style={styles.requirementTextContainer}>
                      <Text style={styles.requirementTitle}>KYC Verification</Text>
                      <Text style={styles.requirementDescription}>
                        Verify your identity to ensure platform safety
                      </Text>
                    </View>
                  </View>
                )}
                
                {needsSubscription && (
                  <View style={styles.requirementItem}>
                    <View style={styles.requirementIconContainer}>
                      <Crown size={24} color={Colors.primaryCyan} />
                    </View>
                    <View style={styles.requirementTextContainer}>
                      <Text style={styles.requirementTitle}>Subscription</Text>
                      <Text style={styles.requirementDescription}>
                        Subscribe to a plan to unlock all features
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Title */}
              <Text style={styles.title}>{getTitle()}</Text>

              {/* Description */}
              <Text style={styles.description}>{getDescription()}</Text>

              {/* Continue Button */}
              <GradientButton
                title="Continue"
                onPress={onContinue}
                style={styles.buttonContainer}
                textStyle={styles.buttonText}
              />
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
  requirementsContainer: {
    width: '100%',
    marginBottom: 20,
    gap: 16,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  requirementIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryCyan + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requirementTextContainer: {
    flex: 1,
  },
  requirementTitle: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  requirementDescription: {
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
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
  buttonText: {
    color: Colors.textWhite,
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightBold,
  },
});

export default VerificationRequiredModal;

