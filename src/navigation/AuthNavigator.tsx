import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import auth screens
import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import OTPScreen from '../screens/Auth/OTPScreen';

// Define the auth stack navigator param list
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  OTPScreen: {
    phoneNumber: string;
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
    </Stack.Navigator>
  );
};

export default AuthNavigator;
