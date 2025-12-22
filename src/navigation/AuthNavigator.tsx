import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import auth screens
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import OTPScreen from '../screens/Auth/OTPScreen';
import ProfileSetupScreen from '../screens/Auth/ProfileSetupScreen';
import AuthTermsPolicy from '../screens/Auth/AuthTermsPolicy';
import EmailLoginScreen from '../screens/Auth/EmailLoginScreen';
import CreatePasswordScreen from '../screens/Auth/CreatePasswordScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';
import VerifyResetOtpScreen from '../screens/Auth/VerifyResetOtpScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';

// Define the auth stack navigator param list
export type AuthStackParamList = {
  Login: {
    showOtpFlow?: boolean;
  } | undefined;
  Signup: undefined;
  OTPScreen: {
    email: string;
    // phoneNumber: string; // COMMENTED OUT - using email instead
  };
  ProfileSetup: {
    email?: string;
  } | undefined;
  AuthTermsPolicy: undefined;
  EmailLogin: undefined;
  CreatePassword: {
    email: string;
  };
  ForgotPassword: undefined;
  VerifyResetOtp: {
    email: string;
  };
  ResetPassword: {
    email: string;
    otp: string;
  };
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false, // We'll handle headers in screens
        cardStyle: { backgroundColor: '#f5f5f5' },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="OTPScreen" component={OTPScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="AuthTermsPolicy" component={AuthTermsPolicy} />
      <Stack.Screen name="EmailLogin" component={EmailLoginScreen} />
      <Stack.Screen name="CreatePassword" component={CreatePasswordScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="VerifyResetOtp" component={VerifyResetOtpScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
