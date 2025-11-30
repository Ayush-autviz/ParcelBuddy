// /**
//  * ParcelBuddy React Native App
//  * Main App Component with Navigation and Authentication Setup
//  */

// import React, { useEffect, useRef } from 'react';
// import { Linking, StatusBar, useColorScheme } from 'react-native';
// import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
// import { CommonActions } from '@react-navigation/native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// // Import navigation and auth
// import { RootNavigator, AuthProvider } from './src/navigation';
// import { ToastProvider } from './src/components/Toast';
// import { Colors } from './src/constants/colors';
// import { RootStackParamList } from './src/navigation/RootNavigator';

// // Create a client
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       retry: 1,
//       refetchOnWindowFocus: false,
//     },
//   },
// });

// function App() {
//   const isDarkMode = useColorScheme() === 'dark';
//   const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

//   // Function to handle payment deep link navigation
//   const handlePaymentDeepLink = (url: string) => {
//     try {
//       console.log('Received payment URL:', url);
      
//       // Parse URL to extract query parameters
//       // Format: parcelbuddy://payment?status=success
//       const statusMatch = url.match(/[?&]status=([^&]*)/);
//       const status = statusMatch ? statusMatch[1] : null;
      
//       // Navigate based on status
//       if (navigationRef.current?.isReady()) {
//         if (status === 'success') {
//           // Navigate to Subscription screen
//           navigationRef.current.dispatch(
//             CommonActions.navigate({
//               name: 'MainApp',
//               params: {
//                 screen: 'Profile',
//                 params: {
//                   screen: 'Subscription',
//                 },
//               },
//             } as any)
//           );
//         } else {
//           // Navigate to Payment History screen
//           navigationRef.current.dispatch(
//             CommonActions.navigate({
//               name: 'MainApp',
//               params: {
//                 screen: 'Profile',
//                 params: {
//                   screen: 'PaymentHistory',
//                 },
//               },
//             } as any)
//           );
//         }
//       }
//     } catch (error) {
//       console.error('Error handling payment deep link:', error);
//     }
//   };

//   useEffect(() => {
//     const onReceiveURL = ({ url }: { url: string }) => {
//       console.log('Received URL:', url);
      
//       // Check if it's a payment deep link
//       if (url.includes('parcelbuddy://payment')) {
//         handlePaymentDeepLink(url);
//       }
//     };
  
//     // Listen for foreground links
//     const subscription = Linking.addEventListener('url', onReceiveURL);
  
//     // Handle cold start deep link
//     Linking.getInitialURL()
//       .then(url => {
//         if (url) {
//           console.log('Initial URL:', url);
//           // Check if it's a payment deep link
//           if (url.includes('parcelbuddy://payment')) {
//             // Add a small delay to ensure navigation is ready
//             setTimeout(() => {
//               handlePaymentDeepLink(url);
//             }, 1000);
//           }
//         }
//       })
//       .catch(console.warn);
  
//     return () => {
//       // for new RN versions (subscription.remove exists)
//       if (subscription?.remove) {
//         subscription.remove();
//         return;
//       }
  
//       // fallback for Android old API
//       Linking.removeAllListeners('url');
//     };
//   }, []);
  
  
//   const linking = {
//     prefixes: ['parcelbuddy://'],
//   };
  


//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <QueryClientProvider client={queryClient}>
//         <SafeAreaProvider>
//           <BottomSheetModalProvider>
//             <ToastProvider>
//               {/* <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} /> */}
//               <StatusBar backgroundColor={Colors.backgroundWhite} barStyle="dark-content" />
//               <NavigationContainer ref={navigationRef} linking={linking}>
//                 <AuthProvider>
//                   <RootNavigator />
//                 </AuthProvider>
//               </NavigationContainer>
//             </ToastProvider>
//           </BottomSheetModalProvider>
//         </SafeAreaProvider>
//       </QueryClientProvider>
//     </GestureHandlerRootView>
//   );
// }

// export default App;



/**
 * ParcelBuddy React Native App
 * App Component – Navigation + Deep Linking + Auth + Query Client
 */

import React, { useEffect, useRef } from 'react';
import { Linking, StatusBar, useColorScheme } from 'react-native';
import {
  NavigationContainer,
  NavigationContainerRef,
  CommonActions,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { RootNavigator, AuthProvider } from './src/navigation';
import { ToastProvider } from './src/components/Toast';
import { Colors } from './src/constants/colors';
import { RootStackParamList } from './src/navigation/RootNavigator';
import { navigationRef } from './src/navigation/navigationRef';

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Import deep link utilities from SplashScreen
import { setPendingDeepLink } from './src/screens/Splash/SplashScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  /**
   * -------------------------------------------------------
   * APP DEEP LINK HANDLING (Foreground + Cold Start)
   * All payment deep links navigate to PaymentHistory screen
   * -------------------------------------------------------
   */
  useEffect(() => {
    const onReceiveURL = ({ url }: { url: string }) => {
      console.log('Foreground deep link:', url);

      if (url.includes('parcelbuddy://payment')) {
        // For foreground deep links (app already open), navigate directly
        if (navigationRef.isReady()) {
          navigationRef.dispatch(
            CommonActions.navigate({
              name: 'MainApp',
              params: {
                screen: 'Profile',
                params: {
                  screen: 'PaymentHistory',
                },
              },
            } as any)
          );
        }
      }
    };

    // Listen while app is open
    const subscription = Linking.addEventListener('url', onReceiveURL);

    // Handle cold start (app opened from deep link)
    Linking.getInitialURL()
      .then(initialUrl => {
        if (initialUrl?.includes('parcelbuddy://payment')) {
          console.log('Cold start deep link:', initialUrl);
          // Store the deep link - SplashScreen will handle navigation
          setPendingDeepLink(initialUrl);
        }
      })
      .catch(console.warn);

    // Cleanup
    return () => {
      if (subscription?.remove) subscription.remove();
      else Linking.removeAllListeners('url');
    };
  }, []);

  /**
   * -------------------------------------------------------
   * React Navigation Deep Linking Config
   * -------------------------------------------------------
   */
  const linking = {
    prefixes: ['parcelbuddy://'],
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <ToastProvider>
              <StatusBar backgroundColor={Colors.backgroundWhite} barStyle="dark-content" />

              <NavigationContainer ref={navigationRef} linking={linking}>
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
