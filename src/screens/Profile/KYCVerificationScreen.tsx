import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { CheckCircle, Check } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { ProfileHeader, GradientButton } from '../../components';
import { ProfileStackParamList } from '../../navigation/ProfileNavigator';
import { kycVerification } from '../../services/api/kyc';
import { useToast } from '../../components/Toast';
import { DocumentIcon, SmileyIcon } from '../../assets/icons/svg/main';
import { useAuthStore } from '../../services/store';

type KYCVerificationScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'KYCVerification'>;


const KYCVerificationScreen: React.FC = () => {
  const navigation = useNavigation<KYCVerificationScreenNavigationProp>();
  const { showError, showSuccess } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();
  
  const isKYCApproved = user?.kyc_status === 'Approved';

  const handleContinue = async () => {
    try {
      setIsLoading(true);
      const response = await kycVerification();
      
      if (response && response.url) {
        // Navigate to WebView screen with the verification URL
        navigation.navigate('KYCWebView', {
          url: response.url,
        });
      } else {
        showError('Failed to get verification URL. Please try again.');
      }
    } catch (error: any) {
      console.error('KYC verification error:', error);
      showError(error?.response?.data?.message || error?.message || 'Failed to start verification. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader title="KYC Verification" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Verify Your Identity</Text>
          <Text style={styles.description}>
            For the community's safety, we need to quickly confirm you are who you say you are.
          </Text>
        </View>

        {/* Verification Steps */}
        <View style={styles.stepsContainer}>
          {/* Step 1: Document Upload */}
          <View style={styles.stepCard}>
            <View style={styles.iconContainer}>
              <SvgXml xml={DocumentIcon} width={32} height={32} />
            </View>
            <View> 
            <Text style={styles.stepTitle}>Step 1: Document Upload</Text>
            <Text style={styles.stepDescription}>
              Upload a valid government-issued ID (e.g., passport, driver's licence).
            </Text>
            </View>
          </View>

          {/* Step 2: Live Selfie */}
          <View style={styles.stepCard}>
            <View style={styles.iconContainer}>
              <SvgXml xml={SmileyIcon} width={32} height={32} />
            </View>
            <View> 
            <Text style={styles.stepTitle}>Step 2: Live Selfie</Text>
            <Text style={styles.stepDescription}>
              Take a live selfie to confirm your identity. Our system uses liveness detection to prevent fraud.
            </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button or Approved Status */}
      <View style={styles.buttonContainer}>
        {isKYCApproved ? (
          <View style={styles.approvedContainer}>
            <View style={styles.checkIconContainer}>
              <Check size={20} color={Colors.backgroundWhite} strokeWidth={3} />
            </View>
            <Text style={styles.approvedText}>KYC Verification Approved</Text>
          </View>
        ) : (
          <GradientButton
            title={isLoading ? 'Loading...' : 'Continue'}
            onPress={handleContinue}
            style={styles.continueButton}
            disabled={isLoading}
            loading={isLoading}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  titleSection: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: Fonts.xxl,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  stepsContainer: {
    gap: 24,
  },
  stepCard: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconContainer: {
    // marginBottom: 16,
    shadowColor: Colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderRadius: 100,
    padding: 12,
    backgroundColor: Colors.backgroundWhite,
  },
  stepTitle: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    paddingHorizontal: 8
  },
  stepDescription: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
    paddingHorizontal: 8,
    maxWidth: '90%',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 12,
    backgroundColor: Colors.backgroundLight,
  },
  continueButton: {
    marginTop: 0,
  },
  approvedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  checkIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryTeal,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  approvedText: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.primaryTeal,
    marginTop: 16,
  },
});

export default KYCVerificationScreen;

