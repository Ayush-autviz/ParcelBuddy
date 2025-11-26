import Geolocation from 'react-native-geolocation-service';
import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  altitudeAccuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export interface GeoPosition {
  coords: LocationCoordinates;
  timestamp: number;
}

/**
 * Check if location permission is granted
 */
const checkPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'ios') {
    const status = await Geolocation.requestAuthorization('whenInUse');
    return status === 'granted';
  }

  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  );
  return hasPermission;
};

/**
 * Request location permissions
 */
const requestPermission = async (): Promise<{ granted: boolean; shouldOpenSettings: boolean }> => {
  if (Platform.OS === 'ios') {
    const status = await Geolocation.requestAuthorization('whenInUse');
    if (status === 'granted') {
      return { granted: true, shouldOpenSettings: false };
    } else if (status === 'denied') {
      // Permission permanently denied, need to open settings
      return { granted: false, shouldOpenSettings: true };
    }
    return { granted: false, shouldOpenSettings: false };
  }

  // Android
  try {
    // First check if permission is already granted
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    
    if (hasPermission) {
      return { granted: true, shouldOpenSettings: false };
    }

    // Request permission
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'App needs access to your location.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return { granted: true, shouldOpenSettings: false };
    } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      // Permission was denied permanently (user selected "Don't ask again")
      return { granted: false, shouldOpenSettings: true };
    }
    
    // Permission denied but can ask again
    return { granted: false, shouldOpenSettings: false };
  } catch (error) {
    console.warn('Permission error:', error);
    return { granted: false, shouldOpenSettings: false };
  }
};

/**
 * Open app settings
 */
const openSettings = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
};

/**
 * Get current location coordinates
 * @returns Promise with location coordinates or void if permission denied
 */
export const getCurrentLocation = async (): Promise<LocationCoordinates | void> => {
  const permissionResult = await requestPermission();
  
  if (!permissionResult.granted) {
    if (permissionResult.shouldOpenSettings) {
      // Permission was permanently denied, show alert to open settings
      Alert.alert(
        'Location Permission Required',
        'Location permission is required to use this feature. Please enable it in your device settings.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Open Settings',
            onPress: () => {
              openSettings();
            },
          },
        ]
      );
    } else {
      Alert.alert('Permission Denied', 'Location permission is required.');
    }
    return;
  }

  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (position: GeoPosition) => {
        const coordinates: LocationCoordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
        };
        resolve(coordinates);
      },
      (error) => {
        console.error('Error getting location:', error.message);
        
        // Handle permission errors
        if (error.code === 1) {
          // Permission denied
          Alert.alert(
            'Location Permission Required',
            'Location permission is required. Please enable it in your device settings.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Open Settings',
                onPress: () => {
                  openSettings();
                },
              },
            ]
          );
        } else {
          // Other location errors
          Alert.alert('Error', 'Failed to get location: ' + error.message);
        }
        reject(error);
      },
      // { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  });
};


