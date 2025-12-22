import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput
} from 'react-native';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { SvgXml } from 'react-native-svg';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import PhoneInput from 'react-native-international-phone-number';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import GradientButton from '../../components/GradientButton';
import { useGetOtpEmail, useGoogleLogin, useVerifyOtpEmail, useResendOtpEmail } from '../../hooks/useAuthMutations';
import { useToast } from '../../components/Toast';
import AuthMethodButtons from '../../components/AuthMethodButtons';
import { useGoogleSignIn } from '../../hooks/useGoogleSignIn';
import { useAuthStore } from '../../services/store';
import OtpVerificationForm from '../../components/auth/OtpVerificationForm';

const { width, height } = Dimensions.get('window');

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const route = useRoute();
  // const phoneInputRef = useRef<any>(null);
  // const [phoneNumber, setPhoneNumber] = useState('');
  // const [countryCode, setCountryCode] = useState('');
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'auth-methods' | 'email-login' | 'otp-verification'>('auth-methods');
  
  // Check if we should show OTP flow from route params
  useEffect(() => {
    const params = route.params as { showOtpFlow?: boolean } | undefined;
    if (params?.showOtpFlow) {
      setStep('email-login');
    }
  }, [route.params]);
  
  const getOtpEmailMutation = useGetOtpEmail();
  const verifyOtpMutation = useVerifyOtpEmail();
  const resendOtpMutation = useResendOtpEmail();
  const googleLoginMutation = useGoogleLogin();
  const { showWarning, showError } = useToast();
  const { signIn: signInWithGoogle, isLoading: isGoogleSignInLoading } = useGoogleSignIn();
  const { setToken, setUser } = useAuthStore();

  const handleGetOTP = () => {
    if (!email.trim()) {
      showWarning('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showWarning('Please enter a valid email address');
      return;
    }

    // Call email OTP API
    getOtpEmailMutation.mutate(
      { email: email.trim() },
      {
        onSuccess: (response: any) => {
          console.log('Email OTP sent:', response);
          setStep('otp-verification');
        },
        onError: (error: any) => {
          console.log('Error sending OTP:', error);
          const errorMessage = error?.response?.data?.message || 
                              error?.response?.data?.error || 
                              error?.message || 
                              'Failed to send OTP. Please try again.';
          showError(errorMessage);
        },
      }
    );

    // Commented out phone-based OTP code
    // let fullPhoneNumber: string;
    // 
    // if (phoneInputRef.current?.getPhoneNumber) {
    //   fullPhoneNumber = phoneInputRef.current.getPhoneNumber();
    // } else {
    //   const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
    //   const countryCodeClean = countryCode.replace(/^\+/, '');
    //   fullPhoneNumber = `+${countryCodeClean}${cleanedPhoneNumber}`;
    // }
    //
    // if (!fullPhoneNumber.startsWith('+')) {
    //   fullPhoneNumber = `+${fullPhoneNumber}`;
    // }
    //
    // fullPhoneNumber = fullPhoneNumber.replace(/[^\d+]/g, '');
    //
    // if (!fullPhoneNumber || fullPhoneNumber.length < 10) {
    //   showWarning('Please enter a valid phone number');
    //   return;
    // }
    //
    // getOtpMutation.mutate(
    //   { phone: fullPhoneNumber },
    //   {
    //     onSuccess: (response: any) => {
    //       console.log('response', response);
    //       
    //       navigation.navigate('OTPScreen', { phoneNumber: fullPhoneNumber });
    //     },
    //     onError: (error: any) => {
    //       console.log('Error sending OTP:', error);
    //       const errorMessage = error?.response?.data?.message || 
    //                           error?.response?.data?.error || 
    //                           error?.message || 
    //                           'Failed to send OTP. Please try again.';
    //       showError(errorMessage);
    //     },
    //   }
    // );
  };

  const handleTermsPress = () => {
    // Terms of Service - can be implemented with navigation or web view
    console.log('Terms of Service');
  };

  const handlePrivacyPress = () => {
    // Privacy Policy - can be implemented with navigation or web view
    console.log('Privacy Policy');
  };

  const handleGooglePress = async () => {
    try {
      const result = await signInWithGoogle();
      if (result && result.idToken) {
        console.log('Google Sign-In Token:', result.idToken);
        
        // Call Google login API using React Query
        googleLoginMutation.mutate(
          { token: result.idToken },
          {
            onSuccess: (response: any) => {
              console.log('Google Login API Response:', response);
              
              // Store tokens
              if (response.tokens) {
                setToken({
                  access_token: response.tokens.access,
                  refresh_token: response.tokens.refresh,
                });
              }
              
              // Store user data
              if (response.profile) {
                setUser(response.profile);
              }
              
              // Navigate based on profile setup status
              if (response.profile_setup === false) {
                // Navigate to ProfileSetupScreen if profile is not set up
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'ProfileSetup' }],
                });
              } else {
                // Navigate to root MainApp
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'MainApp' as never }],
                  })
                );
              }
            },
            onError: (error: any) => {
              console.error('Google Login API Error:', error);
              const errorMessage = error?.response?.data?.message || 
                                  error?.response?.data?.error || 
                                  error?.message || 
                                  'Failed to login with Google';
              showError(errorMessage);
            },
          }
        );
      }
    } catch (error) {
      // Error is already handled in the hook
      console.error('Google Sign-In failed:', error);
    }
  };

  const handleEmailPress = () => {
    navigation.navigate('EmailLogin');
  };

  const handleApplePress = () => {
    // TODO: Implement Apple authentication
    console.log('Apple login');
  };

  const handleBackPress = () => {
    if (step === 'otp-verification') {
      setStep('email-login');
    } else {
      setStep('auth-methods');
    }
  };

  const handleVerifySuccess = (otp: string, response?: any) => {
    console.log('OTP verified:', response);
    navigation.reset({
      index: 0,
      routes: [{ name: 'CreatePassword', params: { email: email.trim() } }],
    });
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
          {step === 'auth-methods' ? (
            <>
          {/* Welcome Title */}
          <Text style={styles.cardTitle}>Welcome to ParcelBuddy</Text>
              
              {/* Auth Method Buttons */}
              <AuthMethodButtons
                onGooglePress={handleGooglePress}
                onEmailPress={handleEmailPress}
                onApplePress={handleApplePress}
              />
            </>
          ) : step === 'email-login' ? (
            <>
            <View style={styles.headerRow}>
              {/* Back Button */}
              {/* <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackPress}
                activeOpacity={0.7}
              >
                <ArrowLeft size={24} color={Colors.textPrimary} />
              </TouchableOpacity> */}

              {/* Title */}
              <Text style={styles.cardTitle}>Login with OTP</Text>
              {/* <View style={styles.backButton} /> */}
            </View>

              {/* Email Input */}
              <View style={styles.emailInputContainer}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.emailInput}
                  placeholder="Enter your email"
                  placeholderTextColor={Colors.textLight}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Get OTP Button with Gradient */}
              <GradientButton
                title={getOtpEmailMutation.isPending ? 'Sending OTP...' : 'Get OTP'}
                onPress={handleGetOTP}
                loading={getOtpEmailMutation.isPending}
                style={styles.otpButton}
                disabled={getOtpEmailMutation.isPending}
              />

              {/* Alternative Login Options */}
              <View style={styles.alternativeContainer}>
                <Text style={styles.alternativeText}>Already have an account? </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('EmailLogin');
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.alternativeLinkText}>Login</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              {/* Back Button */}
              <TouchableOpacity
                style={{justifyContent: 'space-between', alignItems: 'center'}}
                onPress={handleBackPress}
                activeOpacity={0.7}
              >
                <ArrowLeft size={24} color={Colors.textPrimary} />
              </TouchableOpacity>

              {/* Title */}
              <Text style={{fontSize: Fonts.xl, fontWeight: Fonts.weightBold, color: Colors.textPrimary, textAlign: 'center'}}>Verify OTP</Text>
              <View style={{width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start'}} />
            </View>

              {/* OTP Verification Form */}
              <OtpVerificationForm
                email={email}
                onVerifySuccess={handleVerifySuccess}
                verifyMutation={verifyOtpMutation}
                resendMutation={resendOtpMutation}
                initialTimer={60}
                verifyButtonText="Verify OTP"
                resendButtonText="Resend OTP"
              />
            </>
          )}
              {/* Commented out Phone Number Input */}
              {/* <Text style={styles.inputLabel}>Enter your mobile number</Text> */}
              {/* <View style={styles.phoneInputContainer}>
            <View style={styles.phoneInputWrapper}>
              <PhoneInput
                ref={phoneInputRef}
                defaultValue={phoneNumber}
                value={phoneNumber}
                defaultCountry="US"
                onChangePhoneNumber={(number) => {
                  setPhoneNumber(number);
                }}
                onChangeSelectedCountry={(country: any) => {
                    setCountryCode(country?.idd?.root);
                }}
                customCaret={() => <ChevronDown size={16} color="#666" />}
                phoneInputStyles={
                  {
                    container: {
                      borderWidth: 0,
                      borderRadius: 12,
                      backgroundColor: "#FFFFFF",
                      height: 55,
                    },
                    flagContainer: {
                      borderWidth: 0,
                      borderRadius: 12,
                      backgroundColor: "#FFFFFF",
                    },
                    divider: {
                      display: 'none',
                    },
                    callingCode: {
                      display: 'none',
                    },
                    input: {
                      paddingLeft: -10,
                    }
                  }
                }
                modalStyles={{
                  searchContainer: {
        
                  },
                  searchInput: {
                    backgroundColor: 'white',
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: '#E0E0E0',
                    padding: 14,
                    fontSize: 16,
                    color: '#203049',
                    fontWeight: '500',
                  },
                  countryItem: {
                    padding: 14,
                    borderColor: '#E0E0E0',
                    borderWidth: 1,
                    borderRadius: 14,
                  },
                }}
                placeholder="Enter mobile number"
              />
            </View>
              </View> */}

          {/* Terms and Privacy Policy */}
          {/* <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.linkText} onPress={handleTermsPress}>
              Terms of Service
            </Text>
            {' and '}
            <Text style={styles.linkText} onPress={handlePrivacyPress}>
              Privacy Policy
            </Text>
          </Text> */}
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
    // lineHeight: 24,
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
    justifyContent: 'center',
    marginBottom: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: Fonts.xl,
    marginTop:10,
    marginBottom:30,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  emailInputContainer: {
    marginBottom: 10,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    backgroundColor: Colors.backgroundGray,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: Fonts.base,
    color: Colors.textPrimary,
    height: 55,
  },
  // Commented out phone input styles
  // phoneInputContainer: {
  //   marginBottom: 24,
  // },
  // phoneInputWrapper: {
  //   borderWidth: 1,
  //   borderColor: Colors.borderLight,
  //   borderRadius: 12,
  //   backgroundColor: Colors.backgroundGray,
  //   overflow: 'hidden',
  //   width: '100%',
  // },
  textContainer: {
    backgroundColor: Colors.backgroundWhite,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  flagContainer: {
    backgroundColor: Colors.backgroundWhite,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderRightWidth: 1,
    borderRightColor: Colors.borderLight,
  },
  countryCodeText: {
    fontSize: Fonts.base,
    color: Colors.textPrimary,
    fontWeight: Fonts.weightSemiBold,
  },
  phoneNumberInput: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: Fonts.base,
    backgroundColor: Colors.backgroundWhite,
    color: Colors.textPrimary,
  },
  otpButton: {
    marginBottom: 16,
  },
  alternativeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  alternativeText: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
  },
  alternativeLinkText: {
    fontSize: Fonts.sm,
    color: Colors.primaryCyan,
    fontWeight: Fonts.weightMedium,
  },
  termsText: {
    fontSize: Fonts.sm,
    color: Colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  linkText: {
    fontSize: Fonts.sm,
    color: Colors.primaryCyan,
    textDecorationLine: 'underline',
    fontWeight: Fonts.weightMedium,
  },
  logo: {
    width: 130,
    height: 140,
  },
});

export default LoginScreen;
