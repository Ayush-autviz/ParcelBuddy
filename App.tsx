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
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

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

  const handleNotificationNavigation = (data: any) => {
    let type = data?.type;
    console.log('🔔 [App] Handling push notification navigation');
    console.log('🔔 [App] Data:', JSON.stringify(data, null, 2));

    // Fallback logic if type is missing
    if (!type) {
      if (data?.ride_id) {
        type = 'ride';
        console.log('🔔 [App] Inferred type "ride" from ride_id');
      } else if (data?.roomId || data?.chat_room_id) {
        type = 'chat';
        console.log('🔔 [App] Inferred type "chat" from roomId/chat_room_id');
      }
    }

    console.log('🔔 [App] Final Type:', type);
    console.log('🔔 [App] Navigation Ready:', navigationRef.isReady());

    if (!type) {
      console.log('⚠️ [App] No notification type found, aborting navigation');
      return;
    }

    if (navigationRef.isReady()) {
      let targetTab = 'Search';
      let targetScreen = 'SearchList';

      switch (type) {
        case 'ride':
        case 'request':
          targetTab = 'Track';
          targetScreen = 'TrackList';
          break;
        case 'chat':
          targetTab = 'Chat';
          targetScreen = 'ChatList';
          break;
        case 'rating':
          targetTab = 'Profile';
          targetScreen = 'Ratings';
          break;
        case 'general':
        default:
          targetTab = 'Search';
          targetScreen = 'SearchList';
          break;
      }

      console.log(`🔔 [App] Navigating to ${targetTab} -> ${targetScreen}`);

      navigationRef.dispatch(
        CommonActions.navigate({
          name: 'MainApp',
          params: {
            screen: targetTab,
            params: {
              screen: targetScreen,
              params: data, // Pass the notification data key-values to the screen
            },
          },
        })
      );
    } else {
      console.log('❌ [App] Navigation not ready - cannot navigate');
    }
  };

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
      console.log('🔄 [App] Foreground notification received - Invalidating chat queries');
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      queryClient.invalidateQueries({ queryKey: ['chatList'] });

      // Request permissions if needed
      await notifee.requestPermission({
        sound: true,
        badge: true,
        alert: true,
      });

      // await notifee.deleteChannel('default');

      // Create single channel (Android)
      await notifee.createChannel({
        id: 'default_channel',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
        vibration: true,
        sound: 'default',
      });

      // Display a notification
      await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        data: remoteMessage.data,
        ios: {
          sound: 'default',
        },
        android: {
          channelId: 'default_channel',
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
          sound: 'default',
        },
      });
    });

    return unsubscribe;
  }, [queryClient]);

  // Handle foreground notification interaction
  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      console.log(`🔔 [App] Foreground Event: ${type} (PRESS=${EventType.PRESS}, ACTION_PRESS=${EventType.ACTION_PRESS})`);
      switch (type) {
        case EventType.PRESS:
        case EventType.ACTION_PRESS:
          console.log('🔔 [App] User pressed foreground notification', detail.notification);
          if (detail.notification?.data) {
            handleNotificationNavigation(detail.notification.data);
          } else {
            console.log('⚠️ [App] No data in foreground notification');
          }
          break;
      }
    });
  }, []);

  // Handle background and quit state notifications
  useEffect(() => {
    // App opened from background
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('🔔 [App] Notification opened app from background:', remoteMessage);
      handleNotificationNavigation(remoteMessage.data);
    });

    // App opened from quit state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('🔔 [App] Notification opened app from quit state:', remoteMessage);
          if (remoteMessage.data?.type) {
            console.log('🔔 [App] Waiting for app initialization before navigation...');
            // Wait for navigation to be ready and splash screen to likely finish
            setTimeout(() => {
              console.log('🔔 [App] Executing delayed quit-state navigation');
              handleNotificationNavigation(remoteMessage.data);
            }, 2500);
          }
        } else {
          console.log('🔔 [App] No initial notification found');
        }
      });
  }, []);


  useEffect(() => {
    const onReceiveURL = ({ url }: { url: string }) => {
      console.log('Foreground deep link:', url);

      if (url.includes('parcelbuddy://payment')) {
        if (navigationRef.isReady()) {
          navigationRef.dispatch(
            CommonActions.navigate({
              name: 'MainApp',
              params: {
                screen: 'Search',
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
