import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';
import { SvgXml } from 'react-native-svg';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { OtpInput } from 'react-native-otp-entry';
import { ArrowLeft, Phone } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import GradientButton from '../../components/GradientButton';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  Auth: undefined;
  OTPScreen: {
    phoneNumber: string;
  };
  MainApp: undefined;
};

type OTPScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OTPScreen'>;

// OTP Illustration SVG
const OtpIllustration = `
<svg width="181" height="174" viewBox="0 0 181 174" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_402_217)">
<path d="M53.5797 40.6253C46.8611 65.4786 29.3704 79.0647 26.132 91.0428C22.8937 103.021 22.9793 130.033 78.0756 144.929C133.172 159.826 150.406 128.176 153.964 114.999C170.644 53.3143 65.4796 -3.39371 53.5797 40.6253Z" fill="white"/>
</g>
<path d="M94.7922 45.0399C91.7028 45.0399 89.2089 47.5338 89.2089 50.6233C89.2089 52.6705 87.5339 54.3455 85.4866 54.3455H68.7366C66.6894 54.3455 65.0144 52.6705 65.0144 50.6233C65.0144 47.5338 62.5205 45.0399 59.4311 45.0399H94.7922Z" fill="#3095CB"/>
<path d="M104.098 52.3355V121.494C104.098 125.514 100.859 128.79 96.9138 128.79H57.3094C53.3638 128.79 50.1255 125.514 50.1255 121.494V52.3355C50.1255 48.3155 53.3638 45.0399 57.3094 45.0399H59.431C62.5205 45.0399 65.0144 47.5338 65.0144 50.6233C65.0144 52.6705 66.6894 54.3455 68.7366 54.3455H85.4866C87.5338 54.3455 89.2088 52.6705 89.2088 50.6233C89.2088 47.5338 91.7027 45.0399 94.7922 45.0399H96.9138C100.859 45.0399 104.098 48.3155 104.098 52.3355Z" fill="#F3F3F1"/>
<path d="M133.875 77.9443V99.0121C133.875 101.059 132.2 102.734 130.153 102.734H91.0699C89.0227 102.734 87.3477 101.059 87.3477 99.0121V77.9443L108.043 88.7388C109.644 89.5577 111.579 89.5577 113.18 88.7388L133.875 77.9443Z" fill="#4BBBA5"/>
<path d="M133.875 74.8177V77.9443L113.18 88.7388C111.579 89.5577 109.644 89.5577 108.043 88.7388L87.3477 77.9443V74.8177C87.3477 72.7705 89.0227 71.0955 91.0699 71.0955H130.153C132.2 71.0955 133.875 72.7705 133.875 74.8177Z" fill="#4BBBA5"/>
</svg>
`;

const OTPScreen: React.FC = () => {
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const route = useRoute();
  const { login } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(150); // 2 minutes 30 seconds in seconds
  const phoneNumber = (route.params as { phoneNumber?: string })?.phoneNumber || '+1 (555) 123-4567';

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual OTP verification API call
      console.log('Verifying OTP:', otp);

      // Simulate API call
      await new Promise<void>((resolve) => setTimeout(resolve, 2000));

      Alert.alert('Success', 'OTP verified successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to main app
            login('user@parcelbuddy.com', 'password');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      // TODO: Implement actual OTP resend API call
      console.log('Resending OTP to:', phoneNumber);

      // Simulate API call
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));

      // Reset timer to 2:30
      setTimer(150);
      Alert.alert('Success', 'OTP resent successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundLight} />
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Verification</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <SvgXml xml={OtpIllustration} width={181} height={174} />
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle}>
            We sent a 6-digit code to your mobile number.
          </Text>

          {/* Phone Number Display */}
          <View style={styles.phoneDisplayContainer}>
            <Phone size={20} color={Colors.primaryTeal} />
            <Text style={styles.phoneNumberText}>{phoneNumber}</Text>
          </View>

          {/* OTP Input Label */}
          <Text style={styles.otpLabel}>Enter 6-digit code</Text>

          {/* OTP Entry */}
          <OtpInput
            numberOfDigits={6}
            onTextChange={(text) => setOtp(text)}
            focusColor={Colors.primaryTeal}
            theme={{
              containerStyle: styles.otpContainer,
              pinCodeContainerStyle: styles.otpBox,
              pinCodeTextStyle: styles.otpText,
              focusedPinCodeContainerStyle: styles.otpBoxFocused,
            }}
          />

          {/* Verify Button */}
          <GradientButton
            title="Verify & Continue"
            onPress={handleVerify}
            loading={loading}
            style={styles.verifyButton}
          />

          {/* Resend Section */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code?</Text>
            <TouchableOpacity onPress={handleResendOTP} disabled={timer > 0}>
              <Text style={[styles.resendLink, timer > 0 && styles.resendLinkDisabled]}>
              Resend OTP
              </Text>
            </TouchableOpacity>
          </View>

          {/* Timer */}
          {timer > 0 && (
            <Text style={styles.timerText}>Code expires in {formatTime(timer)}</Text>
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
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
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.backgroundLight,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: Fonts.xl,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  illustrationContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: Colors.backgroundLight,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.backgroundWhite,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: Fonts.xxxl,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    marginBottom: 24,
    lineHeight: 24,
  },
  phoneDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.backgroundGray,
    marginBottom: 32,
  },
  phoneNumberText: {
    fontSize: Fonts.base,
    color: Colors.textPrimary,
    marginLeft: 12,
    fontWeight: Fonts.weightMedium,
  },
  otpLabel: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  otpContainer: {
    marginBottom: 32,
  },
  otpBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.backgroundWhite,
  },
  otpBoxFocused: {
    borderColor: Colors.primaryTeal,
    borderWidth: 2,
  },
  otpText: {
    fontSize: Fonts.xl,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
  },
  verifyButton: {
    marginBottom: 24,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  resendText: {
    fontSize: Fonts.sm,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  resendLink: {
    fontSize: Fonts.sm,
    color: Colors.primaryTeal,
    textDecorationLine: 'underline',
    fontWeight: Fonts.weightSemiBold,
  },
  resendLinkDisabled: {
    color: Colors.textLight,
    textDecorationLine: 'none',
  },
  timerText: {
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default OTPScreen;

