import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  Image,
} from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../../contexts/AuthContext';
import { SvgXml } from 'react-native-svg';
import { Colors } from '../../constants/colors';
import { Fonts } from '../../constants/fonts';
import { EllipseBottom, EllipseTop } from '../../constants/svg';
import { useQuery } from '@tanstack/react-query';
import { getMyProfile } from '../../services/api/profile';
import { useAuthStore, useSearchFormStore, useCreateFormStore } from '../../services/store';

// Store for pending deep link (shared with App.tsx)
export let pendingDeepLink: string | null = null;
export const setPendingDeepLink = (url: string | null) => {
  pendingDeepLink = url;
};
export const getPendingDeepLink = (): string | null => {
  return pendingDeepLink;
};
export const clearPendingDeepLink = () => {
  pendingDeepLink = null;
};

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  MainApp: undefined;
};

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;


const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);
  const {token, setUser, user} = useAuthStore();
  const { clearSearchForm } = useSearchFormStore();
  const { clearCreateForm } = useCreateFormStore();

  const {data: profile, isLoading} = useQuery({
    queryKey: ['profile'],
    queryFn: () => getMyProfile(),
    enabled: !!token,
  });
  console.log('profile', profile);

  useEffect(() => { 

    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate based on authentication state after 3 seconds
    // const timer = setTimeout(() => {
    //   if (isAuthenticated) {
    //     navigation.replace('MainApp');
    //   } else {
    //     navigation.replace('Auth');
    //   }
    // }, 3000);

    // return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, navigation, clearSearchForm, clearCreateForm]);

  useEffect(() => {
    // clearSearchForm();
    // clearCreateForm();
    const timer = setTimeout(() => {
      // Check for pending deep link
      const deepLink = getPendingDeepLink();
      const isPaymentDeepLink = deepLink?.includes('parcelbuddy://payment') ?? false;
      
      if (!token?.access_token) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        });
      } else if (profile) {
        setUser(profile);
        
        // If we have a payment deep link, navigate directly to PaymentHistory screen
        if (isPaymentDeepLink && deepLink) {
          console.log('SplashScreen: Navigating to PaymentHistory via deep link');
          
          // Clear the pending deep link
          clearPendingDeepLink();
          
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'MainApp',
                state: {
                  routes: [
                    { name: 'Search' },
                    { name: 'Create' },
                    { name: 'Track' },
                    { name: 'Chat' },
                    {
                      name: 'Profile',
                      state: {
                        routes: [
                          { name: 'ProfileList' },
                          { name: 'PaymentHistory' },
                        ],
                        index: 1,
                      },
                    },
                  ],
                  index: 4, // Profile tab
                },
              },
            ],
          });
        } else {
          // Normal navigation to MainApp
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainApp' }],
          });
        }
      } else if (!user?.profile_setup) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Auth', params: { screen: 'ProfileSetup' } }],
        });
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [profile]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.backgroundLight} />
      
      {/* Top Left Ellipse */}
      <View style={styles.topEllipse}>
        <SvgXml xml={EllipseTop} width={480} height={340} />
      </View>

      {/* Bottom Right Ellipse */}
      <View style={styles.bottomEllipse}>
        <SvgXml xml={EllipseBottom} width={480} height={340} />
      </View>

      {/* Center Content */}
      <Animated.View 
        style={[
          styles.centerContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/Logo.png')} style={styles.logo} />
        </View>
        <Text style={styles.title}>ParcelBuddy</Text>

        {/* Tagline */}
        <Text style={styles.tagline}>
          Your bag's extra space, someone's{'\n'}perfect place.
        </Text>
      </Animated.View>

      {/* Loading Indicator */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    position: 'relative',
  },
  topEllipse: {
    position: 'absolute',
    top: 0,
    left: -70,
  },
  bottomEllipse: {
    position: 'absolute',
    bottom: 0,
    right: -70,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  logoContainer: {
   // marginBottom: 20,
  },
  title: {
    fontSize: Fonts.xxxl,
    fontWeight: Fonts.weightBold,
    color: Colors.textPrimary,
    marginTop: 20,
    marginBottom: 10,
  },
  tagline: {
    fontSize: Fonts.base,
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
    alignItems: 'center',
    width: '100%',
    zIndex: 10,
  },
  loadingBar: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(32, 48, 73, 0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingProgress: {
    height: '100%',
    backgroundColor: Colors.primaryCyan,
    borderRadius: 2,
  },
  logo: {
    width: 130,
    height: 140,
  },
});

export default SplashScreen;