/**
 * ParcelBuddy React Native App
 * Main App Component with Navigation and Authentication Setup
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import navigation and auth
import { RootNavigator, AuthProvider } from './src/navigation';
import { ToastProvider } from './src/components/Toast';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ToastProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <NavigationContainer>
            <AuthProvider>
              <RootNavigator />
            </AuthProvider>
          </NavigationContainer>
        </ToastProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;
