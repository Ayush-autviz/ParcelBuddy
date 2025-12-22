import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { OtpInput } from 'react-native-otp-entry';
import { ArrowLeft, Mail } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import GradientButton from '../../components/GradientButton';
import { useVerifyResetOtp, useResendOtpEmail } from '../../hooks/useAuthMutations';
import { useToast } from '../../components/Toast';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

const { width, height } = Dimensions.get('window');

type VerifyResetOtpScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'VerifyResetOtp'>;

const VerifyResetOtpScreen: React.FC = () => {
  const navigation = useNavigation<VerifyResetOtpScreenNavigationProp>();
  const route = useRoute();
  const email = (route.params as { email?: string })?.email || '';
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  
  const verifyOtpMutation = useVerifyResetOtp();
  const resendOtpMutation = useResendOtpEmail();
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerify = () => {
    if (!otp || otp.length !== 6) {
      showError('Please enter a valid 6-digit OTP');
      return;
    }

    verifyOtpMutation.mutate(
      { email: email.trim(), otp: otp.trim() },
      {
        onSuccess: (response: any) => {
          console.log('Verify Reset OTP Response:', response);
          showSuccess('OTP verified successfully');
          navigation.navigate('ResetPassword', { email: email.trim(), otp: otp.trim() });
        },
        onError: (error: any) => {
          console.log('Verify Reset OTP Error:', error);
          const errorMessage = 
            error?.response?.data?.message || 
            error?.response?.data?.error || 
            error?.response?.data?.detail ||
            error?.message || 
            'Invalid OTP. Please try again.';
          showError(errorMessage);
        },
      }
    );
  };

  const handleResendOTP = () => {
    console.log('Resending OTP to:', email);

    resendOtpMutation.mutate(
      { email: email.trim() },
      {
        onSuccess: () => {
          setTimer(60);
          showSuccess('OTP resent successfully!');
        },
        onError: (error: any) => {
          console.log('Error resending OTP:', error);
          const errorMessage = 
            error?.response?.data?.message || 
            error?.response?.data?.error || 
            error?.response?.data?.detail ||
            error?.message || 
            'Failed to resend OTP. Please try again.';
          showError(errorMessage);
        },
      }
    );
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header Section */}
      <View style={styles.header}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/Logo.png')} style={styles.logo} />
        </View>
        
        {/* App Name */}
        <Text style={styles.appName}>ParcelBuddy</Text>
        
        {/* Tagline */}
        <Text style={styles.tagline}>
          Your bag's extra space, someone's{'\n'}perfect place.
        </Text>
      </View>

      {/* White Card Section */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={Colors.textPrimary} />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.cardTitle}>Verify OTP</Text>
          <View style={styles.backButton} />
        </View>

        {/* Description */}
        <Text style={styles.description}>
          Enter the 6-digit OTP sent to{'\n'}
          <Text style={styles.emailText}>{email}</Text>
        </Text>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          <OtpInput
            numberOfDigits={6}
            onTextChange={(text) => setOtp(text)}
            focusColor={Colors.primaryCyan}
            theme={{
              containerStyle: styles.otpInputContainer,
              pinCodeContainerStyle: styles.otpPinContainer,
              pinCodeTextStyle: styles.otpPinText,
            }}
          />
        </View>

        {/* Timer and Resend */}
        <View style={styles.resendContainer}>
          {timer > 0 ? (
            <Text style={styles.timerText}>
              Resend OTP in {formatTime(timer)}
            </Text>
          ) : (
            <TouchableOpacity
              onPress={handleResendOTP}
              disabled={resendOtpMutation.isPending}
              activeOpacity={0.7}
            >
              <Text style={styles.resendText}>
                {resendOtpMutation.isPending ? 'Resending...' : 'Resend OTP'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Verify Button */}
        <GradientButton
          title={verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
          onPress={handleVerify}
          loading={verifyOtpMutation.isPending}
          style={styles.verifyButton}
          disabled={verifyOtpMutation.isPending || otp.length !== 6}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 100,
    paddingBottom: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  appName: {
    fontSize: Fonts.xxl,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  tagline: {
    fontSize: Fonts.sm,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.backgroundWhite,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
    minHeight: height * 0.6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: Fonts.xl,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  description: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  emailText: {
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
  },
  otpContainer: {
    marginBottom: 24,
  },
  otpInputContainer: {
    width: '100%',
  },
  otpPinContainer: {
    width: 50,
    height: 55,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    backgroundColor: Colors.backgroundGray,
  },
  otpPinText: {
    fontSize: Fonts.xl,
    color: Colors.textPrimary,
    fontWeight: Fonts.weightBold,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
  },
  resendText: {
    fontSize: Fonts.sm,
    color: Colors.primaryCyan,
    fontWeight: Fonts.weightMedium,
  },
  verifyButton: {
    marginBottom: 24,
  },
  logo: {
    width: 130,
    height: 140,
  },
});

export default VerifyResetOtpScreen;



