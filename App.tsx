/**
 * ParcelBuddy React Native App
 * Main App Component with Navigation and Authentication Setup
 */

import React, { useEffect } from 'react';
import { Linking, StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import navigation and auth
import { RootNavigator, AuthProvider } from './src/navigation';
import { ToastProvider } from './src/components/Toast';
import { Colors } from './src/constants/colors';

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

//   useEffect(() => {
//     // handles deep link when app is already open
//     Linking.addEventListener('url', evt => {
//       console.log(evt.url);
//     });

//     // handles deep link when app is not already open
//     Linking.getInitialURL()
//       .then(url => console.log('Initial URL:', url))
//       .catch(console.warn);

//   return () => {
//     // clears listener when component unmounts
//     Linking.removeAllListeners('url');
//   };
// }, []);


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <ToastProvider>
              {/* <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} /> */}
              <StatusBar backgroundColor={Colors.backgroundWhite} barStyle="dark-content" />
              <NavigationContainer>
                <AuthProvider>
                  <RootNavigator />
                </AuthProvider>
              </NavigationContainer>
            </ToastProvider>
          </BottomSheetModalProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default App;
