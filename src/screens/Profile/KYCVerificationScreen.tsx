import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { CheckCircle, Check, Shield } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { ProfileHeader, GradientButton } from '../../components';
import { ProfileStackParamList } from '../../navigation/ProfileNavigator';
import { kycVerification } from '../../services/api/kyc';
import { useToast } from '../../components/Toast';
import { DocumentIcon, SmileyIcon } from '../../assets/icons/svg/main';
import { useAuthStore } from '../../services/store';
import { fetchAndUpdateProfile } from '../../utils/profileUtils';

type KYCVerificationScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'KYCVerification'>;


const KYCVerificationScreen: React.FC = () => {
  const navigation = useNavigation<KYCVerificationScreenNavigationProp>();
  const { showError, showSuccess } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();
  
  // Fetch and update profile when screen comes into focus to get latest KYC status
  useFocusEffect(
    useCallback(() => {
      fetchAndUpdateProfile();
    }, [])
  );
  
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

        {/* Approved Success Card */}
        {isKYCApproved ? (
          <View style={styles.successCard}>
            <View style={styles.successGradient}>
              <View style={styles.successContent}>
                <View style={styles.bigCheckmarkContainer}>
                  <LinearGradient
                    colors={[Colors.gradientStart, Colors.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.bigCheckmarkCircle}
                  >
                    <Check size={56} color={Colors.backgroundWhite} strokeWidth={4} />
                  </LinearGradient>
                </View>
                <Text style={styles.successTitle}>Verification Completed!</Text>
                <Text style={styles.successDescription}>
                  Your identity has been successfully verified.
                </Text>
                 
              </View>
            </View>
          </View>
        ) : (
          <>
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
          </>
        )}
      </ScrollView>

      {/* Continue Button */}
      {!isKYCApproved && (
        <View style={styles.buttonContainer}>
          <GradientButton
            title={isLoading ? 'Loading...' : 'Continue'}
            onPress={handleContinue}
            style={styles.continueButton}
            disabled={isLoading}
            loading={isLoading}
          />
        </View>
      )}
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
  successCard: {
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  successGradient: {
    borderRadius: 16,
  },
  successContent: {
    padding: 32,
    alignItems: 'center',
  },
  bigCheckmarkContainer: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigCheckmarkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.textPrimary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  successTitle: {
    fontSize: Fonts.xxl,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: 'center',
  },
  successDescription: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  successFeatures: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  successFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  successFeatureText: {
    fontSize: Fonts.base,
    color: Colors.textWhite,
    fontWeight: Fonts.weightMedium,
  },
});

export default KYCVerificationScreen;

