import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { SvgXml } from 'react-native-svg';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from 'react-native-international-phone-number';
import { ChevronDown } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import GradientButton from '../../components/GradientButton';

const { width, height } = Dimensions.get('window');

// Logo SVG


type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();
  const phoneInputRef = useRef(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [loading, setLoading] = useState(false);

  const handleGetOTP = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your mobile number');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual OTP API call
      console.log('OTP request for:', countryCode, phoneNumber);

      // Simulate API call
      await new Promise<void>((resolve) => setTimeout(resolve, 2000));

      Alert.alert('Success', 'OTP sent successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to OTP verification screen
            navigation.navigate('OTPScreen', { phoneNumber: `${countryCode}${phoneNumber}` });
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTermsPress = () => {
    Alert.alert('Terms of Service', 'Read our terms of service here');
  };

  const handlePrivacyPress = () => {
    Alert.alert('Privacy Policy', 'Read our privacy policy here');
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
          {/* Welcome Title */}
          <Text style={styles.cardTitle}>Welcome to ParcelBuddy</Text>

          {/* Input Label */}
          <Text style={styles.inputLabel}>Enter your mobile number</Text>

          {/* Phone Number Input */}
          <View style={styles.phoneInputContainer}>
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
                  if (country?.callingCode && country.callingCode.length > 0) {
                    setCountryCode(`+${country.callingCode[0]}`);
                  }
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
          </View>

          {/* Get OTP Button with Gradient */}
          <GradientButton
            title={loading ? 'Sending OTP...' : 'Get OTP'}
            onPress={handleGetOTP}
            loading={loading}
            style={styles.otpButton}
          />

          {/* Terms and Privacy Policy */}
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.linkText} onPress={handleTermsPress}>
              Terms of Service
            </Text>
            {' and '}
            <Text style={styles.linkText} onPress={handlePrivacyPress}>
              Privacy Policy
            </Text>
          </Text>
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
    lineHeight: 24,
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
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minHeight: height * 0.6,
  },
  cardTitle: {
    fontSize: Fonts.xl,
    marginTop:10,
    marginBottom:30,
    fontWeight: Fonts.weightMedium,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  phoneInputContainer: {
    marginBottom: 24,
  },
  phoneInputWrapper: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    backgroundColor: Colors.backgroundGray,
    overflow: 'hidden',
    width: '100%',
  },
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
    marginBottom: 24,
  },
  termsText: {
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  linkText: {
    fontSize: Fonts.sm,
    color: Colors.textTertiary,
    textDecorationLine: 'underline',
    fontWeight: Fonts.weightSemiBold,
  },
  logo: {
    width: 130,
    height: 140,
  },
});

export default LoginScreen;
