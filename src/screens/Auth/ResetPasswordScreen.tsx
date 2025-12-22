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
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import GradientButton from '../../components/GradientButton';
import { useResetPassword } from '../../hooks/useAuthMutations';
import { useToast } from '../../components/Toast';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuthStore } from '../../services/store';

const { width, height } = Dimensions.get('window');

type ResetPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ResetPassword'>;

const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>();
  const route = useRoute();
  const email = (route.params as { email?: string })?.email || '';
  const otp = (route.params as { otp?: string })?.otp || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const resetPasswordMutation = useResetPassword();
  const { showError, showSuccess } = useToast();
  const { setToken, setUser } = useAuthStore();

  const handleResetPassword = () => {
    if (!newPassword.trim()) {
      showError('Please enter a new password');
      return;
    }

    if (newPassword.length < 6) {
      showError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    resetPasswordMutation.mutate(
      { 
        email: email.trim(), 
        otp: otp.trim(),
        new_password: newPassword.trim(), 
        confirm_password: confirmPassword.trim() 
      },
      {
        onSuccess: (response: any) => {
          console.log('Reset Password Response:', response);
          showSuccess('Password reset successfully!');
          
          // Store tokens if provided
          // if (response.tokens) {
          //   setToken({
          //     access_token: response.tokens.access,
          //     refresh_token: response.tokens.refresh,
          //   });
          // }
          
          // Store user data if provided
          // if (response.profile) {
          //   setUser(response.profile);
          // }
          
          // Navigate based on profile setup status
          // if (response.profile_setup === false) {
          //   navigation.reset({
          //     index: 0,
          //     routes: [{ name: 'ProfileSetup' }],
          //   });
          // } else {
            // Navigate to root MainApp
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'MainApp' as never }],
              })
            );
          // }
        },
        onError: (error: any) => {
          console.log('Reset Password Error:', error);
          const errorMessage = 
            error?.response?.data?.message || 
            error?.response?.data?.error || 
            error?.response?.data?.detail ||
            error?.message || 
            'Failed to reset password. Please try again.';
          showError(errorMessage);
        },
      }
    );
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
          <Text style={styles.cardTitle}>Reset Password</Text>
          <View style={styles.backButton} />
        </View>

        {/* Description */}
        <Text style={styles.description}>
          Enter your new password below
        </Text>

        {/* New Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>New Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter new password"
              placeholderTextColor={Colors.textLight}
              value={newPassword}
              onChangeText={setNewPassword}
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

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Confirm new password"
              placeholderTextColor={Colors.textLight}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              activeOpacity={0.7}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color={Colors.textLight} />
              ) : (
                <Eye size={20} color={Colors.textLight} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Reset Password Button */}
        <GradientButton
          title={resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
          onPress={handleResetPassword}
          loading={resetPasswordMutation.isPending}
          style={styles.resetButton}
          disabled={resetPasswordMutation.isPending}
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
    marginBottom: 10,
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
  resetButton: {
    marginTop: 10,
    marginBottom: 24,
  },
  logo: {
    width: 130,
    height: 140,
  },
});

export default ResetPasswordScreen;



