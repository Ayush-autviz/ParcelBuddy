import Geolocation from 'react-native-geolocation-service';
import { Platform, PermissionsAndroid, Linking } from 'react-native';

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
export const openSettings = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
};

export interface PermissionResult {
  granted: boolean;
  shouldOpenSettings: boolean;
  error?: string;
}

/**
 * Get current location coordinates
 * @returns Promise with location coordinates or permission result if denied
 */
export const getCurrentLocation = async (): Promise<LocationCoordinates | PermissionResult> => {
  const permissionResult = await requestPermission();
  
  if (!permissionResult.granted) {
    return {
      ...permissionResult,
      error: permissionResult.shouldOpenSettings
        ? 'Location permission is required to use this feature. Please enable it in your device settings.'
        : 'Location permission is required.',
    };
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
          resolve({
            granted: false,
            shouldOpenSettings: true,
            error: 'Location permission is required. Please enable it in your device settings.',
          });
        } else {
          // Other location errors
          reject({
            granted: false,
            shouldOpenSettings: false,
            error: 'Failed to get location: ' + error.message,
          });
        }
      },
      // { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  });
};


