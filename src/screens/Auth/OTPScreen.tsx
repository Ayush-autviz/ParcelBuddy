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
import { Phone } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import GradientButton from '../../components/GradientButton';
import { Header } from '../../components';
import { useVerifyOtp, useGetOtp } from '../../hooks/useAuthMutations';
import { useAuthStore } from '../../services/store';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  Auth: undefined;
  OTPScreen: {
    phoneNumber: string;
  };
  ProfileSetup: undefined;
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
<path d="M58.5005 121.494V52.3355C58.5005 49.5326 60.0936 47.1206 62.3828 45.8998C61.4995 45.3407 60.4763 45.0426 59.431 45.0399H57.3094C53.3638 45.0399 50.1255 48.3155 50.1255 52.3355V121.494C50.1255 125.514 53.3638 128.79 57.3094 128.79H65.6844C61.7388 128.79 58.5005 125.514 58.5005 121.494ZM97.5838 50.6233C97.5838 48.6207 98.6372 46.8824 100.215 45.8998C99.2033 45.3437 98.0686 45.0482 96.9138 45.0399H94.7922C91.7027 45.0399 89.2088 47.5338 89.2088 50.6233C89.2088 52.6705 87.5338 54.3455 85.4866 54.3455H93.8616C95.9088 54.3455 97.5838 52.6705 97.5838 50.6233Z" fill="#D5DBE1"/>
<path d="M133.875 77.9443V99.0121C133.875 101.059 132.2 102.734 130.153 102.734H91.0699C89.0227 102.734 87.3477 101.059 87.3477 99.0121V77.9443L108.043 88.7388C109.644 89.5577 111.579 89.5577 113.18 88.7388L133.875 77.9443Z" fill="#4BBBA5"/>
<path d="M133.875 74.8177V77.9443L113.18 88.7388C111.579 89.5577 109.644 89.5577 108.043 88.7388L87.3477 77.9443V74.8177C87.3477 72.7705 89.0227 71.0955 91.0699 71.0955H130.153C132.2 71.0955 133.875 72.7705 133.875 74.8177Z" fill="#4BBBA5"/>
<path d="M95.7227 99.0121V82.3142L87.3477 77.9443V99.0121C87.3477 101.059 89.0227 102.734 91.0699 102.734H99.4449C97.3977 102.734 95.7227 101.059 95.7227 99.0121ZM95.7227 77.0138V73.8871C95.7227 72.7593 96.2587 71.7803 97.059 71.0955H91.0699C89.0227 71.0955 87.3477 72.7705 87.3477 74.8177V77.9443L108.043 88.7388C109.644 89.5577 111.579 89.5577 113.18 88.7388L115.692 87.4286L95.7227 77.0138Z" fill="#3095CB"/>
<path d="M110.612 140.887C107.533 140.887 105.028 138.382 105.028 135.304C105.028 132.225 107.533 129.72 110.612 129.72C113.69 129.72 116.195 132.225 116.195 135.304C116.195 138.382 113.69 140.887 110.612 140.887ZM110.612 133.443C110.367 133.443 110.124 133.492 109.898 133.586C109.672 133.68 109.467 133.818 109.294 133.991C109.121 134.165 108.984 134.371 108.891 134.597C108.798 134.824 108.75 135.066 108.75 135.311C108.751 135.556 108.8 135.798 108.894 136.025C108.988 136.251 109.126 136.456 109.299 136.629C109.473 136.802 109.679 136.939 109.905 137.032C110.132 137.125 110.374 137.173 110.619 137.172C111.114 137.171 111.588 136.974 111.937 136.623C112.286 136.273 112.481 135.798 112.48 135.304C112.479 134.809 112.282 134.335 111.931 133.986C111.581 133.637 111.106 133.442 110.612 133.443ZM125.46 36.1512L128.091 33.5196L133.354 38.7828L130.723 41.4144L125.46 36.1512ZM140.59 51.2858L143.222 48.6541L148.485 53.9174L145.854 56.549L140.59 51.2858ZM124.812 53.9323L130.075 48.669L132.707 51.3006L127.443 56.5639L124.812 53.9323ZM139.943 38.8014L145.206 33.5382L147.838 36.1698L142.574 41.433L139.943 38.8014Z" fill="#A4AFC1"/>
<path d="M85.4866 57.1371H68.7366C65.1446 57.1371 62.2227 54.2151 62.2227 50.6232C62.2227 49.8828 61.9285 49.1727 61.405 48.6492C60.8815 48.1256 60.1714 47.8315 59.431 47.8315H57.5699V42.2482H59.431C64.0466 42.2482 67.806 46.0039 67.806 50.6232C67.806 51.1368 68.2229 51.5537 68.7366 51.5537H85.4866C85.7333 51.5537 85.97 51.4557 86.1446 51.2812C86.3191 51.1067 86.4171 50.87 86.4171 50.6232C86.4171 46.0039 90.1766 42.2482 94.7921 42.2482H96.6532V47.8315H94.7921C94.0517 47.8315 93.3416 48.1256 92.8181 48.6492C92.2946 49.1727 92.0004 49.8828 92.0004 50.6232C92.0004 54.2151 89.0785 57.1371 85.4866 57.1371Z" fill="#203049"/>
<path d="M96.899 131.582H57.3243C51.8154 131.582 47.3339 127.063 47.3339 121.505V52.3242C47.3339 46.7669 51.8154 42.2482 57.3243 42.2482H96.9027C102.408 42.2482 106.889 46.7669 106.889 52.3242V59.9287H101.306V52.3242C101.306 49.8452 99.3296 47.8315 96.899 47.8315H57.3243C54.8937 47.8315 52.9172 49.8452 52.9172 52.3242V121.509C52.9172 123.988 54.8937 126.002 57.3243 126.002H96.9027C99.3296 126.002 101.31 123.988 101.31 121.509V113.901H106.889V121.505C106.889 127.063 102.408 131.582 96.899 131.582Z" fill="#203049"/>
<path d="M130.153 105.526H91.07C87.478 105.526 84.5561 102.604 84.5561 99.0121V74.8177C84.5561 71.2257 87.478 68.3038 91.07 68.3038H130.153C133.745 68.3038 136.667 71.2257 136.667 74.8177V99.0121C136.667 102.604 133.745 105.526 130.153 105.526ZM91.07 73.8871C90.8232 73.8871 90.5865 73.9851 90.412 74.1597C90.2375 74.3342 90.1394 74.5709 90.1394 74.8177V99.0121C90.1394 99.5258 90.5563 99.9427 91.07 99.9427H130.153C130.4 99.9427 130.637 99.8446 130.811 99.6701C130.986 99.4956 131.084 99.2589 131.084 99.0121V74.8177C131.084 74.5709 130.986 74.3342 130.811 74.1597C130.637 73.9851 130.4 73.8871 130.153 73.8871H91.07Z" fill="#203049"/>
<path d="M110.604 92.1446C109.286 92.1446 107.973 91.8394 106.774 91.2252L86.0598 80.4196L88.6393 75.4691L109.335 86.2635C110.117 86.6618 111.118 86.6581 111.914 86.2523L132.588 75.4691L135.167 80.4196L114.472 91.2141C113.274 91.8262 111.949 92.1452 110.604 92.1446Z" fill="#203049"/>
<defs>
<filter id="filter0_d_402_217" x="0" y="0" width="180.753" height="173.83" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="12.5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0.211011 0 0 0 0 0.586538 0 0 0 0.2 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_402_217"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_402_217" result="shape"/>
</filter>
</defs>
</svg>

`;

const OTPScreen: React.FC = () => {
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const route = useRoute();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(150); 
  const phoneNumber = (route.params as { phoneNumber?: string })?.phoneNumber || '';
  const { setToken } = useAuthStore();
  
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useGetOtp();

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

  const handleVerify = () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit code');
      return;
    }

    const cleanedOtp = otp.replace(/\D/g, '');
    
    const cleanedPhone = phoneNumber.replace(/[^\d+]/g, '');
    
    const formattedPhone = cleanedPhone.startsWith('+') ? cleanedPhone : `+${cleanedPhone}`;


    verifyOtpMutation.mutate(
      { phone: formattedPhone, otp: cleanedOtp },
      {
        onSuccess: (response: any) => {
          console.log('response', response);
          setToken({
            access_token: response.tokens.access,
            refresh_token: response.tokens.refresh,
          });
          navigation.navigate('ProfileSetup');
        },
        onError: (error: any) => {
          console.log('Error verifying OTP:', error.response.data.error);
          Alert.alert('Error', error.response.data.error);
        },
      }
    );
  };

  const handleResendOTP = () => {
    // Clean phone number - remove formatting but keep + and digits
    const cleanedPhone = phoneNumber.replace(/[^\d+]/g, '');
    const formattedPhone = cleanedPhone.startsWith('+') ? cleanedPhone : `+${cleanedPhone}`;

    console.log('Resending OTP to:', formattedPhone);

    resendOtpMutation.mutate(
      { phone: formattedPhone },
      {
        onSuccess: () => {
          // Reset timer to 2:30
          setTimer(150);
          Alert.alert('Success', 'OTP resent successfully!');
        },
        onError: (error: any) => {
          console.log('Error resending OTP:', error);
          console.log('Error response:', error?.response?.data);
          const errorMessage = 
            error?.response?.data?.message || 
            error?.response?.data?.error || 
            error?.response?.data?.phone?.[0] ||
            error?.response?.data?.detail ||
            error?.message || 
            'Failed to resend OTP. Please try again.';
          Alert.alert('Error', errorMessage);
        },
      }
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundLight} />
      {/* Header */}
      <Header title="Verification" showBackButton />
      
      <KeyboardAwareScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        keyboardShouldPersistTaps="handled"
      >
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
            title={verifyOtpMutation.isPending ? 'Verifying...' : 'Verify & Continue'}
            onPress={handleVerify}
            loading={verifyOtpMutation.isPending}
            style={styles.verifyButton}
          />

          {/* Resend Section */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code?</Text>
            <TouchableOpacity 
              onPress={handleResendOTP} 
              disabled={timer > 0 || resendOtpMutation.isPending}
            >
              <Text style={[styles.resendLink, (timer > 0 || resendOtpMutation.isPending) && styles.resendLinkDisabled]}>
                {resendOtpMutation.isPending ? 'Sending...' : 'Resend OTP'}
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
  illustrationContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: Colors.backgroundLight,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    padding: 24,
    paddingTop: 20,
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

