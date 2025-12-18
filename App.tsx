import React, { useEffect, useRef } from 'react';
import { Linking, PermissionsAndroid, Platform, StatusBar, useColorScheme } from 'react-native';
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
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { AndroidImportance } from '@notifee/react-native';

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});


import { setPendingDeepLink } from './src/screens/Splash/SplashScreen';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  async function requestPermission() {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted');
      } else {
        console.log('Notification permission denied');
      }
    }
    else if (Platform.OS === 'ios') {
      // Add iOS notification permission request
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
      if (enabled) {
        console.log('iOS notification permission granted');
      } else {
        console.log('iOS notification permission denied');
      }
    }
  }
  
  useEffect(() => {
    requestPermission();
  }, []);
  
    // Handle foreground messages
    useEffect(() => {
      console.log('useEffect');
      const unsubscribe = messaging().onMessage(async remoteMessage => {
        console.log('Foreground message:', remoteMessage);
  
        console.log('Notification type:', remoteMessage.data?.type);
  
        // Invalidate unread count query to update notification count in drawer
        queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
  
        // Request permissions if needed
        await notifee.requestPermission({
          sound: true,
          badge: true,
          alert: true,
        });
  
        // await notifee.deleteChannel('default');
  
        // Create single channel (Android)
        await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
          vibration: true,
          sound: 'default',
        });
  
        // Display a notification
        await notifee.displayNotification({
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          ios: {
            sound: 'default',
          },
          android: {
            channelId: 'default',
            pressAction: {
              id: 'default',
            },
            sound: 'default',
          },
        });
      });
  
      return unsubscribe;
    }, [queryClient]);  


  useEffect(() => {
    const onReceiveURL = ({ url }: { url: string }) => {
      console.log('Foreground deep link:', url);

      if (url.includes('parcelbuddy://payment')) {
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

  const linking = {
    prefixes: ['parcelbuddy://'],
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <ToastProvider>
              <StatusBar translucent={true} backgroundColor={'transparent'} barStyle="dark-content" />

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
