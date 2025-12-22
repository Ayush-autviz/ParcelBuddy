import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import navigators
import SplashScreen from '../screens/Splash/SplashScreen';
import AuthNavigator from './AuthNavigator';
import BottomTabNavigator from './BottomTabNavigator';
import SuspendedScreen from '../screens/Auth/SuspendedScreen';
import { useAuth } from '../contexts/AuthContext';

// Define the root stack navigator param list
export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  MainApp: undefined;
  Suspended: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Splash screen - shown briefly on app start */}
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{
          animationTypeForReplace: 'push',
        }}
      />

      {/* Auth flow - login/signup screens */}
      <Stack.Screen
        name="Auth"
        component={AuthNavigator}
        options={{
          animationTypeForReplace: isAuthenticated ? 'push' : 'pop',
        }}
      />

      {/* Main app - bottom tab navigator */}
      <Stack.Screen
        name="MainApp"
        component={BottomTabNavigator}
        options={{
          animationTypeForReplace: 'push',
        }}
      />

      {/* Suspended screen - shown when user account is suspended */}
      <Stack.Screen
        name="Suspended"
        component={SuspendedScreen}
        options={{
          headerShown: false,
          gestureEnabled: false, // Prevent going back when suspended
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
