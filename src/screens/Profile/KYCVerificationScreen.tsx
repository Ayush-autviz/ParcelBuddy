import React from 'react';
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
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { Header, GradientButton } from '../../components';
import { ProfileStackParamList } from '../../navigation/ProfileNavigator';

type KYCVerificationScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'KYCVerification'>;

// Document Upload Icon SVG
const DocumentUploadIcon = `
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="24" cy="24" r="23" stroke="url(#paint0_linear_doc)" stroke-width="2"/>
  <path d="M16 20H32M16 24H28M16 28H32" stroke="url(#paint1_linear_doc)" stroke-width="2" stroke-linecap="round"/>
  <path d="M20 12H28C29.1046 12 30 12.8954 30 14V34C30 35.1046 29.1046 36 28 36H20C18.8954 36 18 35.1046 18 34V14C18 12.8954 18.8954 12 20 12Z" stroke="url(#paint2_linear_doc)" stroke-width="2"/>
  <path d="M24 18L24 22M22 20L24 18L26 20" stroke="url(#paint3_linear_doc)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="26" cy="16" r="3" fill="url(#paint4_linear_doc)"/>
  <defs>
    <linearGradient id="paint0_linear_doc" x1="24" y1="0" x2="24" y2="48" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3095CB"/>
      <stop offset="1" stop-color="#4DBAA5"/>
    </linearGradient>
    <linearGradient id="paint1_linear_doc" x1="24" y1="20" x2="24" y2="28" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3095CB"/>
      <stop offset="1" stop-color="#4DBAA5"/>
    </linearGradient>
    <linearGradient id="paint2_linear_doc" x1="24" y1="12" x2="24" y2="36" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3095CB"/>
      <stop offset="1" stop-color="#4DBAA5"/>
    </linearGradient>
    <linearGradient id="paint3_linear_doc" x1="24" y1="18" x2="24" y2="22" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3095CB"/>
      <stop offset="1" stop-color="#4DBAA5"/>
    </linearGradient>
    <linearGradient id="paint4_linear_doc" x1="26" y1="13" x2="26" y2="19" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3095CB"/>
      <stop offset="1" stop-color="#4DBAA5"/>
    </linearGradient>
  </defs>
</svg>
`;

// Live Selfie Icon SVG
const LiveSelfieIcon = `
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="24" cy="24" r="23" stroke="url(#paint0_linear_selfie)" stroke-width="2"/>
  <circle cx="24" cy="20" r="6" stroke="url(#paint1_linear_selfie)" stroke-width="2"/>
  <path d="M14 34C14 28 18 24 24 24C30 24 34 28 34 34" stroke="url(#paint2_linear_selfie)" stroke-width="2" stroke-linecap="round"/>
  <circle cx="20" cy="18" r="1.5" fill="url(#paint3_linear_selfie)"/>
  <circle cx="28" cy="18" r="1.5" fill="url(#paint4_linear_selfie)"/>
  <path d="M22 22C22.5 22.5 23.5 22.5 24 22C24.5 22.5 25.5 22.5 26 22" stroke="url(#paint5_linear_selfie)" stroke-width="2" stroke-linecap="round"/>
  <defs>
    <linearGradient id="paint0_linear_selfie" x1="24" y1="0" x2="24" y2="48" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3095CB"/>
      <stop offset="1" stop-color="#4DBAA5"/>
    </linearGradient>
    <linearGradient id="paint1_linear_selfie" x1="24" y1="14" x2="24" y2="26" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3095CB"/>
      <stop offset="1" stop-color="#4DBAA5"/>
    </linearGradient>
    <linearGradient id="paint2_linear_selfie" x1="24" y1="24" x2="24" y2="34" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3095CB"/>
      <stop offset="1" stop-color="#4DBAA5"/>
    </linearGradient>
    <linearGradient id="paint3_linear_selfie" x1="20" y1="16.5" x2="20" y2="19.5" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3095CB"/>
      <stop offset="1" stop-color="#4DBAA5"/>
    </linearGradient>
    <linearGradient id="paint4_linear_selfie" x1="28" y1="16.5" x2="28" y2="19.5" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3095CB"/>
      <stop offset="1" stop-color="#4DBAA5"/>
    </linearGradient>
    <linearGradient id="paint5_linear_selfie" x1="24" y1="22" x2="24" y2="22" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3095CB"/>
      <stop offset="1" stop-color="#4DBAA5"/>
    </linearGradient>
  </defs>
</svg>
`;

const KYCVerificationScreen: React.FC = () => {
  const navigation = useNavigation<KYCVerificationScreenNavigationProp>();

  const handleContinue = () => {
    // TODO: Navigate to document upload screen
    console.log('Continue to KYC verification');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="KYC Verification" showBackButton />

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
              <SvgXml xml={DocumentUploadIcon} width={64} height={64} />
            </View>
            <Text style={styles.stepTitle}>Step 1: Document Upload</Text>
            <Text style={styles.stepDescription}>
              Upload a valid government-issued ID (e.g., passport, driver's licence).
            </Text>
          </View>

          {/* Step 2: Live Selfie */}
          <View style={styles.stepCard}>
            <View style={styles.iconContainer}>
              <SvgXml xml={LiveSelfieIcon} width={64} height={64} />
            </View>
            <Text style={styles.stepTitle}>Step 2: Live Selfie</Text>
            <Text style={styles.stepDescription}>
              Take a live selfie to confirm your identity. Our system uses liveness detection to prevent fraud.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <GradientButton
          title="Continue"
          onPress={handleContinue}
          style={styles.continueButton}
        />
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
    paddingBottom: 100,
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: Fonts.xxl,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  stepsContainer: {
    gap: 24,
  },
  stepCard: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: Fonts.lg,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 12,
    backgroundColor: Colors.backgroundLight,
  },
  continueButton: {
    marginTop: 0,
  },
});

export default KYCVerificationScreen;

