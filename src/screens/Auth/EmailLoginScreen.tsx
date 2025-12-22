import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import GradientButton from '../../components/GradientButton';
import { useLoginEmail } from '../../hooks/useAuthMutations';
import { useToast } from '../../components/Toast';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuthStore } from '../../services/store';

const { width, height } = Dimensions.get('window');

type EmailLoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'EmailLogin'>;

const EmailLoginScreen: React.FC = () => {
  const navigation = useNavigation<EmailLoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const loginMutation = useLoginEmail();
  const { showError, showSuccess } = useToast();
  const { setToken, setUser } = useAuthStore();

  const handleLogin = () => {
    if (!email.trim()) {
      showError('Please enter your email address');
      return;
    }

    if (!password.trim()) {
      showError('Please enter your password');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      showError('Please enter a valid email address');
      return;
    }

    loginMutation.mutate(
      { email: email.trim(), password: password.trim() },
      {
        onSuccess: (response: any) => {
          console.log('Email Login Response:', response);
          
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
          console.log('Email Login Error:', error.response);
          const errorMessage = 
            error?.response?.data?.error || 
            error?.response?.data?.message || 
            error?.response?.data?.detail ||
            error?.message || 
            'Failed to login. Please try again.';
          showError(errorMessage);
        },
      }
    );
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleBackPress = () => {
    navigation.goBack();
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
          <Text style={styles.cardTitle}>Login with Email</Text>
          <View style={styles.backButton} />
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={Colors.textLight}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter your password"
              placeholderTextColor={Colors.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}
            >
              {showPassword ? (
                <EyeOff size={20} color={Colors.textLight} />
              ) : (
                <Eye size={20} color={Colors.textLight} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot Password Link */}
        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={handleForgotPassword}
          activeOpacity={0.7}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Alternative Login Options */}
        <View style={styles.alternativeContainer}>
          <Text style={styles.alternativeText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Login', { showOtpFlow: true });
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.alternativeLinkText}>Signup</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <GradientButton
          title={loginMutation.isPending ? 'Logging in...' : 'Login'}
          onPress={handleLogin}
          loading={loginMutation.isPending}
          style={styles.loginButton}
          disabled={loginMutation.isPending}
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
    marginBottom: 20,
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
  inputContainer: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: Fonts.base,
    fontWeight: Fonts.weightSemiBold,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  input: {
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 12,
    backgroundColor: Colors.backgroundGray,
    height: 55,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: Fonts.base,
    color: Colors.textPrimary,
  },
  eyeIcon: {
    padding: 16,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: Fonts.sm,
    color: Colors.primaryCyan,
    fontWeight: Fonts.weightMedium,
  },
  loginButton: {
    marginBottom: 24,
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
  logo: {
    width: 130,
    height: 140,
  },
});

export default EmailLoginScreen;

